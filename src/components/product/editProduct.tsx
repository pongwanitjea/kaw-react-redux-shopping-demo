import { Card, CardBody, Typography, Input, Button, IconButton, Dialog, DialogBody, DialogFooter, DialogHeader, Textarea } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector } from "../../store/hooks";
import { PencilIcon } from "@heroicons/react/24/solid";
import { imageUrls } from "../../mocks/handler";
import { getMustNotBeNull, getMaxLengthMessage } from "../../util/util";
import { Product } from "../../models/apiModels";
import { globalErrorDialog } from "../../components/error/globalErrorDialog";
import { useState } from "react";
import { useFetchProductQuery, useUpdateProductMutation } from "../../slices/productSlice";
import { Stock, useUpdateStockMutation } from "../../slices/stockSlice";
import { selectActiveSession } from "../../slices/userSlice";
import { hocLoader } from "../hocLoader";
import { ProductCard } from "./productCard";

interface EditProductForm {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  stockAmount: number; // have to be the last due to productHasChanges
}
const MAX_PRODUCT_NAME_LENGTH = 30;
const MAX_PRODUCT_DESCRIPTION_LENGTH = 300;


export const EditProduct = hocLoader(
  ({ stock }: {stock: Stock}) => useFetchProductQuery({ productId: stock.productId }),
  'CARD_DEFAULT_SKELETON',
  EditProductComponent
);

function productHasChanges(data: EditProductForm, productData: Product): boolean {
  for (const key in data) {
    if (key === 'stockAmount'){
      continue;
    }
    if (data[key as keyof EditProductForm] !== productData[key as keyof Product]) {
      return true;
    }
  }
  return false;
}
function EditProductComponent({ stock, data }: { stock: Stock, data: Product }) {
  const productData = data;
  // const {resetBoundary , showBoundary} = usseErrorBoundary();

  const [updateProduct] = useUpdateProductMutation();
  const [updateStock] = useUpdateStockMutation();
  const [isEditing, setIsEditing] = useState(false);
  const activeSession = useAppSelector(selectActiveSession);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EditProductForm>({
    reValidateMode: 'onChange',
    mode: 'all'
  });

  const onSubmit = async (data: EditProductForm) => {
    try {
      if (productHasChanges(data, productData)) {
        await updateProduct({ id: stock.productId, ...data }).unwrap();
      }
      // always update stock because it could be changed by user buying 
      await updateStock({ storeId: stock.storeId, productId: stock.productId, stockAmount: data.stockAmount }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update product and stock:", error);
      globalErrorDialog.showError("Failed to update product and stock: " + error);
      // showBoundary(error);

    }
  };

  return (
    <>
      <div className="flex flex-row">
        <IconButton variant="text" size="md" className="mt-auto mb-auto mr-2">
          <PencilIcon className="w-6 h-6" onClick={() => setIsEditing(true)}></PencilIcon>
        </IconButton>
        <div className="grow">
          <ProductCard storeId={activeSession.storeOwner!} item={stock} notShowAddRemoveCartButton={true} />
        </div>
      </div>


      <Dialog open={isEditing} size="lg" >
        <form onSubmit={handleSubmit(onSubmit)}>

          <DialogHeader className="justify-between">
            <Typography variant="h4">Edit {productData?.name}</Typography>
          </DialogHeader>
          <DialogBody divider className="flex flex-col">
            <Controller
              name="name"
              control={control}
              defaultValue={productData?.name}
              rules={{
                required: {value: true, message: getMustNotBeNull('Name')},
                maxLength: { value: MAX_PRODUCT_NAME_LENGTH, message: getMaxLengthMessage(MAX_PRODUCT_NAME_LENGTH) }
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
              name="price"
              control={control}
              defaultValue={productData?.price}
              rules={{
                required: {value: true, message: getMustNotBeNull('Price')},
                min: { value: 0, message: "Price must exceed 0" }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Input {...field} type="number" label="Price" />
                  {errors.price ? (
                    <Typography color="red" variant="small">{errors.price.message}</Typography>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue={productData?.description}
              rules={{
                required: {value: true, message: getMustNotBeNull('Description')},
                maxLength: { value: MAX_PRODUCT_DESCRIPTION_LENGTH, message: getMaxLengthMessage(MAX_PRODUCT_DESCRIPTION_LENGTH) }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Textarea {...field} label="Description" />
                  {errors.description ? (
                    <Typography color="red" variant="small">{errors.description.message}</Typography>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
              )} />
            <Controller
              name="stockAmount"
              control={control}
              defaultValue={stock.stockAmount}
              rules={{
                required: {value: true, message: getMustNotBeNull('Stock Amount')},
                min: { value: 0, message: "Stock amount must be more than or equal to 0" },
                validate: value => {
                  const numberValue = Number(value);
                  if (!Number.isInteger(numberValue)) {
                    return "Stock amount must be an integer";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Input {...field} type="number" label="Stock Amount" />
                  {errors.stockAmount ? (
                    <Typography color="red" variant="small">{errors.stockAmount.message}</Typography>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
              )}
            />
            <Controller
              name="imageUrl"
              control={control}
              defaultValue={productData?.imageUrl}
              rules={{
                required: {value: true, message: getMustNotBeNull('Image URL')},
                validate: value => {
                  if (imageUrls.includes(value)) {
                    return true
                  }
                  return `due to this is a demo project, imageUrl must be: ${imageUrls.join(" ")}`  ;
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
  );
}