import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/customBaseQuery';

export interface Stock {
  storeId: string,
  stockAmount: number,
  productId: string,
  // product: Product
}
export const STOCK_TAG = 'STOCK'
export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: customBaseQuery,
  tagTypes: [STOCK_TAG],
  endpoints: (builder) => ({
    fetchStock: builder.query<Stock[], { storeId: string }>({
      query: ({ storeId }) => ({
        url: `stock/${storeId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: STOCK_TAG, id: arg.storeId }],
      keepUnusedDataFor: 1
    }),
    updateStock: builder.mutation<Stock, { storeId: string; productId: string; stockAmount: number }>({
      query: ({ storeId, productId, stockAmount }) => ({
        url: `stock/${storeId}/${productId}`,
        method: 'PUT',
        body: { stockAmount },
      }),
      invalidatesTags: (result, error, arg) => [{ type: STOCK_TAG, id: arg.storeId }],
    }),
  })
})

export const { useFetchStockQuery, useUpdateStockMutation } = stockApi;