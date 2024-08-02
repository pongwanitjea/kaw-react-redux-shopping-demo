import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/customBaseQuery';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchImage: builder.query<string, string>({
      query: (assetId) => ({
        url: `image/${assetId}`,
        responseHandler: async (response) => {
          const arrayBuffer = await response.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
          return URL.createObjectURL(blob);
        },
      }),
    }),
  }),
});

export const { useFetchImageQuery } = imageApi;