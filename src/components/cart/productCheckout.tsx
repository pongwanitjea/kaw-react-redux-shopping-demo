// import { Card, CardBody, Typography } from "@material-tailwind/react";
// import { Stock } from "../stock/stockSlice";
// import { Cart } from "./cartSlice";
// import { OrderItemResponseBody } from "../../models/apiModels";

// export function ProductCheckout({ item, stockItem }: { item: Cart | OrderItemResponseBody, stockItem: Stock | undefined }) {
//     return (<Card
//         key={item.productId}
//         className="common-card-shadow-hover"
//     >
//         <CardBody className="flex flex-row items-center p-2">
//             <img
//                 src={stockItem?.product.imageUrl}
//                 alt={stockItem?.product.name}
//                 className="w-20 h-20 object-cover rounded-lg mr-4"
//             />
//             <div className="flex-grow">
//                 <Typography variant="h6" className="font-bold text-gray-800 mb-1">
//                     {stockItem?.product.name}
//                 </Typography>
//                 <Typography variant="paragraph" className="text-gray-600 text-sm mb-1">
//                     ฿{item.pricePerOne.toFixed(2)}
//                 </Typography>
//                 <Typography variant="paragraph" className="text-gray-600 text-sm">
//                     Quantity: {item.selectedAmount}
//                 </Typography>
//             </div>
//             <div className="flex flex-col items-end">
//                 <Typography variant="h6" className="font-semibold text-gray-900">
//                     ฿{(item.pricePerOne * item.selectedAmount).toFixed(2)}
//                 </Typography>
//             </div>
//         </CardBody>
//     </Card>);
// }