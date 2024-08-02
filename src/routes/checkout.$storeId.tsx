import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Button, Card, CardBody, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import { OrderResponseBodyFailure, OrderItemResponseBody as OrderResponseItem, isOrderResponseBodyFailure } from '../models/apiModels'
import { useCheckoutMutation } from '../slices/checkoutSlice';
import { ProductCheckoutV2 } from '../components/cart/productCheckoutV2';
import { globalErrorDialog } from '../components/error/globalErrorDialog';
import { selectCart, Cart, getCartGroupedByStore, clearCartSelectiveItems } from '../slices/cartSlice';
import { useFetchStoreQuery } from '../slices/storeSlice';
import { beforeLoadRouteGuardLoginCheck } from '../util/beforeLoadRouteGuard';

export const Route = createFileRoute('/checkout/$storeId')({
  beforeLoad: beforeLoadRouteGuardLoginCheck,
  component: CheckoutPage
});

function CheckoutPage() {
  let { storeId } = useParams({
    from: '/checkout/$storeId'
  });

  const cartAll = useAppSelector(selectCart);
  let cart: Cart[];
  if (storeId == "undefined") { // Tanstack Router parse as string
    // should show all but just selected
    cart = cartAll.filter(item => item.selected)
  } else {
    cart = cartAll.filter(item => item.storeId == storeId);
  }
  const cartGroupedByStore = getCartGroupedByStore(cart)
  const storeIds = Object.keys(cartGroupedByStore);

  const storeQueries = storeIds.map(storeId => useFetchStoreQuery({ storeId }));

  const dispatch = useAppDispatch();
  const totalItem = cart.reduce((accum, curr) => accum + curr.selectedAmount, 0)
  const totalPrice = cart.reduce((accum, curr) => accum + curr.selectedAmount * curr.pricePerOne, 0)
  const [checkoutButtonDisabled, setCheckoutButtonDisabled] = useState(false)
  const [checkoutMutate, { isLoading: isCheckingOut }] = useCheckoutMutation()
  const navigate = useNavigate()

  const checkout = async () => {
    const res = await checkoutMutate(cart).unwrap() as OrderResponseBodyFailure | OrderResponseItem[];
    try {
      if (isOrderResponseBodyFailure(res)) {
        globalErrorDialog.showError(`Code: ${res.statusCode}, ${res.statusDesc}` || "An unknown error occurred during checkout.");
      } else {
        dispatch(clearCartSelectiveItems(cart))
        navigate({ to: '/checkedOut/$orderGroupId', params: { orderGroupId: res[0].orderGroupId }, mask: { to: "/checkedOut/" } })
      }
    } catch (error) {
      globalErrorDialog.showError(`${error}` || "An unknown error occurred during checkout.");
    }

  }

  return (
    <div className="common-container-margin flex flex-col justify-center">
      <Card className="mb-4">
        <CardBody>TODO Shipment Location UI</CardBody>
      </Card>
      {
        storeIds.map((storeId, index) => {
          const cartOfThatStore = cartGroupedByStore[storeId];
          const { data: dataStore } = storeQueries[index];
          return (
            <>
              <Typography variant="h3" className="mb-4" key={storeId + "|Typography"}>{dataStore?.name}</Typography>
              <div className="common-product-container" key={storeId + "|divCommonProductContainer"}>
                {cartOfThatStore.map((item) => {
                  return (
                    <ProductCheckoutV2 item={item} productId={item.productId} key={storeId + item.productId + "|ProductCheckout"}/>
                  )
                })}
              </div>
            </>
          )
        }
        )
      }
      <Card className="common-card-shadow-hover">
        <CardBody>
          <div className="flex flex-col justify-center">
            <Typography variant="h4" className="mb-2">Order Summary</Typography>
            <Typography variant="h6" className="mb-2">Total Items: {totalItem}</Typography>
            <Typography variant="h6" className="mb-4">Total Price: ฿{totalPrice.toFixed(2)}</Typography>
          </div>
        </CardBody>
      </Card>
      <footer className="common-fixed-footer">
        {storeId === "undefined" ? <Link to="/cart">
          <Button color="blue" className="mt-4">Back to Cart</Button>
        </Link> : <Link to="/store/$storeId" params={{ storeId }}>
          <Button color="blue" className="mt-4">Back to Store</Button>
        </Link>
        }
        <div className="pl-4 pr-4"></div>
        <Button
          color="green"
          className="mt-4"
          onClick={checkout}
          disabled={checkoutButtonDisabled || isCheckingOut || totalItem <= 0}
        >
          {isCheckingOut ? 'Processing...' : 'Checkout'}
        </Button>
      </footer>
      <div className="pb-32"></div>
    </div>

  );
}