import { PayloadAction, Store, createSelector } from '@reduxjs/toolkit';
import { OrderGroupItem, OrderItemResponseBody } from '../models/apiModels';
import { createAppSlice } from '../store/createAppSlice';
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/customBaseQuery';
import { Stock } from './stockSlice';

const initialState: OrderItemResponseBody[] = []

export const orderSlice = createAppSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderItemsPerOrderGroup(state, action: PayloadAction<OrderItemResponseBody[]>) {
      console.log('setOrderItemsPerOrderGroup', action.payload)
      return action.payload;
    },
  },
  selectors: {
      selectOrderItems: (order) => order,
  },
})

export const ORDER_TAG = 'ORDER'
// const ORDER_ALL_TAG = 'ORDER_ALL'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: customBaseQuery,
  tagTypes: [ORDER_TAG],
  endpoints: (builder) => ({
    fetchOrderGroup: builder.query<OrderItemResponseBody[], { orderGroupId: string }>({
      query: ({ orderGroupId }) => ({
        url: `order/group/${orderGroupId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: ORDER_TAG, id: arg.orderGroupId }],
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
      //     // if (Array.isArray(data)) {
      //     dispatch(setOrderItemsPerOrderGroup(data));
      //     // }
      //   } catch (error) {
      //     console.error('Failed to store order items:', error);
      //   }
      // },
    }),
    fetchOrders: builder.query<OrderGroupItem[], null>({
      query: () => ({
        url: `order/group`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: ORDER_TAG }],
    }),
    fetchOrdersOfStore: builder.query<OrderItemResponseBody[], null>({
      query: () => ({
        url: `store/order`,
        method: 'GET',
      }),
    })
  })
})

export interface OrderGroupedByGroupId {
  [store: string]: [cart: OrderItemResponseBody]
}

export const getOrderGroupedByGroupId = (orderItems: OrderItemResponseBody[]) => {
  const orderGroupedByGroupId = {} as OrderGroupedByGroupId;
  for (const item of orderItems) {
    if (!orderGroupedByGroupId[item.orderGroupId]) {
      orderGroupedByGroupId[item.orderGroupId] = [item];
    } else {
      orderGroupedByGroupId[item.orderGroupId].push(item);
    }
  }
  return orderGroupedByGroupId;
}

export interface OrderGroupedByStore {
  [store: string]: [cart: OrderItemResponseBody]
}

export const getOrderGroupedByStore = (orderItems: OrderItemResponseBody[]) => {
  const orderGroupedByStore = {} as OrderGroupedByStore;
  for (const item of orderItems) {
    if (!orderGroupedByStore[item.storeId]) {
        orderGroupedByStore[item.storeId] = [item];
    } else {
        orderGroupedByStore[item.storeId].push(item);
    }
  }
  return orderGroupedByStore;
}

export const { selectOrderItems } = orderSlice.selectors;

export const selectOrderGroupedByStore = createSelector(
  [selectOrderItems],
  (orderItems) => {
    return getOrderGroupedByStore(orderItems);
  }
);


export const { setOrderItemsPerOrderGroup } = orderSlice.actions;

export const { useFetchOrderGroupQuery, useFetchOrdersQuery, useFetchOrdersOfStoreQuery } = orderApi;



interface CompositeOrderData {
  orderData: OrderItemResponseBody[];
  stockData: Stock[][];
  storeData: Store[];
}

export const compositeOrderGroupApi = createApi({
  reducerPath: 'compositeOrderGroupApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchCompositeOrderData: builder.query<CompositeOrderData, { orderGroupId: string }>({
      async queryFn({ orderGroupId }, _queryApi, _extraOptions, fetchWithBQ) {
        // Fetch order data
        const orderResult = await fetchWithBQ(`order/group/${orderGroupId}`);
        if (orderResult.error) return { error: orderResult.error };

        const orderData = orderResult.data as OrderItemResponseBody[];
        const storeIds = Array.from(new Set(orderData.map(item => item.storeId)));

        // Fetch stock data for each store
        // const stockResults = await Promise.all(
        //   storeIds.map(storeId => fetchWithBQ(`stock/${storeId}`))
        // );
        // const stockData = stockResults.map(result => result.data as Stock[]);

        // Fetch store data for each store
        const storeResults = await Promise.all(
          storeIds.map(storeId => fetchWithBQ(`store/${storeId}`))
        );
        const storeData = storeResults.map(result => result.data as Store);

        return { data: { orderData, storeData } };
      },
    }),
  }),
});

export const { useFetchCompositeOrderDataQuery } = compositeOrderGroupApi;