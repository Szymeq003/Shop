import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderResponse {
  id: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
  address: OrderAddressResponse;
  shippingMethod: string;
  paymentMethod: string;
  shippingFee: number;
  customerName: string;
  customerEmail: string;
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  variantId: number;
  quantity: number;
  price: number;
}

export interface OrderAddressResponse {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface ProductSaveRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrls: string[];
  status: string;
  variants: VariantRequest[];
}

export interface VariantRequest {
  id?: number;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName: string;
  mainImageUrl: string;
  status: string;
  totalStock: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: CategoryResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private ordersUrl = 'http://localhost:8080/api/employee/orders';
  private productsUrl = 'http://localhost:8080/api/employee/products';
  private categoriesUrl = 'http://localhost:8080/api/employee/categories';

  // Orders
  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.ordersUrl);
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.ordersUrl}/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.ordersUrl}/${id}/status`, { status });
  }

  // Products
  getProducts(page: number = 0, size: number = 12): Observable<any> { 
    return this.http.get<any>(this.productsUrl, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.productsUrl}/${id}`);
  }

  saveProduct(product: ProductSaveRequest): Observable<any> {
    return this.http.post<any>(this.productsUrl, product);
  }

  updateProduct(id: number, product: ProductSaveRequest): Observable<any> {
    return this.http.put<any>(`${this.productsUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`);
  }

  // Categories
  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.categoriesUrl);
  }

  saveCategory(category: any): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.categoriesUrl, category);
  }

  updateCategory(id: number, category: any): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.categoriesUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`);
  }

  // Uploads
  uploadImage(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>('http://localhost:8080/api/uploads', formData);
  }
}
