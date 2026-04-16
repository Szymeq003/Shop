import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { UiService } from '../../../core/services/ui.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div
      class="product-card"
      [class.list-mode]="viewMode === 'list'"
      [routerLink]="['/products', product.id]"
    >
      <!-- Image -->
      <div class="image-wrapper">
        <img
          [src]="product.mainImageUrl || 'assets/placeholder.png'"
          [alt]="product.name"
          loading="lazy"
        >
      </div>

      <!-- Card body -->
      <div class="card-body">
        <div class="card-top">
          <span class="category-tag">{{ product.categoryName }}</span>
          <h3 class="product-name">{{ product.name }}</h3>

          <div class="rating-row">
            <div class="stars">
              <span
                *ngFor="let s of [1,2,3,4,5]"
                class="star"
                [class.filled]="s <= product.averageRating"
                [class.half]="s - 0.5 <= product.averageRating && s > product.averageRating"
              >★</span>
            </div>
            <span class="rating-num">{{ product.averageRating | number:'1.1-1' }}</span>
            <span class="review-count">({{ product.reviewCount }})</span>
          </div>
        </div>

        <div class="card-bottom">
          <div class="price-block">
            <span class="price">{{ product.price | currency:'PLN':'symbol':'1.2-2' }}</span>
          </div>

          <div class="action-group">
            <button
              class="btn-wishlist"
              [class.active]="isInWishlist"
              (click)="toggleWishlist($event)"
              [title]="isInWishlist ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <button
              class="btn-cart"
              (click)="addToCart($event)"
              title="Dodaj do koszyka"
              type="button"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
              </svg>
              <span class="cart-label" *ngIf="viewMode === 'list'">Do koszyka</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ─── Base card ─── */
    .product-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s ease,
                  border-color 0.3s ease,
                  background 0.3s ease;
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-6px);
      background: var(--card-hover);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
      border-color: rgba(108, 99, 255, 0.4);
    }

    /* ─── Image ─── */
    .image-wrapper {
      position: relative;
      padding-top: 80%;
      background: linear-gradient(135deg, #f8f9fa, #fff);
      overflow: hidden;
      flex-shrink: 0;
    }

    .image-wrapper img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 12px;
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .product-card:hover .image-wrapper img {
      transform: scale(1.07);
    }



    /* ─── Card body ─── */
    .card-body {
      padding: 14px 16px 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-top {
      flex: 1;
    }

    .category-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary-light);
      background: rgba(108,99,255,0.12);
      padding: 2px 8px;
      border-radius: 100px;
      margin-bottom: 8px;
    }

    .product-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.45;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* ─── Rating ─── */
    .rating-row {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 14px;
    }

    .stars { display: flex; }
    .star { color: #2d3748; font-size: 13px; transition: color 0.15s; }
    .star.filled { color: #f59e0b; }

    .rating-num {
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
    }

    .review-count {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* ─── Card bottom ─── */
    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: auto;
    }

    .price {
      font-size: 17px;
      font-weight: 800;
      color: var(--primary-light);
      letter-spacing: -0.3px;
    }

    .action-group {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .btn-wishlist {
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border);
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-muted);
      flex-shrink: 0;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .btn-wishlist:hover {
      color: #ef4444;
      border-color: rgba(239,68,68,0.4);
      background: rgba(239,68,68,0.08);
      transform: scale(1.1);
    }

    .btn-wishlist.active {
      color: #ef4444;
      border-color: rgba(239,68,68,0.5);
      background: rgba(239,68,68,0.1);
    }

    .btn-wishlist.active path { fill: #ef4444; stroke: #ef4444; }

    .btn-cart {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      border: none;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      padding: 0 14px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(108,99,255,0.3);
      white-space: nowrap;
    }

    .btn-cart:hover {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      box-shadow: 0 6px 16px rgba(108,99,255,0.5);
      transform: scale(1.04);
    }

    /* ─── List mode ─── */
    .product-card.list-mode {
      flex-direction: row;
      height: auto;
      border-radius: 14px;
      transform: none !important;
    }

    .product-card.list-mode:hover {
      transform: translateX(4px) !important;
      box-shadow: 0 6px 24px rgba(0,0,0,0.25);
    }

    .product-card.list-mode .image-wrapper {
      width: 160px;
      flex-shrink: 0;
      padding-top: 0;
      height: 160px;
      border-radius: 0;
    }

    .product-card.list-mode .image-wrapper img {
      position: static;
      width: 100%;
      height: 100%;
      padding: 16px;
    }

    .product-card.list-mode .card-body {
      flex-direction: row;
      flex: 1;
      padding: 16px 20px;
      gap: 16px;
      align-items: center;
    }

    .product-card.list-mode .card-top {
      flex: 1;
    }

    .product-card.list-mode .product-name {
      font-size: 15px;
      -webkit-line-clamp: 1;
      margin-bottom: 8px;
    }

    .product-card.list-mode .card-bottom {
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      margin-top: 0;
      flex-shrink: 0;
    }

    .product-card.list-mode .price {
      font-size: 20px;
    }

    .product-card.list-mode .btn-cart {
      padding: 0 18px;
    }

    .product-card.list-mode .rating-row {
      margin-bottom: 0;
    }

    .cart-label {
      font-size: 13px;
    }

    /* ─── Responsive ─── */
    @media (max-width: 560px) {
      .product-card.list-mode .image-wrapper {
        width: 100px;
        height: 100px;
      }

      .product-card.list-mode .card-body {
        padding: 12px 14px;
        gap: 10px;
      }

      .product-card.list-mode .price {
        font-size: 16px;
      }
    }
  `]
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private ui = inject(UiService);
  private wishlistService = inject(WishlistService);
  private auth = inject(AuthService);

  @Input() product!: Product;
  @Input() isInWishlist: boolean = false;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() wishlistChanged = new EventEmitter<number>();

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
      sku: '',
      mainImageUrl: this.product.mainImageUrl,
      price: this.product.price,
      quantity: 1,
      subtotal: this.product.price,
      attributes: {}
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      this.ui.showToast('Dodano do koszyka!');
    });
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) {
      this.ui.showToast('Zaloguj się, aby dodać do ulubionych', 'error');
      return;
    }

    const originalState = this.isInWishlist;
    this.isInWishlist = !this.isInWishlist;

    if (originalState) {
      this.wishlistChanged.emit(this.product.id);
      this.wishlistService.removeFromWishlist(this.product.id).subscribe({
        next: () => { this.ui.showToast('Usunięto z ulubionych'); },
        error: () => {
          this.isInWishlist = originalState;
          this.ui.showToast('Wystąpił błąd podczas usuwania', 'error');
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.product.id).subscribe({
        next: () => { this.ui.showToast('Dodano do ulubionych!'); },
        error: () => {
          this.isInWishlist = originalState;
          this.ui.showToast('Wystąpił błąd podczas dodawania', 'error');
        }
      });
    }
  }
}
