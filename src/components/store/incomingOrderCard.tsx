import { Card, CardBody, Typography } from "@material-tailwind/react";
import { OrderItemResponseBody, Product } from "../../models/apiModels";
import { hocLoader } from "../hocLoader";
import { useFetchProductQuery } from "../../slices/productSlice";

export function IncomingOrderCardComponent({ order, data }: { order: OrderItemResponseBody, data: Product }) {
    const productData = data;
    return (<Card key={`${order.orderGroupId}-${order.productId}`} className="hover:shadow-lg transition-shadow duration-300">
        <CardBody>
            <Typography variant="paragraph" color="gray" className="mb-4">
                {productData?.name}
            </Typography>
            <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">Quantity:</Typography>
                <Typography variant="paragraph">{order.selectedAmount}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">Price per Item:</Typography>
                <Typography variant="paragraph">฿{order.pricePerOne.toFixed(2)}</Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">Total Price:</Typography>
                <Typography variant="paragraph" className="font-bold">
                    ฿{(order.selectedAmount * order.pricePerOne).toFixed(2)}
                </Typography>
            </div>
        </CardBody>
    </Card>);
}


export const IncomingOrderCard = hocLoader(
    ({ order }: { order: OrderItemResponseBody }) => useFetchProductQuery({ productId: order.productId }),
    'CARD_DEFAULT_SKELETON',
    IncomingOrderCardComponent
);