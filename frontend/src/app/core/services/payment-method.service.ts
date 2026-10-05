import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentMethod {
    id?: number; name: string; description?: string; fee: number; active: boolean;
}

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/payment-methods';
  getAll(): Observable<PaymentMethod[]> { return this.http.get<PaymentMethod[]>(this.API); }
  create(item: PaymentMethod): Observable<PaymentMethod> { return this.http.post<PaymentMethod>(this.API, item); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
