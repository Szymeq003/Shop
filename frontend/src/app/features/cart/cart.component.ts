import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  template: `
    <div class="cart-page container">
      <header class="page-header">
        <h1>Twój koszyk</h1>
        <p *ngIf="cart().totalItems > 0">Masz {{ cart().totalItems }} produkty w koszyku</p>
      </header>

      <div class="cart-layout" *ngIf="cart().items.length > 0; else emptyCart">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cart().items">
            <div class="item-image">
              <img [src]="item.mainImageUrl || 'assets/images/placeholder.png'" [alt]="item.productName">
            </div>
            
            <div class="item-details">
              <div class="item-main">
                <a [routerLink]="['/products', item.productId]" class="item-name">{{ item.productName }}</a>
                <div class="item-meta">
                  <span class="sku">SKU: {{ item.sku }}</span>
                  <div class="attributes">
                    <span *ngFor="let attr of item.attributes | keyvalue" class="attr-tag">
                      {{ attr.key }}: {{ attr.value }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="item-pricing">
                <div class="unit-price">{{ item.price | currency:'PLN':'symbol':'1.2-2' }}</div>
                
                <div class="quantity-controls">
                  <button (click)="updateQuantity(item, -1)">-</button>
                  <span [class.text-warning]="item.quantity >= item.stockQuantity" [title]="item.quantity >= item.stockQuantity ? 'Maksymalna dostępna ilość' : ''">
                    {{ item.quantity }}
                  </span>
                  <button (click)="updateQuantity(item, 1)" [disabled]="item.quantity >= item.stockQuantity" [title]="item.quantity >= item.stockQuantity ? 'Brak więcej na magazynie' : ''">+</button>
                </div>

                <div class="subtotal">{{ item.subtotal | currency:'PLN':'symbol':'1.2-2' }}</div>

                <button class="btn-remove" (click)="removeItem(item)" title="Usuń z koszyka">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside class="cart-summary">
          <div class="summary-card">
            <h2>Podsumowanie</h2>
            
            <div class="summary-row">
              <span>Wartość produktów:</span>
              <span>{{ cart().totalPrice | currency:'PLN':'symbol':'1.2-2' }}</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="discount-section">
              <label for="discount">Kod rabatowy</label>
              <div class="discount-input-group">
                <input 
                  type="text" 
                  id="discount" 
                  [(ngModel)]="discountCodeInput" 
                  placeholder="Wpisz swój kod"
                  [disabled]="!!appliedDiscount()"
                >
                <button 
                  class="btn-apply" 
                  (click)="applyDiscount()" 
                  [disabled]="!discountCodeInput || !!appliedDiscount()"
                >
                  Ok
                </button>
              </div>
              <p class="discount-error" *ngIf="discountError">{{ discountError }}</p>
              
              <div class="applied-discount" *ngIf="appliedDiscount()">
                <span class="discount-name">Zastosowano kod: <strong>{{ appliedDiscount()!.code }}</strong></span>
                <button class="btn-remove-discount" (click)="removeDiscount()" title="Usuń kod">✕</button>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row discount-row" *ngIf="appliedDiscount()">
              <span>Rabat ({{ appliedDiscount()!.code }}):</span>
              <span class="discount-amount">-{{ getDiscountAmount() | currency:'PLN':'symbol':'1.2-2' }}</span>
            </div>
            
            <div class="summary-row total">
              <span>Razem do zapłaty:</span>
              <span>{{ getFinalPrice() | currency:'PLN':'symbol':'1.2-2' }}</span>
            </div>

            <button class="btn btn-primary btn-full btn-checkout" routerLink="/checkout">
              Przejdź do dostawy
            </button>
            
            <div class="security-info">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Bezpieczne płatności SSL
            </div>
          </div>
        </aside>
      </div>

      <ng-template #emptyCart>
        <div class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <h2>Twój koszyk jest pusty</h2>
          <p>Wygląda na to, że nie dodałeś jeszcze żadnych produktów.</p>
          <button class="btn btn-primary" routerLink="/products">Zacznij zakupy</button>
        </div>
      </ng-template>
    </div>
  `,

})
export class CartComponent {
  cartService = inject(CartService);
  ui = inject(UiService);
  cart = this.cartService.cart;
  appliedDiscount = this.cartService.appliedDiscount;

  discountCodeInput = '';
  discountError = '';

  updateQuantity(item: CartItem, delta: number) {
    this.cartService.updateQuantity(item.variantId, item.quantity + delta, item.id).subscribe({
      error: (err) => {
        const errorMsg = err.error?.message || 'Nie można zmienić ilości (brak na magazynie?)';
        this.ui.showToast(errorMsg, 'error');
      }
    });
  }

  async removeItem(item: CartItem) {
    const confirmed = await this.ui.confirm(`Czy na pewno chcesz usunąć ${item.productName} z koszyka?`);
    if (confirmed) {
      this.cartService.removeFromCart(item.variantId, item.id).subscribe(() => {
        this.ui.showToast('Produkt został usunięty z koszyka', 'info');
      });
    }
  }

  applyDiscount() {
    this.discountError = '';
    const result = this.cartService.applyDiscount(this.discountCodeInput);
    if (result.success) {
      this.ui.showToast(result.message);
    } else {
      this.discountError = result.message;
    }
  }

  removeDiscount() {
    this.cartService.removeDiscount();
    this.discountCodeInput = '';
    this.discountError = '';
    this.ui.showToast('Kod rabatowy został usunięty.');
  }

  getDiscountAmount(): number { return this.cartService.getDiscountAmount(); }
  getFinalPrice(): number     { return this.cartService.getFinalPrice(); }
}
