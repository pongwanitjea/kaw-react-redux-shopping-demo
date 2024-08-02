import { createFileRoute } from '@tanstack/react-router'
import { getOrderGroupedByGroupId, useFetchOrdersOfStoreQuery } from '../slices/orderSlice'
import { Typography, Card, CardBody, Spinner, Accordion, AccordionHeader, AccordionBody } from '@material-tailwind/react';
import { useAppSelector } from '../store/hooks';
import { hocLoader } from '../components/hocLoader';
import { OrderItemResponseBody } from '../models/apiModels';
import { selectActiveSession } from '../slices/userSlice';
import { beforeLoadRouteGuardStoreOwnerCheck } from '../util/beforeLoadRouteGuard';
import { IncomingOrderGroupAccordian } from '../components/store/incomingOrderGroupAccordian';

export const Route = createFileRoute('/store/manage/order')({
  beforeLoad: beforeLoadRouteGuardStoreOwnerCheck,
  component: StoreManageOrder
})

export function StoreManageOrder() {

  const WrappedComponent = hocLoader(
    () => useFetchOrdersOfStoreQuery(null),
    'FULL_PAGE_SPINNER',
    ({ data }: { data: OrderItemResponseBody[] }) => {
      const activeSession = useAppSelector(selectActiveSession);

      const orderGroupedByGroupId = getOrderGroupedByGroupId(data || []);
      const groupIds = Object.keys(orderGroupedByGroupId);
      return (
        <div className="common-container-margin">
          <Typography variant="h2" className="mb-6 text-center">Incoming Orders of Store {activeSession.storeOwner}</Typography>

          {groupIds.flatMap((groupId) => {
            return (<IncomingOrderGroupAccordian orderGroupedByGroupId={orderGroupedByGroupId} groupId={groupId} key={groupId} />)
          })}
        </div>
      );
    }
  );

  return <WrappedComponent/>;

}