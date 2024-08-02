import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { Product } from "../models/apiModels";
import { createAppSlice } from "../store/createAppSlice";
import { Stock } from "./stockSlice";

export interface Cart {
    storeId: string,
    productId: string,
    pricePerOne: number,
    selectedAmount: number,
    selected: boolean
}

export interface ModifyCartRequest {
    storeId: string, productId: string, buyAmount: number, stockOfThatStore: Stock[]|undefined, product: Product
}

export interface ModifyCartSelectedRequest {
    storeId: string, productId?: string, selected: boolean
}

export interface CartGroupedByStore {
    [store: string]: [cart: Cart]
}

export const CART_STATE_LS = 'cartState'

const loadCartState = (): Cart[] => {
    const storedCart = localStorage.getItem(CART_STATE_LS);
    return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartState = (state: Cart[]) => {
    localStorage.setItem(CART_STATE_LS, JSON.stringify(state));
};

const initialCartState: Cart[] & { error?: string } = loadCartState();

export const cartSlice = createAppSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: (create) => ({
        changeItemSelected: create.reducer(
            (state, action: PayloadAction<ModifyCartSelectedRequest>) => {
                if (action.payload.productId){
                    let matchingIndex = state.findIndex(cart => cart.productId == action.payload.productId && cart.storeId == action.payload.storeId);
                    state[matchingIndex].selected = action.payload.selected;
                } else {
                    state.filter(cart => cart.storeId == action.payload.storeId).forEach(cart => cart.selected = action.payload.selected)
                }
                saveCartState(state);
            }
        ),
        addOrRemoveToCart: create.reducer(
            (state, action: PayloadAction<ModifyCartRequest>) => {
                if (action.payload.stockOfThatStore) {
                    const stockItem = action.payload.stockOfThatStore.find(stock => stock.productId == action.payload.productId);
                    const stockAvailable = stockItem?.stockAmount || 0;
                    const pricePerOne = +(action.payload.product.price || 0)
                    const buyAmount = action.payload.buyAmount;

                    if (stockAvailable - buyAmount >= 0) {
                        let matchingIndex = state.findIndex(cart => cart.productId == action.payload.productId && cart.storeId == action.payload.storeId);
                        if (matchingIndex == -1) {
                            if (buyAmount > 0) {
                                let cart = {
                                    storeId: action.payload.storeId,
                                    productId: action.payload.productId,
                                    pricePerOne,
                                    selectedAmount: buyAmount,
                                    selected: true
                                } as Cart;
                                state.push(cart);
                            } else {
                                // state.error = `Cannot remove stock for product ${action.payload.productId} in store ${action.payload.storeId} as it is not in the cart`;
                            }
                        } else {
                            const newAmount = state[matchingIndex].selectedAmount + buyAmount;
                            if (newAmount > stockAvailable) {
                                // state.error = `Cannot add more than available stock for product ${action.payload.productId} in store ${action.payload.storeId}`;
                            } else if (newAmount < 0) {
                                // state.error = `Cannot have less than 0 items for product ${action.payload.productId} in store ${action.payload.storeId}`;
                            } else {
                                if (newAmount == 0) {
                                    state.splice(matchingIndex, 1);
                                } else {
                                    state[matchingIndex].selectedAmount = newAmount;
                                    state[matchingIndex].selected = true;
                                }
                            }
                        }
                    } else {
                        // state.error = `Cannot add stock for product ${action.payload.productId} in store ${action.payload.storeId} due to out of stock`;
                    }
                }
                saveCartState(state);
            },
        ),
        clearCartAll: create.reducer(
            (state) => {
                // In Redux Toolkit, directly assigning a new value to the state variable in a reducer like state = []; 
                // will not work as expected. Redux Toolkit uses Immer under the hood, 
                // which allows you to write "mutating" logic in reducers, but it doesn't actually mutate the state directly.

                // Return the new state instead of assigning directly
                const newState = [];
                saveCartState(newState);
                return newState;
            }
        ),
        clearCartOfStore: create.reducer(
            (state, action: PayloadAction<string>) => {
                const newState = state.filter(cart => cart.storeId != action.payload);
                saveCartState(newState);
                return newState;
            }
        ),
        clearCartSelectiveItems: create.reducer(
            (state, action: PayloadAction<Cart[]>) => {
                action.payload.forEach(cart => {
                    const index = state.findIndex(currentCart => currentCart.productId == cart.productId && currentCart.storeId == cart.storeId);
                    state.splice(index, 1)
                })
                saveCartState(state);
            }
        )
        // setError: create.reducer(
        //     (state, action: PayloadAction<string>) => {
        //         state.error = action.payload;
        //     }
        // )
    }),
    selectors: {
        selectCart: (cart) => cart,
        // selectCartGroupedByStore: (cart) => {
        //     const cartGroupedByStore: CartGroupedByStore = {}
        //     for (const item of cart){
        //         if (cartGroupedByStore[item.storeId] == undefined){
        //             cartGroupedByStore[item.storeId] = [item]
        //         } else {
        //             cartGroupedByStore[item.storeId].push(item);
        //         }
        //     }
        //     return cartGroupedByStore;
        // }
    },
});

export const { selectCart } = cartSlice.selectors;

export const { addOrRemoveToCart, clearCartAll, clearCartOfStore, changeItemSelected, clearCartSelectiveItems } = cartSlice.actions;

export const selectCartGroupedByStore = createSelector(
    [selectCart],
    (cart) => {
      return getCartGroupedByStore(cart);
    }
);

export const getCartGroupedByStore = (cart: Cart[]) => {
    const cartGroupedByStore = {} as CartGroupedByStore;
    for (const item of cart) {
      if (!cartGroupedByStore[item.storeId]) {
          cartGroupedByStore[item.storeId] = [item];
      } else {
          cartGroupedByStore[item.storeId].push(item);
      }
    }
    return cartGroupedByStore;
}