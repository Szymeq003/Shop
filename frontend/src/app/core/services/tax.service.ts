import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tax {
    id?: number; name: string; rate: number;
}

@Injectable({ providedIn: 'root' })
export class TaxService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/taxes';
  getAll(): Observable<Tax[]> { return this.http.get<Tax[]>(this.API); }
  create(item: Tax): Observable<Tax> { return this.http.post<Tax>(this.API, item); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
