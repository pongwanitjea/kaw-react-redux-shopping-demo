import { Card, CardBody, Typography } from "@material-tailwind/react";
import { OrderItemResponseBody, Product } from "../../models/apiModels";
import { hocLoader } from '../hocLoader';
import { Cart } from "../../slices/cartSlice";
import { useFetchProductQuery } from "../../slices/productSlice";

function ProductCheckoutV2Component({ item, data }: { item: Cart | OrderItemResponseBody, data: Product }) {
    return (
        <Card key={item.productId} className="common-card-shadow-hover">
            <CardBody className="flex flex-row items-center p-2">
                <img
                    src={data?.imageUrl}
                    alt={data?.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div className="flex-grow">
                    <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                        {data?.name}
                    </Typography>
                    <Typography variant="paragraph" className="text-gray-600 text-sm mb-1">
                        ฿{item.pricePerOne.toFixed(2)}
                    </Typography>
                    <Typography variant="paragraph" className="text-gray-600 text-sm">
                        Quantity: {item.selectedAmount}
                    </Typography>
                </div>
                <div className="flex flex-col items-end">
                    <Typography variant="h6" className="font-semibold text-gray-900">
                        ฿{(item.pricePerOne * item.selectedAmount).toFixed(2)}
                    </Typography>
                </div>
            </CardBody>
        </Card>
    );
}

export const ProductCheckoutV2 = hocLoader(
    ({ productId }: {productId: string}) => useFetchProductQuery({ productId }),
    'CARD_DEFAULT_SKELETON',
    ProductCheckoutV2Component
);