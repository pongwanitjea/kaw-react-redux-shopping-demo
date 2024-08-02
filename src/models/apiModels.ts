
export interface OrderResponseBodyFailure {
    statusCode: number,
    statusDesc: string
  }
  
  export interface OrderItemResponseBody {
    storeId: string,
    productId: string,
    // product: Product,
    pricePerOne: number,
    selectedAmount: number,
    userId: string,
    time: number,
    orderGroupId: string,
  }

  export interface OrderGroupItem {
    stores: {
      id: string, name: string
    }[],
    orderGroupId: string,
    time: number,
    totalPrice: number,
    userId: string,
    itemCount: number
  }

  
  export function isOrderResponseBodyFailure(obj: any): obj is OrderResponseBodyFailure {
    return obj && typeof obj === 'object' && 'statusCode' in obj && 'statusDesc' in obj;
  }
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export interface CreateProductRequest {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  stockAmount: number;
}
