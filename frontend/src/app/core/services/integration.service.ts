import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Integration {
    id?: number; name: string; provider: string; apiKey?: string; active: boolean;
}

@Injectable({ providedIn: 'root' })
export class IntegrationService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/integrations';
  getAll(): Observable<Integration[]> { return this.http.get<Integration[]>(this.API); }
  create(item: Integration): Observable<Integration> { return this.http.post<Integration>(this.API, item); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
