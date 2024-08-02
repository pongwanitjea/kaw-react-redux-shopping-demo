import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Store } from "./storeSlice";

export function StoreCard({ store }: { store: Store }) {

    return (<Card key={store.id} className="common-card-shadow-hover mb-2 list-view-sizing">
        <CardBody className="flex items-center">
            <div className="w-24 h-24 mr-4 flex-shrink-0">
                <img
                    src={store.imageUrl}
                    alt={store.name}
                    className="w-full h-full object-cover rounded"
                />
            </div>
            <div className="flex-grow">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {store.name}
                </Typography>
                <Typography>{store.description}</Typography>
            </div>
        </CardBody>
    </Card>)
}
