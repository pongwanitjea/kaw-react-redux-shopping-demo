import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Input, Textarea, IconButton } from "@material-tailwind/react";
import { useAppSelector } from "../../store/hooks";
import { imageUrls } from "../../mocks/handler";
import { getMustNotBeNull, getMaxLengthMessage } from "../../util/util";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCreateProductMutation } from "../../slices/productSlice";
import { selectActiveSession } from "../../slices/userSlice";

interface AddProductForm {
  name: string;
  price: string;
  description: string;
  stockAmount: number;
  imageUrl: string;
}

const MAX_PRODUCT_NAME_LENGTH = 30;
const MAX_PRODUCT_DESCRIPTION_LENGTH = 300;

export function AddProduct({ onProductAdded }: { onProductAdded: () => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const activeSession = useAppSelector(selectActiveSession);
  const [createProduct] = useCreateProductMutation();
  // const [createStock] = useCreateStockMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<AddProductForm>({
    reValidateMode: 'onChange',
    mode: 'all'
  });

  const onSubmit = async (data: AddProductForm) => {
    try {
      const newProduct = await createProduct({
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        stockAmount: data.stockAmount
      }).unwrap();

      setIsAdding(false);
      reset();
      onProductAdded(); // Trigger re-fetch in parent component

    } catch (error) {
      console.error("Failed to add new product:", error);
    }
  };

  return (
    <>
    <div className="flex flex-row" onClick={() => setIsAdding(true)}>
    <IconButton variant="filled" size="lg" >
      <PlusIcon className="w-6 h-6"></PlusIcon>
    </IconButton>
    <Typography variant="h6" className="mt-auto mb-auto ml-4">Add new product</Typography>
    </div>
      <Dialog open={isAdding} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="justify-between">
            <Typography variant="h4">Add New Product</Typography>
          </DialogHeader>
          <DialogBody divider className="flex flex-col">
            <Controller
              name="name"
              control={control}
              rules={{
                required: {value: true, message: getMustNotBeNull('Name')},
                maxLength: { value: MAX_PRODUCT_NAME_LENGTH, message: getMaxLengthMessage(MAX_PRODUCT_NAME_LENGTH) }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Input {...field} label="Name" />
                  {errors.name && <Typography color="red" variant="small">{errors.name.message}</Typography>}
                </div>
              )}
            />
            <Controller
              name="price"
              control={control}
              rules={{
                required: {value: true, message: getMustNotBeNull('Price')},
                min: { value: 0, message: "Price must exceed 0" }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Input {...field} type="number" label="Price" />
                  {errors.price && <Typography color="red" variant="small">{errors.price.message}</Typography>}
                </div>
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{
                required: {value: true, message: getMustNotBeNull('Description')},
                maxLength: { value: MAX_PRODUCT_DESCRIPTION_LENGTH, message: getMaxLengthMessage(MAX_PRODUCT_DESCRIPTION_LENGTH) }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Textarea {...field} label="Description" />
                  {errors.description && <Typography color="red" variant="small">{errors.description.message}</Typography>}
                </div>
              )}
            />
            <Controller
              name="stockAmount"
              control={control}
              rules={{
                required: {value: true, message: getMustNotBeNull('Stock Amount')},
                min: { value: 0, message: "Stock amount must be more than or equal to 0" },
                validate: value => Number.isInteger(Number(value)) || "Stock amount must be an integer"
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Input {...field} type="number" label="Stock Amount" />
                  {errors.stockAmount && <Typography color="red" variant="small">{errors.stockAmount.message}</Typography>}
                </div>
              )}
            />
            <Controller
              name="imageUrl"
              control={control}
              rules={{
                required: {value: true, message: getMustNotBeNull('Image URL')},
                validate: value => imageUrls.includes(value) || `Due to this being a demo project, imageUrl must be one of: ${imageUrls.join(", ")}`
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <Input {...field} label="Image Url" />
                  {errors.imageUrl && <Typography color="red" variant="small">{errors.imageUrl.message}</Typography>}
                </div>
              )}
            />
          </DialogBody>
          <DialogFooter>
            <Button color="red" onClick={() => { setIsAdding(false); reset(); }}>Cancel</Button>
            <Button type="submit" color="green">Add Product</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}