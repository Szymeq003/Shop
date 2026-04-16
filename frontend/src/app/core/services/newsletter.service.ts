import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/newsletter';

  subscribe(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/subscribe`, { email });
  }
}
