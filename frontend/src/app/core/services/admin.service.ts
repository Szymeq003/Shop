import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from './employee.service';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

export interface DailySales {
  date: string;
  sales: number;
}

export interface AdminStatsResponse {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: OrderResponse[];
  salesTrend: DailySales[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private adminUrl = 'http://localhost:8080/api/admin';

  getStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.adminUrl}/stats`);
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.adminUrl}/users`);
  }

  createUser(user: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.adminUrl}/users`, user);
  }

  updateUserRole(userId: number, role: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.adminUrl}/users/${userId}/role`, { role });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.adminUrl}/users/${userId}`);
  }
}
