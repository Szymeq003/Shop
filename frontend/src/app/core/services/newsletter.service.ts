import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsletterMessage {
    id?: number;
    subject: string;
    content: string;
    sentAt?: string;
    status: 'DRAFT' | 'SENT';
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/newsletter';
  private readonly ADMIN_API = 'http://localhost:8080/api/admin/newsletter-messages';

  subscribe(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/subscribe`, { email });
  }

  getAllMessages(): Observable<NewsletterMessage[]> {
    return this.http.get<NewsletterMessage[]>(this.ADMIN_API);
  }

  createMessage(msg: NewsletterMessage): Observable<NewsletterMessage> {
    return this.http.post<NewsletterMessage>(this.ADMIN_API, msg);
  }

  updateMessage(id: number, msg: NewsletterMessage): Observable<NewsletterMessage> {
    return this.http.put<NewsletterMessage>(`${this.ADMIN_API}/${id}`, msg);
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ADMIN_API}/${id}`);
  }
}
