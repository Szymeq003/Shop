import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Cart, CartItem, AddToCartRequest } from '../models/cart.model';
import { Observable, tap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  private readonly CART_KEY = 'shop_cart';
  private readonly API = 'http://localhost:8080/api/cart';

  cart = signal<Cart>({ items: [], totalPrice: 0, totalItems: 0 });

  constructor() {
    // Initial load
    this.loadCart();

    // Listen to login changes to merge/refresh cart
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.mergeOrRefreshCart();
      } else {
        this.loadLocalCart();
      }
    });
  }

  loadCart() {
    if (this.authService.isLoggedIn()) {
      this.fetchCartFromApi().subscribe();
    } else {
      this.loadLocalCart();
    }
  }

  addToCart(item: CartItem) {
    if (this.authService.isLoggedIn()) {
      const request: AddToCartRequest = { variantId: item.variantId, quantity: item.quantity };
      return this.http.post<Cart>(`${this.API}/add`, request).pipe(
        tap(cart => this.cart.set(cart))
      );
    } else {
      const currentCart = this.cart();
      const existing = currentCart.items.find(i => i.variantId === item.variantId);
      
      if (existing) {
        existing.quantity += item.quantity;
        existing.subtotal = existing.quantity * existing.price;
      } else {
        currentCart.items.push({ ...item, subtotal: item.quantity * item.price });
      }
      
      this.updateLocalCart(currentCart.items);
      return of(this.cart());
    }
  }

  updateQuantity(variantId: number, quantity: number, itemId?: number) {
    if (this.authService.isLoggedIn() && itemId) {
      return this.http.put<Cart>(`${this.API}/update/${itemId}`, quantity).pipe(
        tap(cart => this.cart.set(cart))
      );
    } else {
      const currentCart = this.cart();
      const item = currentCart.items.find(i => i.variantId === variantId);
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(variantId, itemId);
        } else {
          item.quantity = quantity;
          item.subtotal = item.quantity * item.price;
          this.updateLocalCart(currentCart.items);
        }
      }
      return of(this.cart());
    }
  }

  removeFromCart(variantId: number, itemId?: number) {
    if (this.authService.isLoggedIn() && itemId) {
      return this.http.delete<Cart>(`${this.API}/item/${itemId}`).pipe(
        tap(cart => this.cart.set(cart))
      );
    } else {
      const currentCart = this.cart();
      const items = currentCart.items.filter(i => i.variantId !== variantId);
      this.updateLocalCart(items);
      return of(this.cart());
    }
  }

  private loadLocalCart() {
    const raw = localStorage.getItem(this.CART_KEY);
    const items: CartItem[] = raw ? JSON.parse(raw) : [];
    this.updateLocalCart(items);
  }

  private updateLocalCart(items: CartItem[]) {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0);
    const newCart = { items, totalItems, totalPrice };
    
    this.cart.set(newCart);
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    }
  }

  private fetchCartFromApi(): Observable<Cart> {
    return this.http.get<Cart>(this.API).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  private mergeOrRefreshCart() {
    const raw = localStorage.getItem(this.CART_KEY);
    const localItems: CartItem[] = raw ? JSON.parse(raw) : [];

    if (localItems.length > 0) {
      const requests: AddToCartRequest[] = localItems.map(i => ({
        variantId: i.variantId,
        quantity: i.quantity
      }));

      this.http.post<Cart>(`${this.API}/merge`, requests).subscribe(cart => {
        this.cart.set(cart);
        localStorage.removeItem(this.CART_KEY); // Clear local after merge
      });
    } else {
      this.fetchCartFromApi().subscribe();
    }
  }
}
