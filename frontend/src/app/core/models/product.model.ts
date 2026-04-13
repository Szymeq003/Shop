import { Review } from './review.model';

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  categoryId: number;
  mainImageUrl: string;
  defaultVariantId: number;
  averageRating: number;
  reviewCount: number;
}

export interface ProductDetail extends Product {
  description: string;
  imageUrls: string[];
  variants: ProductVariant[];
  reviews: Review[];
  attributes: { [key: string]: string[] };
}

export interface ProductVariant {
  id: number;
  sku: string;
  price?: number;
  stockQuantity: number;
  attributeValues: { [key: string]: string };
}

export interface ProductSearchCriteria {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
