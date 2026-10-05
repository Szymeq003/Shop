import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Setting {
    id?: number; key: string; value: string;
}

@Injectable({ providedIn: 'root' })
export class SettingService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/settings';
  getAll(): Observable<Setting[]> { return this.http.get<Setting[]>(this.API); }
  create(item: Setting): Observable<Setting> { return this.http.post<Setting>(this.API, item); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
