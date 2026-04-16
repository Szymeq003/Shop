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
                  <span>{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item, 1)">+</button>
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
            <div class="summary-row">
              <span>Dostawa:</span>
              <span class="free">Gratis</span>
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
                  [disabled]="!!appliedDiscount"
                >
                <button 
                  class="btn-apply" 
                  (click)="applyDiscount()" 
                  [disabled]="!discountCodeInput || !!appliedDiscount"
                >
                  Ok
                </button>
              </div>
              <p class="discount-error" *ngIf="discountError">{{ discountError }}</p>
              
              <div class="applied-discount" *ngIf="appliedDiscount">
                <span class="discount-name">Zastosowano kod: <strong>{{ appliedDiscount.code }}</strong></span>
                <button class="btn-remove-discount" (click)="removeDiscount()" title="Usuń kod">✕</button>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row discount-row" *ngIf="appliedDiscount">
              <span>Rabat ({{ appliedDiscount.code }}):</span>
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
  styles: [`
    .cart-page { padding: 40px 0 100px; }
    
    .page-header { margin-bottom: 40px; }
    .page-header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
    .page-header p { color: var(--text-muted); }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 40px;
      align-items: start;
    }

    .cart-items {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
    }

    .cart-item {
      display: flex;
      gap: 24px;
      padding: 24px;
      border-bottom: 1px solid var(--border);
    }
    .cart-item:last-child { border-bottom: none; }

    .item-image {
      width: 120px; height: 120px;
      background: #fff; border-radius: 12px;
      padding: 12px; border: 1px solid var(--border);
      flex-shrink: 0;
    }
    .item-image img { width: 100%; height: 100%; object-fit: contain; }

    .item-details { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
    
    .item-name { font-size: 18px; font-weight: 600; color: var(--text); text-decoration: none; margin-bottom: 4px; display: block; }
    .item-meta { display: flex; flex-direction: column; gap: 8px; }
    .sku { font-size: 13px; color: var(--text-muted); }
    .attributes { display: flex; gap: 8px; flex-wrap: wrap; }
    .attr-tag { font-size: 12px; background: rgba(var(--primary-rgb), 0.05); color: var(--primary); padding: 2px 8px; border-radius: 6px; }

    .item-pricing {
      display: flex; align-items: center; justify-content: space-between; margin-top: 16px;
    }
    .unit-price { color: var(--text-muted); font-size: 14px; width: 100px; }
    
    .quantity-controls {
      display: flex; align-items: center; gap: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 4px 12px;
    }
    .quantity-controls button { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text); }
    
    .subtotal { font-weight: 700; font-size: 18px; color: var(--primary-light); width: 120px; text-align: right; }
    
    .btn-remove {
      background: none; border: none; color: var(--error); cursor: pointer; padding: 8px; opacity: 0.6; transition: opacity 0.2s;
    }
    .btn-remove:hover { opacity: 1; }
    .btn-remove svg { width: 20px; height: 20px; }

    .summary-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      position: sticky; top: 100px;
    }
    .summary-card h2 { font-size: 20px; margin-bottom: 24px; }
    
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; color: var(--text-muted); }
    .summary-row.total { color: var(--text); font-size: 20px; font-weight: 700; margin-top: 24px; }
    .free { color: var(--success); font-weight: 600; }
    
    .summary-divider { height: 1px; background: var(--border); margin: 24px 0; }
    
    .discount-section label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted); }
    .discount-input-group { display: flex; gap: 8px; }
    .discount-input-group input {
      flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg); color: var(--text); font-family: inherit; font-size: 14px;
    }
    .discount-input-group input:focus { border-color: var(--primary); outline: none; }
    .btn-apply {
      padding: 0 16px; border-radius: 8px; background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary-light); font-weight: 600; border: none; cursor: pointer; transition: 0.2s;
    }
    .btn-apply:hover:not(:disabled) { background: var(--primary); color: white; }
    .btn-apply:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .discount-error { color: var(--error); font-size: 12px; margin-top: 8px; }
    
    .applied-discount {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 12px; padding: 8px 12px; border-radius: 6px;
      background: rgba(var(--success-rgb), 0.1); border: 1px solid rgba(var(--success-rgb), 0.2);
    }
    .discount-name { font-size: 13px; color: var(--success); }
    .btn-remove-discount {
      background: none; border: none; color: var(--success); cursor: pointer;
      font-size: 14px; padding: 0 4px; display: flex; align-items: center; opacity: 0.7;
    }
    .btn-remove-discount:hover { opacity: 1; }

    .discount-row { color: var(--success); font-weight: 600; }
    .discount-amount { color: var(--error); }

    .btn-checkout { height: 56px; margin-top: 32px; border-radius: 12px; font-size: 16px; font-weight: 600; }

    .security-info {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 24px; color: var(--text-muted); font-size: 13px;
    }
    .security-info svg { width: 14px; height: 14px; }

    .empty-state {
      text-align: center; padding: 100px 0;
      background: var(--card); border: 1px solid var(--border); border-radius: 20px;
    }
    .empty-icon {
      width: 80px; height: 80px; background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary); border-radius: 50%; display: flex;
      align-items: center; justify-content: center; margin: 0 auto 24px;
    }
    .empty-icon svg { width: 40px; height: 40px; }
    .empty-state h2 { margin-bottom: 12px; }
    .empty-state p { color: var(--text-muted); margin-bottom: 32px; }

    @media (max-width: 992px) {
      .cart-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  ui = inject(UiService);
  cart = this.cartService.cart;

  discountCodeInput = '';
  discountError = '';
  appliedDiscount: { code: string, type: 'percent' | 'fixed', value: number } | null = null;

  // Przykładowe kody rabatowe
  private validCodes: Record<string, { type: 'percent' | 'fixed', value: number }> = {
    'RABAT10': { type: 'percent', value: 10 },
    'HELLO20': { type: 'percent', value: 20 },
    'PROMO15': { type: 'percent', value: 15 },
    'NEWS50':  { type: 'fixed', value: 50 },  // Newsletter code
  };

  updateQuantity(item: CartItem, delta: number) {
    this.cartService.updateQuantity(item.variantId, item.quantity + delta, item.id).subscribe();
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
    const code = this.discountCodeInput.trim().toUpperCase();
    
    if (!code) return;

    if (this.validCodes[code]) {
      const discount = this.validCodes[code];
      this.appliedDiscount = {
        code: code,
        type: discount.type,
        value: discount.value
      };
      
      const message = discount.type === 'percent' 
        ? `Kod rabatowy ${code} na ${discount.value}% został naliczony! 🎉`
        : `Kod rabatowy ${code} na ${discount.value} zł został naliczony! 🎉`;
        
      this.ui.showToast(message);
    } else {
      this.discountError = 'Nieprawidłowy lub przeterminowany kod rabatowy.';
    }
  }

  removeDiscount() {
    this.appliedDiscount = null;
    this.discountCodeInput = '';
    this.discountError = '';
    this.ui.showToast('Kod rabatowy został usunięty.');
  }

  getDiscountAmount(): number {
    if (!this.appliedDiscount) return 0;
    
    let discountAmount = 0;
    if (this.appliedDiscount.type === 'percent') {
      discountAmount = (this.cart().totalPrice * this.appliedDiscount.value) / 100;
    } else if (this.appliedDiscount.type === 'fixed') {
      discountAmount = this.appliedDiscount.value;
    }
    
    // Zabezpieczenie przed ujemną ceną całkowitą produktów
    return Math.min(discountAmount, this.cart().totalPrice);
  }

  getFinalPrice(): number {
    return Math.max(0, this.cart().totalPrice - this.getDiscountAmount());
  }
}
