import { Card, CardBody, Typography, Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react"
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { hocLoader } from "../hocLoader";
import { selectCart, ModifyCartRequest, addOrRemoveToCart } from "../../slices/cartSlice";
import { useFetchProductQuery } from "../../slices/productSlice";
import { useFetchStockQuery, Stock } from "../../slices/stockSlice";
import { selectActiveSession } from "../../slices/userSlice";


const useCombinedProductStockQuery = ({ storeId, productId }: {storeId: string, productId: string}) => {
  const stockQuery = useFetchStockQuery({ storeId });
  const productQuery = useFetchProductQuery({ productId });

  return {
    data: {
      stockData: stockQuery.data,
      productData: productQuery.data,
    },
    isLoading: stockQuery.isLoading || productQuery.isLoading,
    isError: stockQuery.isError || productQuery.isError,
    error: stockQuery.error || productQuery.error,
  };
};


function ProductCardComponent({ storeId, item, notShowAddRemoveCartButton, data }: { storeId: string, item: Stock, notShowAddRemoveCartButton: boolean, data: any }) {
  const { stockData, productData } = data;
  const cart = useAppSelector(selectCart);
  const dispatch = useAppDispatch();
  const stockOfThatStore = stockData || [];
  const activeSession = useAppSelector(selectActiveSession);
  const navigate = useNavigate();

  const validateIfLoggedIn = () => {
    if (!activeSession?.user){
      navigate({
        to: '/login/$redirect',
        params: {
            redirect: location.pathname,
        },
    })
    }
  }

  //TODO should check for new stock before add to cart?
  const handleAddToCart = (productId: string) => {
    validateIfLoggedIn();
    const modifyCart: ModifyCartRequest = {
      storeId,
      productId,
      buyAmount: +1,
      stockOfThatStore,
      product: productData!
    }
    dispatch(addOrRemoveToCart(modifyCart))
  };

  const handleRemoveFromCart = (productId: string) => {
    validateIfLoggedIn();
    const modifyCart: ModifyCartRequest = {
      storeId,
      productId,
      buyAmount: -1,
      stockOfThatStore,
      product: productData!
    }
    dispatch(addOrRemoveToCart(modifyCart))
  };
  const cartOfThisStoreAndItem = cart.find(cart => cart?.storeId == storeId && cart?.productId == item?.productId)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Card
        key={item.productId}
        className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        onClick={handleOpenModal}
      >
        <CardBody className="flex flex-row items-center p-2">
          <img
            src={productData?.imageUrl}
            alt={productData?.name}
            className="w-20 h-20 object-cover rounded-lg mr-4"
          />
          <div className="flex-grow">
            <Typography variant="h6" className="font-bold text-gray-800 mb-1">
              {productData?.name}
            </Typography>
            <Typography variant="paragraph" className="text-gray-600 text-sm mb-1">
              ฿{productData?.price}
            </Typography>
            <Typography variant="paragraph" className="text-gray-600 text-sm mb-1">
              Stock: {item.stockAmount}
            </Typography>
          </div>
          {notShowAddRemoveCartButton ? <></> : <div className="flex items-center">
            {cartOfThisStoreAndItem?.selectedAmount || 0 > 0 ? (
              <>
                <Button
                  className="rounded-full w-8 h-8 p-0 flex items-center justify-center border bg-white border-red-500 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromCart(item.productId);
                  }}
                >
                  -
                </Button>
                <Typography variant="paragraph" className="font-medium text-lg mx-2">
                  {cartOfThisStoreAndItem?.selectedAmount || 0}
                </Typography>
              </>
            ) : null}
            <Button
              color="light-green"
              className="rounded-full w-8 h-8 p-0 flex items-center justify-center border bg-white border-green-500 text-green-500"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item.productId);
              }}
              >
              +
            </Button>
          </div>}
        </CardBody>
      </Card>

      <Dialog open={isModalOpen} handler={handleCloseModal} size="lg">
        <DialogHeader className="justify-between">
          <Typography variant="h5" className="font-bold">
            {productData?.name}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="flex flex-col md:flex-row">
          <img
            src={productData?.imageUrl}
            alt={productData?.name}
            className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
          />
          <div className="flex flex-col justify-between">
            <div>
              <Typography variant="paragraph" className="text-gray-700 mb-4">
                {productData?.description || "No description available."}
              </Typography>
              <Typography variant="h6" className="font-semibold text-gray-900 mb-2">
                Price: ฿{productData?.price}
              </Typography>
              <Typography variant="paragraph" className="text-gray-600">
                Available Stock: {item.stockAmount}
              </Typography>
            </div>
            {notShowAddRemoveCartButton ? <></> : <div className="flex items-center mt-4">
              <Button
                color="red"
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center mr-2"
                onClick={() => handleRemoveFromCart(item.productId)}
              >
                -
              </Button>
              <Typography variant="h6" className="mx-4">
                {cartOfThisStoreAndItem?.selectedAmount || 0}
              </Typography>
              <Button
                color="green"
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center ml-2"
                onClick={() => handleAddToCart(item.productId)}
              >
                +
              </Button>
            </div>}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleCloseModal}>
            Done
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export const ProductCard = hocLoader(
  ({ storeId, item }: {storeId: string, item: Stock}) => useCombinedProductStockQuery({ storeId, productId: item.productId }),
  'CARD_DEFAULT_SKELETON',
  ProductCardComponent
);

