import { Button, Typography } from '@material-tailwind/react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { beforeLoadRouteGuardLoginCheck } from '../util/beforeLoadRouteGuard';

export const Route = createFileRoute('/checkedOut/$orderGroupId')({
  beforeLoad: beforeLoadRouteGuardLoginCheck,
  component: checkedOut,
});

function checkedOut() {
  const { orderGroupId } = useParams({
    from: '/checkedOut/$orderGroupId'
  });
  const navigate = useNavigate()

  return (
    <div className="common-container-margin">
      <div className="flex flex-col items-center space-y-6">
        <Typography variant="h4" className="text-center">
          Your order has been successfully checked out.
        </Typography>
        <div className="flex flex-row space-x-4">
          <Button
            color="blue"
            className="px-6 py-2"
            onClick={() => {
              navigate({
                to: "/home"
              });
            }}
          >
            Return Home
          </Button>
          <Button
            color="green"
            className="px-6 py-2"
            onClick={() => {
              navigate({
                to: "/order/group/$orderGroupId",
                params: {
                  orderGroupId
                }
              });
            }}
          >
            View Order
          </Button>
        </div>
      </div>
    </div>
  );
}