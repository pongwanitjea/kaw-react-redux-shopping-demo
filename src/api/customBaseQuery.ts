import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CURRENT_TOKEN } from '../tokenStore';

export const customBaseQuery = fetchBaseQuery({
  baseUrl: 'https://mock-backend.com/',
  prepareHeaders: (headers) => {
    if (CURRENT_TOKEN.length > 0) {
      headers.set('Authorization', `Bearer ${CURRENT_TOKEN}`);
    }
    return headers;
  },
});