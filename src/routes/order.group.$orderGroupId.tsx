import { Link, createFileRoute, useParams } from '@tanstack/react-router';
import { Button, Card, CardBody, Typography } from '@material-tailwind/react';
import { getOrderGroupedByStore, useFetchOrderGroupQuery } from '../slices/orderSlice';
import { ProductCheckoutV2 } from '../components/cart/productCheckoutV2';
import { hocLoader } from '../components/hocLoader';
import { OrderItemResponseBody } from '../models/apiModels';
import { Store, useFetchStoreQuery } from '../slices/storeSlice';
import { beforeLoadRouteGuardLoginCheck } from '../util/beforeLoadRouteGuard';

export const Route = createFileRoute('/order/group/$orderGroupId')({
  beforeLoad: beforeLoadRouteGuardLoginCheck,
  component: OrderGroupIdPage,
});

function OrderGroupIdPage() {
  const { orderGroupId } = useParams({
    from: '/order/group/$orderGroupId',
  });

  const WrappedComponent = hocLoader(
    () => useFetchOrderGroupQuery({ orderGroupId: orderGroupId }),
    'FULL_PAGE_SPINNER',
    ({ data }: { data: OrderItemResponseBody[] }) => {
      const orderData = data;
      const orderGroupedByStore = getOrderGroupedByStore(orderData!);
      const storeIds = Object.keys(orderGroupedByStore);

      const totalItem = orderData.reduce((accum, curr) => accum + curr.selectedAmount, 0);
      const totalPrice = orderData.reduce((accum, curr) => accum + curr.selectedAmount * curr.pricePerOne, 0);

      return (
        <div className="common-container-margin">
          <Typography variant="h2" className="mb-4">Ordered Items</Typography>

          <Card className="mb-4">
            <CardBody>TODO Shipment Location UI</CardBody>
          </Card>
          {
            storeIds.map((storeId, index) => {
              const ordersOfThatStore = orderGroupedByStore[storeId];
              return (
                <>
                  <StoreName storeId={storeId} key={storeId}/>

                  <div className="common-product-container" key={storeId + index + "|divCommonProductContainer"}>
                    {ordersOfThatStore.map((item) => {
                      return (
                        <ProductCheckoutV2 item={item} productId={item.productId} key={storeId + item.productId + "|ProductCheckout"} />
                      );
                    })}
                  </div>
                </>
              );
            })
          }
          <Card className="common-card-shadow-hover">
            <CardBody>
              <>
                <div className="flex flex-col justify-center">
                  <Typography variant="h4" className="mb-2">Order Summary</Typography>
                  <Typography variant="h6" className="mb-2">Total Items: {totalItem}</Typography>
                  <Typography variant="h6" className="mb-4">Total Price: ฿{totalPrice.toFixed(2)}</Typography>
                </div>
              </>
            </CardBody>
          </Card>
          <footer className="common-fixed-footer">
            <Link to="/orders">
              <Button color="blue" className="mt-4">Go to All Orders</Button>
            </Link>
            <div className="pl-4 pr-4"></div>
          </footer>
          <div className="pb-32"></div>
        </div>
      );
    }
  );

  return <WrappedComponent />;
}

const StoreName = hocLoader(useFetchStoreQuery, 'ONE_LINE_SKELETON', ({ data }: { data: Store }) => (
  <Typography variant="h3" className="mb-4" key={data.id}>{data.name}</Typography>
));

