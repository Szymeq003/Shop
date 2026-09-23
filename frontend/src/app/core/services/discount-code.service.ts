import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiscountCode {
    id?: number;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    minPurchaseAmount?: number;
    startDate?: string;
    endDate?: string;
    maxUses?: number;
    currentUses?: number;
    active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountCodeService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/discount-codes';

  getAll(): Observable<DiscountCode[]> {
    return this.http.get<DiscountCode[]>(this.API);
  }

  create(code: DiscountCode): Observable<DiscountCode> {
    return this.http.post<DiscountCode>(this.API, code);
  }

  update(id: number, code: DiscountCode): Observable<DiscountCode> {
    return this.http.put<DiscountCode>(`${this.API}/${id}`, code);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
