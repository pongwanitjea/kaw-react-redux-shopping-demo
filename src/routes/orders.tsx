import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useFetchOrdersQuery } from '../slices/orderSlice';
import { Accordion, AccordionBody, AccordionHeader, Typography } from '@material-tailwind/react';
import { formatUnixTimestamp } from "../util/util";
import { hocLoader } from '../components/hocLoader';
import { OrderGroupItem } from '../models/apiModels';
import { beforeLoadRouteGuardLoginCheck } from '../util/beforeLoadRouteGuard';

export const Route = createFileRoute('/orders')({
  beforeLoad: beforeLoadRouteGuardLoginCheck,
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();

  const WrappedOrdersPage = hocLoader(
    useFetchOrdersQuery, 
    'FULL_PAGE_SPINNER', 
    ({ data }: { data: OrderGroupItem[] }) => {
      const orderGroups = data;
      return (
        <div className="common-container-margin">
          {orderGroups.length > 0 ? (
            orderGroups.map((orderGroup, index) => {
              const orderGroupId = orderGroup.orderGroupId;
              const storeNamesSet = new Set<string>();
              orderGroup.stores.forEach(store => storeNamesSet.add(store.name));
              const storeNames = [...storeNamesSet].join(",");
              return (
                <Accordion key={orderGroupId + "|Accordion"} open={true} onClick={() => {
                          navigate({ to: "/order/group/$orderGroupId", params: { orderGroupId: orderGroupId } });
                        }}>
                  <AccordionHeader key={orderGroupId + "|AccordionHeader"} >
                    <div className="flex flex-row justify-start" key={orderGroupId}>
                      <Typography
                        variant="h3"
                        key={orderGroupId + "|TypographyOrderGroupLink"}
    
                      >
                        Orders from {storeNames}
                      </Typography>
                    </div>
                  </AccordionHeader>
                  <AccordionBody className="shadow-md" key={orderGroupId + "|AccordionBody"}>
                    <div className="flex flex-col justify-center">
                      <Typography variant="h6" className="mb-2">Total Items: {orderGroup.itemCount}</Typography>
                      <Typography variant="h6" className="mb-4">Total Price: ฿{orderGroup.totalPrice.toFixed(2)}</Typography>
                      <Typography variant="h6" className="mb-4">{formatUnixTimestamp(orderGroup.time)}</Typography>
                    </div>
                  </AccordionBody>
                </Accordion>
              );
            })
          ) : (
            <Typography variant="h4">No orders found</Typography>
          )}
          <div className="pb-32"></div>
        </div>
    );
  })
  return <WrappedOrdersPage />;

}
