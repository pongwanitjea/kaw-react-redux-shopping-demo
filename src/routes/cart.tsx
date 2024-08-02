import { createFileRoute } from '@tanstack/react-router';
import { useAppSelector } from '../store/hooks';
import { Typography } from '@material-tailwind/react';
import { CartStoreAccordian } from '../components/cart/cartStoreAccordian';
import { selectCartGroupedByStore } from '../slices/cartSlice';
import { beforeLoadRouteGuardLoginCheck } from '../util/beforeLoadRouteGuard';
import { CheckOutButton } from '../components/cart/checkOutButton';

export const Route = createFileRoute('/cart')({
  beforeLoad: beforeLoadRouteGuardLoginCheck,
  component: () => {
    const cartGroupedByStore = useAppSelector(selectCartGroupedByStore);
    const storeIds = Object.keys(cartGroupedByStore);
    return (
      <div className="common-container-margin">
        {storeIds.length > 0 ? (
          storeIds.map((storeId, index) => {
            const cartOfThatStore = cartGroupedByStore[storeId];
            return (<CartStoreAccordian storeId={storeId} cartOfThatStore={cartOfThatStore} key={storeId}/>);
          })
        ) : (
          <Typography variant="h4">Cart is empty</Typography>
        )}
        <footer className="common-fixed-footer">
          <div className="flex flex-col">
          <CheckOutButton storeId={null}/>
          </div>

        </footer>
        <div className="pb-32"></div>
      </div>
    );
  }
});