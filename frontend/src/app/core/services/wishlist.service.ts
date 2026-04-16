import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/wishlist';

  // Reactive state for wishlist product IDs
  wishlistIds = signal<Set<number>>(new Set());

  loadWishlist(): void {
    this.getWishlist().subscribe(products => {
      this.wishlistIds.set(new Set(products.map(p => p.id)));
    });
  }

  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      tap(products => {
        this.wishlistIds.set(new Set(products.map(p => p.id)));
      })
    );
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${productId}`, {}).pipe(
      tap(() => {
        const current = new Set(this.wishlistIds());
        current.add(productId);
        this.wishlistIds.set(current);
      })
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${productId}`).pipe(
      tap(() => {
        const current = new Set(this.wishlistIds());
        current.delete(productId);
        this.wishlistIds.set(current);
      })
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistIds().has(productId);
  }

  clearState(): void {
    this.wishlistIds.set(new Set());
  }
}
