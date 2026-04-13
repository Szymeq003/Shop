import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/reviews';

  addReview(productId: number, review: Partial<ReviewDTO>): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(`${this.API_URL}/${productId}`, review);
  }

  updateReview(reviewId: number, review: Partial<ReviewDTO>): Observable<ReviewDTO> {
    return this.http.put<ReviewDTO>(`${this.API_URL}/${reviewId}`, review);
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${reviewId}`);
  }

  getMyReviews(): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.API_URL}/mine`);
  }
}
