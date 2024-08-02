import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/customBaseQuery';

export interface Store {
    id: string;
    name: string;
    description: string;
    lat: number;
    long: number;
    imageUrl: string;
}
const STORE_TAG = 'STORE'
export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: customBaseQuery,
  tagTypes: [STORE_TAG],
  endpoints: (builder) => ({
    fetchStores: builder.query<{ stores: Store[], total: number }, { page: number, limit: number }>({
      query: ({ page, limit }) => ({
        url: `store`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: STORE_TAG }],
    }),
    fetchStore: builder.query<Store, { storeId: string }>({
      query: ({ storeId }) => ({
        url: `store/${storeId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: STORE_TAG, id: arg.storeId }],
    }),
    updateStore: builder.mutation<Store, Partial<Store> & Pick<Store, 'id'>>({
      query: (store) => ({
        url: `store/${store.id}`,
        method: 'PUT',
        body: store,
      }),
      invalidatesTags: (result, error, arg) => [{ type: STORE_TAG }],
    }),
  })
});

export const { useFetchStoresQuery, useFetchStoreQuery, useUpdateStoreMutation } = storeApi;