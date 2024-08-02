import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Typography, Button, Input, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { useAppSelector } from '../store/hooks';
import { LoaderComponent } from '../components/loaderComponent';
import { createFileRoute, ErrorComponent, Outlet, useLocation } from '@tanstack/react-router';
import { getMustNotBeNull, getMaxLengthMessage } from '../util/util';
import { imageUrls } from '../mocks/handler';
import { StoreManageProduct } from './store.manage.product';
import { StoreManageOrder } from './store.manage.order';
import { hocLoader } from '../components/hocLoader';
import { StoreCard } from '../components/store/storeCard';
import { Store, useFetchStoreQuery, useUpdateStoreMutation } from '../slices/storeSlice';
import { selectActiveSession } from '../slices/userSlice';
import { beforeLoadRouteGuardStoreOwnerCheck } from '../util/beforeLoadRouteGuard';

export const Route = createFileRoute('/store/manage')({
    beforeLoad: beforeLoadRouteGuardStoreOwnerCheck,
    component: StoreManage,
    children: [
        {
            path: 'product',
            component: StoreManageProduct,
        },
        {
            path: 'order',
            component: StoreManageOrder,
        },
    ],
})


interface EditStoreForm {
    name: string;
    description: string;
    lat: number,
    long: number,
    imageUrl: string,
}

const MAX_STORE_NAME_LENGTH = 30;
const MAX_STORE_DESCRIPTION_LENGTH = 200;

function StoreManage() {
    const activeSession = useAppSelector(selectActiveSession);

    const WrappedComponent = hocLoader(
        () => useFetchStoreQuery({ storeId: activeSession?.storeOwner! }),
        'FULL_PAGE_SPINNER',
        ({ data }: { data: Store }) => {
            const dataFetchStore = data;
            const [isEditing, setIsEditing] = useState(false);
            const [updateStore] = useUpdateStoreMutation();
            const location = useLocation();

            const { control, handleSubmit, reset, formState: { errors } } = useForm<EditStoreForm>({
                reValidateMode: 'onChange',
                mode: 'all'
            });

            const onSubmit = async (data: EditStoreForm) => {
                try {
                    //TODO if no changes, dont call api
                    await updateStore({ id: activeSession.storeOwner!, ...data }).unwrap();
                    setIsEditing(false);
                } catch (error) {
                    console.error("Failed to update store:", error);
                }
            };

            return (
                <>
                    {location.pathname === '/store/manage' && (
                        <>
                            <div className="common-container-margin">
                                <StoreCard store={dataFetchStore!} />
                                <Button onClick={() => setIsEditing(true)} className="mt-4">Edit Store</Button>
                            </div>

                            <Dialog open={isEditing} handler={() => setIsEditing(false)}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <DialogHeader>Edit Store</DialogHeader>
                                    <DialogBody>
                                        <Controller
                                            name="name"
                                            control={control}
                                            defaultValue={dataFetchStore?.name}
                                            rules={{
                                                required: { value: true, message: getMustNotBeNull('Name') },
                                                maxLength: { value: MAX_STORE_NAME_LENGTH, message: getMaxLengthMessage(MAX_STORE_NAME_LENGTH) }
                                            }}
                                            render={({ field }) => (
                                                <div className="mb-4">
                                                    <Input {...field} label="Name" />
                                                    {errors.name ? (
                                                        <Typography color="red" variant="small">{errors.name.message}</Typography>
                                                    ) : (
                                                        <div className="h-5"></div>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="description"
                                            control={control}
                                            defaultValue={dataFetchStore?.description}
                                            rules={{
                                                required: { value: true, message: getMustNotBeNull('Description') },
                                                maxLength: { value: MAX_STORE_NAME_LENGTH, message: getMaxLengthMessage(MAX_STORE_DESCRIPTION_LENGTH) }
                                            }}
                                            render={({ field }) => (
                                                <div className="mb-4">
                                                    <Input {...field} label="Description" />
                                                    {errors.description ? (
                                                        <Typography color="red" variant="small">{errors.description.message}</Typography>
                                                    ) : (
                                                        <div className="h-5"></div>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="imageUrl"
                                            control={control}
                                            defaultValue={dataFetchStore?.imageUrl}
                                            rules={{
                                                required: { value: true, message: getMustNotBeNull('Image URL') },
                                                validate: value => {
                                                    if (imageUrls.includes(value)) {
                                                        return true
                                                    }
                                                    return `due to this is a demo project, imageUrl must be: ${imageUrls.join(" ")}`;
                                                }
                                            }}
                                            render={({ field }) => (
                                                <div className="mb-4">
                                                    <Input {...field} label="Image Url" />
                                                    {errors.imageUrl ? (
                                                        <Typography color="red" variant="small">{errors.imageUrl.message}</Typography>
                                                    ) : (
                                                        <div className="h-5"></div>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button color="red" onClick={() => { setIsEditing(false); reset(); }}>Cancel</Button>
                                        <Button type="submit" color="green">Save</Button>
                                    </DialogFooter>
                                </form>
                            </Dialog>

                        </>
                    )}

                    <Outlet />
                </>
            );
        }
    )
    return <WrappedComponent />
}