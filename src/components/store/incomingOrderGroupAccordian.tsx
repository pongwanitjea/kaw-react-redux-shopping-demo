import { Accordion, AccordionHeader, Typography, AccordionBody } from "@material-tailwind/react";
import { formatUnixTimestamp } from "../../util/util";
import { IncomingOrderCard } from "./incomingOrderCard";
import { useState } from "react";
import { OrderGroupedByGroupId } from "../../slices/orderSlice";

export function IncomingOrderGroupAccordian({ orderGroupedByGroupId, groupId }: { orderGroupedByGroupId: OrderGroupedByGroupId, groupId: string }) {
    const ordersOfGroupId = orderGroupedByGroupId[groupId];
    const totalItems = ordersOfGroupId.reduce((sum, current) => sum + current.selectedAmount, 0);
    const totalValue = ordersOfGroupId.reduce((sum, current) => sum + current.pricePerOne * current.selectedAmount, 0);
    const [accordianOpen, setAccordianOpen] = useState(false);

    return (
      <Accordion
        key={groupId}
        open={accordianOpen}
        className="mb-4 rounded-lg shadow-md border border-gray-200"
      >
        <AccordionHeader
          className="flex flex-col items-start p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setAccordianOpen(!accordianOpen)}
        >
          <Typography variant="h6" color="blue-gray" className="font-semibold">
            Order Time: {formatUnixTimestamp(ordersOfGroupId[0].time)}
          </Typography>
          <Typography color="gray" className="mt-1">
            Order From User ID: {ordersOfGroupId[0].userId}
          </Typography>
          <Typography color="gray" className="mt-1">
            Order Group ID: {groupId}
          </Typography>
          <Typography color="gray" className="mt-1">
            Total Items: {totalItems}
          </Typography>
          <Typography color="gray" className="mt-1">
            Total Value: ฿{totalValue}
          </Typography>
        </AccordionHeader>
        <AccordionBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordersOfGroupId.map(order => (
              <IncomingOrderCard
                order={order}
                key={`${order.orderGroupId}-${order.productId}-IncomingOrderCard`}
              />
            ))}
          </div>
        </AccordionBody>
      </Accordion>
    );
}