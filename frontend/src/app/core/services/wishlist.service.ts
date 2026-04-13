import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/wishlist';

  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${productId}`, {});
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${productId}`);
  }
}
