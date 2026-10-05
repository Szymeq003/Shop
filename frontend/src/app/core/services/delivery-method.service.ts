import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DeliveryMethod {
    id?: number; name: string; description?: string; price: number; active: boolean;
}

@Injectable({ providedIn: 'root' })
export class DeliveryMethodService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/delivery-methods';
  getAll(): Observable<DeliveryMethod[]> { return this.http.get<DeliveryMethod[]>(this.API); }
  create(item: DeliveryMethod): Observable<DeliveryMethod> { return this.http.post<DeliveryMethod>(this.API, item); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
