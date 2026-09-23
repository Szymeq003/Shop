import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promotion {
    id?: number;
    name: string;
    description?: string;
    discountPercentage: number;
    startDate?: string;
    endDate?: string;
    active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/promotions';

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.API);
  }

  create(promo: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.API, promo);
  }

  update(id: number, promo: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.API}/${id}`, promo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
