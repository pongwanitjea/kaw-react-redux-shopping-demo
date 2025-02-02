/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as OrdersImport } from './routes/orders'
import { Route as HomeImport } from './routes/home'
import { Route as CartImport } from './routes/cart'
import { Route as IndexImport } from './routes/index'
import { Route as StoreManageImport } from './routes/store.manage'
import { Route as LoginRedirectImport } from './routes/login.$redirect'
import { Route as CheckoutStoreIdImport } from './routes/checkout.$storeId'
import { Route as CheckedOutOrderGroupIdImport } from './routes/checkedOut.$orderGroupId'
import { Route as StoreManageProductImport } from './routes/store.manage.product'
import { Route as StoreManageOrderImport } from './routes/store.manage.order'
import { Route as OrderGroupOrderGroupIdImport } from './routes/order.group.$orderGroupId'

// Create Virtual Routes

const StoreUnauthorizedLazyImport = createFileRoute('/store/unauthorized')()
const StoreStoreIdLazyImport = createFileRoute('/store/$storeId')()

// Create/Update Routes

const OrdersRoute = OrdersImport.update({
  path: '/orders',
  getParentRoute: () => rootRoute,
} as any)

const HomeRoute = HomeImport.update({
  path: '/home',
  getParentRoute: () => rootRoute,
} as any)

const CartRoute = CartImport.update({
  path: '/cart',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const StoreUnauthorizedLazyRoute = StoreUnauthorizedLazyImport.update({
  path: '/store/unauthorized',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/store.unauthorized.lazy').then((d) => d.Route),
)

const StoreStoreIdLazyRoute = StoreStoreIdLazyImport.update({
  path: '/store/$storeId',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/store.$storeId.lazy').then((d) => d.Route),
)

const StoreManageRoute = StoreManageImport.update({
  path: '/store/manage',
  getParentRoute: () => rootRoute,
} as any)

const LoginRedirectRoute = LoginRedirectImport.update({
  path: '/login/$redirect',
  getParentRoute: () => rootRoute,
} as any)

const CheckoutStoreIdRoute = CheckoutStoreIdImport.update({
  path: '/checkout/$storeId',
  getParentRoute: () => rootRoute,
} as any)

const CheckedOutOrderGroupIdRoute = CheckedOutOrderGroupIdImport.update({
  path: '/checkedOut/$orderGroupId',
  getParentRoute: () => rootRoute,
} as any)

const StoreManageProductRoute = StoreManageProductImport.update({
  path: '/product',
  getParentRoute: () => StoreManageRoute,
} as any)

const StoreManageOrderRoute = StoreManageOrderImport.update({
  path: '/order',
  getParentRoute: () => StoreManageRoute,
} as any)

const OrderGroupOrderGroupIdRoute = OrderGroupOrderGroupIdImport.update({
  path: '/order/group/$orderGroupId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/cart': {
      id: '/cart'
      path: '/cart'
      fullPath: '/cart'
      preLoaderRoute: typeof CartImport
      parentRoute: typeof rootRoute
    }
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/orders': {
      id: '/orders'
      path: '/orders'
      fullPath: '/orders'
      preLoaderRoute: typeof OrdersImport
      parentRoute: typeof rootRoute
    }
    '/checkedOut/$orderGroupId': {
      id: '/checkedOut/$orderGroupId'
      path: '/checkedOut/$orderGroupId'
      fullPath: '/checkedOut/$orderGroupId'
      preLoaderRoute: typeof CheckedOutOrderGroupIdImport
      parentRoute: typeof rootRoute
    }
    '/checkout/$storeId': {
      id: '/checkout/$storeId'
      path: '/checkout/$storeId'
      fullPath: '/checkout/$storeId'
      preLoaderRoute: typeof CheckoutStoreIdImport
      parentRoute: typeof rootRoute
    }
    '/login/$redirect': {
      id: '/login/$redirect'
      path: '/login/$redirect'
      fullPath: '/login/$redirect'
      preLoaderRoute: typeof LoginRedirectImport
      parentRoute: typeof rootRoute
    }
    '/store/manage': {
      id: '/store/manage'
      path: '/store/manage'
      fullPath: '/store/manage'
      preLoaderRoute: typeof StoreManageImport
      parentRoute: typeof rootRoute
    }
    '/store/$storeId': {
      id: '/store/$storeId'
      path: '/store/$storeId'
      fullPath: '/store/$storeId'
      preLoaderRoute: typeof StoreStoreIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/store/unauthorized': {
      id: '/store/unauthorized'
      path: '/store/unauthorized'
      fullPath: '/store/unauthorized'
      preLoaderRoute: typeof StoreUnauthorizedLazyImport
      parentRoute: typeof rootRoute
    }
    '/order/group/$orderGroupId': {
      id: '/order/group/$orderGroupId'
      path: '/order/group/$orderGroupId'
      fullPath: '/order/group/$orderGroupId'
      preLoaderRoute: typeof OrderGroupOrderGroupIdImport
      parentRoute: typeof rootRoute
    }
    '/store/manage/order': {
      id: '/store/manage/order'
      path: '/order'
      fullPath: '/store/manage/order'
      preLoaderRoute: typeof StoreManageOrderImport
      parentRoute: typeof StoreManageImport
    }
    '/store/manage/product': {
      id: '/store/manage/product'
      path: '/product'
      fullPath: '/store/manage/product'
      preLoaderRoute: typeof StoreManageProductImport
      parentRoute: typeof StoreManageImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  CartRoute,
  HomeRoute,
  OrdersRoute,
  CheckedOutOrderGroupIdRoute,
  CheckoutStoreIdRoute,
  LoginRedirectRoute,
  StoreManageRoute: StoreManageRoute.addChildren({
    StoreManageOrderRoute,
    StoreManageProductRoute,
  }),
  StoreStoreIdLazyRoute,
  StoreUnauthorizedLazyRoute,
  OrderGroupOrderGroupIdRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/cart",
        "/home",
        "/orders",
        "/checkedOut/$orderGroupId",
        "/checkout/$storeId",
        "/login/$redirect",
        "/store/manage",
        "/store/$storeId",
        "/store/unauthorized",
        "/order/group/$orderGroupId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/cart": {
      "filePath": "cart.tsx"
    },
    "/home": {
      "filePath": "home.tsx"
    },
    "/orders": {
      "filePath": "orders.tsx"
    },
    "/checkedOut/$orderGroupId": {
      "filePath": "checkedOut.$orderGroupId.tsx"
    },
    "/checkout/$storeId": {
      "filePath": "checkout.$storeId.tsx"
    },
    "/login/$redirect": {
      "filePath": "login.$redirect.tsx"
    },
    "/store/manage": {
      "filePath": "store.manage.tsx",
      "children": [
        "/store/manage/order",
        "/store/manage/product"
      ]
    },
    "/store/$storeId": {
      "filePath": "store.$storeId.lazy.tsx"
    },
    "/store/unauthorized": {
      "filePath": "store.unauthorized.lazy.tsx"
    },
    "/order/group/$orderGroupId": {
      "filePath": "order.group.$orderGroupId.tsx"
    },
    "/store/manage/order": {
      "filePath": "store.manage.order.tsx",
      "parent": "/store/manage"
    },
    "/store/manage/product": {
      "filePath": "store.manage.product.tsx",
      "parent": "/store/manage"
    }
  }
}
ROUTE_MANIFEST_END */
