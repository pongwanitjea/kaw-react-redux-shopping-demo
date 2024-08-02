import { Button } from "@material-tailwind/react";
import { useAppSelector } from "../../store/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { selectCart } from "../../slices/cartSlice";

export const CheckOutButton = ({ storeId }: { storeId: string | null }) => {
    const cart = useAppSelector(selectCart);
    const navigate = useNavigate();
    let cartSelected;
    let totalItem;
    let totalPrice;
    if (storeId) {
        cartSelected = cart.filter(cart => storeId.includes(cart.storeId));
    } else {
        cartSelected = cart.filter(cart => cart.selected == true);
    }
    totalItem = cartSelected.reduce((accum, curr) => accum + curr.selectedAmount, 0)
    totalPrice = cartSelected.reduce((accum, curr) => accum + curr.selectedAmount * curr.pricePerOne, 0)

    return (
        <Button color="blue" className="mt-4" disabled={totalItem == 0} onClick={() => {
            if (storeId) {
                navigate({
                    to: "/checkout/$storeId",
                    params: { storeId },
                    // mask: { to: "/checkout/" }
                })
            } else {
                navigate({
                    to: "/checkout/$storeId",
                    mask: { to: "/checkout/" } // hide undefined
                })
            }
        }} >
            Checkout ({totalItem} items) - ฿{totalPrice.toFixed(2)}
        </Button>
    );
}