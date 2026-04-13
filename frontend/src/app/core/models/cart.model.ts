export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface CartItem {
  id?: number; // Backend ID for logged-in users
  productId: number;
  variantId: number;
  productName: string;
  sku: string;
  mainImageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
  attributes: { [key: string]: string };
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}
