import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="product-card" [routerLink]="['/products', product.id]">
      <div class="image-wrapper">
        <img [src]="product.mainImageUrl || 'assets/placeholder.png'" [alt]="product.name">
      </div>
      
      <div class="card-content">
        <div class="category">{{ product.categoryName }}</div>
        <h3 class="product-name">{{ product.name }}</h3>
        
        <div class="rating-box">
          <div class="stars">
            <span class="star" *ngFor="let s of [1,2,3,4,5]" [class.filled]="s <= product.averageRating">★</span>
          </div>
          <span class="count">({{ product.reviewCount }})</span>
        </div>

        <div class="price-action">
          <div class="price">{{ product.price | currency:'PLN':'symbol':'1.2-2' }}</div>
          <button class="btn-add-cart" (click)="addToCart($event)">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-card:hover {
      transform: translateY(-8px);
      background: var(--card-hover);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
      border-color: var(--primary);
    }

    .image-wrapper {
      position: relative;
      padding-top: 100%;
      background: #fff;
      overflow: hidden;
    }

    .image-wrapper img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      transition: transform 0.5s ease;
    }

    .product-card:hover img {
      transform: translate(-50%, -50%) scale(1.05);
    }

    .card-content {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .category {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .product-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--text);
      line-height: 1.4;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .rating-box {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
    }

    .stars { color: #555; font-size: 14px; }
    .star.filled { color: #ffab00; }
    .count { font-size: 12px; color: var(--text-muted); }

    .price-action {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-light);
    }

    .btn-add-cart {
      background: var(--primary);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      fill: currentColor;
    }

    .btn-add-cart:hover {
      background: var(--primary-dark);
      transform: scale(1.1);
    }
  `]
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private ui = inject(UiService);
  @Input() product!: Product;

  addToCart(event: Event) {
    event.stopPropagation();
    
    if (!this.product.defaultVariantId) {
      this.ui.showToast('Ten produkt nie może zostać dodany do koszyka z poziomu listy.', 'error');
      return;
    }

    const cartItem: CartItem = {
      productId: this.product.id,
      variantId: this.product.defaultVariantId,
      productName: this.product.name,
      sku: '', // Not critical for list add
      mainImageUrl: this.product.mainImageUrl,
      price: this.product.price,
      quantity: 1,
      subtotal: this.product.price,
      attributes: {} // Not picked yet
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      this.ui.showToast('Dodano do koszyka!');
    });
  }
}
