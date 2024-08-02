
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/customBaseQuery';
import { Product, CreateProductRequest } from '../models/apiModels';
import { STOCK_TAG } from './stockSlice';

export const PRODUCT_TAG = 'Product';
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: customBaseQuery,
  tagTypes: [PRODUCT_TAG, STOCK_TAG],
  endpoints: (builder) => ({
    // fetchProducts: builder.query<{ products: Product[], total: number }, { page: number, limit: number }>({
    //   query: ({ page, limit }) => ({
    //     url: `product`,
    //     // url: `products?page=${page}&limit=${limit}`,
    //     method: 'GET',
    //   }),
    //   providesTags: (result, error, arg) => [{ type: 'Product' }],
    // }),
    fetchProduct: builder.query<Product, {productId: string}>({
      query: ({ productId }) => ({
        url: `product/${productId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: PRODUCT_TAG, id: arg.productId }],
    }),
    updateProduct: builder.mutation<Product, Partial<Product> & Pick<Product, 'id'>>({
      query: (product) => ({
        url: `product/${product.id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, arg) => [{ type: PRODUCT_TAG, id: arg.id }],
    }),
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (newProduct) => ({
        url: 'product',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: PRODUCT_TAG, id: 'LIST' }, { type: STOCK_TAG }],
    }),
  })
});

export const { useFetchProductQuery, useUpdateProductMutation, useCreateProductMutation } = productApi;