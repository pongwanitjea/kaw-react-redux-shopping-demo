import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/customBaseQuery';
import { OrderResponseBodyFailure, OrderItemResponseBody } from '../models/apiModels';
import { ORDER_TAG, setOrderItemsPerOrderGroup } from './orderSlice';
import { Cart } from './cartSlice';
import { STOCK_TAG } from './stockSlice';


export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: customBaseQuery,
  tagTypes: [STOCK_TAG, ORDER_TAG],
  endpoints: (builder) => ({
    checkout: builder.mutation<OrderResponseBodyFailure|OrderItemResponseBody[], Partial<Cart[]>>({
      query(body) {
        return {
          url: `checkout`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: STOCK_TAG }, {type: ORDER_TAG}],
    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       // if (Array.isArray(data)) {
    //       dispatch(setOrderItemsPerOrderGroup(data));
    //       // }
    //     } catch (error) {
    //       console.error('Failed to store order items:', error);
    //     }
    //   },
    }),
  })
})

export const { useCheckoutMutation } = checkoutApi;