import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: number;
  variantId: number | null;
  quantity: number;
  price: number;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address: OrderAddress;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = 'http://localhost:8080/api/user/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API}/${id}`);
  }
}
