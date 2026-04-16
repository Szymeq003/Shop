import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductDetail, ProductVariant } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { UiService } from '../../../core/services/ui.service';
import { ReviewService } from '../../../core/services/review.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule, StarRatingComponent],
  template: `
    <div class="product-detail-page container" *ngIf="product()">
      <nav class="breadcrumb">
        <a routerLink="/products">Produkty</a>
        <span class="separator">/</span>
        <span>{{ product()?.categoryName }}</span>
        <span class="separator">/</span>
        <span class="current">{{ product()?.name }}</span>
      </nav>

      <div class="main-layout">
        <div class="gallery-section">
          <div class="main-image">
            <img *ngIf="selectedImage() || product()?.mainImageUrl || (product()?.imageUrls?.length ? product()!.imageUrls[0] : null)" 
                 [src]="selectedImage() || product()?.mainImageUrl || product()!.imageUrls[0]" 
                 [alt]="product()?.name">
          </div>
          <div class="thumbnails" *ngIf="product()?.imageUrls && product()!.imageUrls.length > 1">
            <div 
              class="thumb" 
              *ngFor="let img of product()?.imageUrls" 
              (click)="selectedImage.set(img)"
              [class.active]="selectedImage() === img"
            >
              <img [src]="img" alt="Thumbnail">
            </div>
          </div>
        </div>

        <div class="info-section">
          <h1 class="product-name">{{ product()?.name }}</h1>

          <div class="variants-section" *ngIf="product()?.variants?.length">
            <h3>Wybierz wariant</h3>
            <div class="variants-grid">
              <div 
                class="variant-card" 
                *ngFor="let variant of product()?.variants"
                [class.active]="selectedVariant()?.id === variant.id"
                (click)="selectedVariant.set(variant)"
              >
                <div class="variant-info">
                  <span *ngFor="let attr of variant.attributeValues | keyvalue" class="attr-tag">
                    {{ attr.value }}
                  </span>
                </div>
                <div class="variant-price" *ngIf="variant.price">
                  {{ variant.price | currency:'PLN':'symbol':'1.2-2' }}
                </div>
              </div>
            </div>
          </div>

          <div class="price-box">
            <div class="price-row">
              <div class="price">
                {{ (selectedVariant()?.price || product()?.price) | currency:'PLN':'symbol':'1.2-2' }}
              </div>
            </div>
            <div class="availability" [class.out-of-stock]="isOutOfStock()">
              <span class="dot"></span> 
              {{ isOutOfStock() ? 'Brak w magazynie' : 'Dostępny w magazynie' }}
              <span class="stock-count" *ngIf="selectedVariant()">({{ selectedVariant()?.stockQuantity }} szt.)</span>
            </div>
          </div>

          <div class="actions">
            <div class="quantity-input">
              <button (click)="changeQuantity(-1)">-</button>
              <input type="number" [(ngModel)]="quantity" readonly>
              <button (click)="changeQuantity(1)">+</button>
            </div>
            <button 
              class="btn btn-primary btn-lg btn-add" 
              (click)="addToCart()"
              [disabled]="isOutOfStock()"
            >
              Dodaj do koszyka
            </button>
            <button 
              class="wishlist-btn" 
              [class.in-wishlist]="isInWishlist()" 
              (click)="toggleWishlist()"
              [title]="isInWishlist() ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div class="short-description">
            <h3>Opis produktu</h3>
            <p>{{ product()?.description }}</p>
          </div>
        </div>
      </div>

      <div class="detailed-info">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'specs'"
            (click)="activeTab.set('specs')"
          >Specyfikacja</button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'reviews'"
            (click)="activeTab.set('reviews')"
          >Opinie ({{ product()?.reviewCount }})</button>
        </div>

        <div class="tab-content">
          <table class="specs-table" *ngIf="activeTab() === 'specs'">
            <tr *ngFor="let attr of getAttributes()">
              <td class="label">{{ attr.key }}</td>
              <td class="value">{{ attr.values.join(', ') }}</td>
            </tr>
          </table>

          <div class="reviews-content" *ngIf="activeTab() === 'reviews'">
            <div class="add-review-section" *ngIf="auth.isLoggedIn()">
              <h3>Dodaj swoją opinię</h3>
              <div class="review-form">
                <div class="rating-picker">
                  <span>Twoja ocena:</span>
                  <app-star-rating [rating]="newReviewRating" (ratingChange)="newReviewRating = $event"></app-star-rating>
                </div>
                <div class="textarea-wrapper">
                  <textarea 
                    [(ngModel)]="newReviewComment" 
                    placeholder="Napisz co sądzisz o produkcie..."
                    rows="4"
                  ></textarea>
                </div>
                <button 
                  class="btn btn-primary" 
                  (click)="submitReview()"
                  [disabled]="isSubmittingReview() || !newReviewRating"
                >
                  Opublikuj opinię
                </button>
              </div>
            </div>

            <div class="reviews-list">
              <div class="review-item" *ngFor="let review of product()?.reviews">
                <div class="review-header">
                  <span class="user-name">{{ review.userName }}</span>
                  <app-star-rating [rating]="review.rating" [readonly]="true"></app-star-rating>
                  <span class="date">{{ review.createdAt | date:'dd.MM.yyyy' }}</span>
                </div>
                <p class="comment">{{ review.comment }}</p>
              </div>
              <div class="empty-reviews" *ngIf="!product()?.reviews?.length">
                <p>Ten produkt nie posiada jeszcze żadnych opinii. Bądź pierwszy!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading()" class="loading-state container">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .product-detail-page { padding: 40px 0 100px; }

    .breadcrumb {
      display: flex;
      gap: 8px;
      font-size: 14px;
      margin-bottom: 32px;
      color: var(--text-muted);
    }
    .breadcrumb a { color: var(--text-muted); }
    .breadcrumb .current { color: var(--text); }

    .main-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin-bottom: 80px;
    }

    .main-image {
      background: #fff;
      border-radius: 20px;
      padding: 40px;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 1px solid var(--border);
    }
    .main-image img { max-width: 100%; max-height: 100%; object-fit: contain; }

    .thumbnails { display: flex; gap: 12px; }
    .thumb {
      width: 80px; height: 80px;
      padding: 10px; background: #fff;
      border: 1px solid var(--border);
      border-radius: 10px; cursor: pointer;
    }
    .thumb.active { border-color: var(--primary); border-width: 2px; }
    .thumb img { width: 100%; height: 100%; object-fit: contain; }

    .product-name { font-size: 32px; font-weight: 700; margin-bottom: 16px; }

    .rating-summary { display: flex; gap: 12px; margin-bottom: 32px; font-size: 15px; }
    .stars { color: #ffab00; font-weight: 600; }

    .price-box {
      background: var(--card);
      border: 1px solid var(--border);
      padding: 24px; border-radius: 20px; margin-bottom: 32px;
    }
    .price-row { display: flex; align-items: flex-start; margin-bottom: 8px; }
    .price { font-size: 36px; font-weight: 700; color: var(--primary-light); }
    .wishlist-btn {
      background: #fff; border: 2px solid #e2e8f0; width: 56px; height: 56px;
      border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); color: #94a3b8;
      flex-shrink: 0;
    }
    .wishlist-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fff1f2; transform: scale(1.05); }
    .heart-icon { width: 24px; height: 24px; transition: all 0.3s; }
    .wishlist-btn.in-wishlist { background: #fff1f2; border-color: #ef4444; color: #ef4444; }
    .wishlist-btn.in-wishlist .heart-icon { fill: currentColor; }
    .availability { color: var(--success); font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .availability .dot { width: 8px; height: 8px; background: currentColor; border-radius: 50%; }

    .actions { display: flex; gap: 20px; margin-bottom: 40px; }
    .quantity-input {
      display: flex; align-items: center; border: 1px solid var(--border); border-radius: 12px;
    }
    .quantity-input button {
      background: none; border: none; color: var(--text); padding: 0 16px; cursor: pointer; font-size: 20px;
    }
    .quantity-input input {
      width: 50px; background: none; border: none; color: var(--text); text-align: center;
    }
    .btn-add { flex-grow: 1; height: 56px; border-radius: 12px; }

    .short-description h3 { font-size: 18px; margin-bottom: 12px; }
    .short-description p { color: var(--text-muted); line-height: 1.8; }

    .variants-section { margin-bottom: 32px; }
    .variants-section h3 { font-size: 16px; margin-bottom: 16px; font-weight: 600; }
    .variants-grid { display: flex; flex-wrap: wrap; gap: 12px; }
    .variant-card {
      padding: 12px 20px; border: 1px solid var(--border); border-radius: 12px; cursor: pointer;
      display: flex; flex-direction: column; gap: 4px; transition: all 0.2s;
    }
    .variant-card.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }
    .attr-tag { font-size: 14px; font-weight: 600; }
    .variant-price { font-size: 13px; color: var(--text-muted); }

    .availability.out-of-stock { color: var(--error); }
    .stock-count { font-size: 13px; opacity: 0.8; margin-left: 4px; }

    .detailed-info { margin-top: 80px; }
    .tabs { display: flex; gap: 40px; border-bottom: 1px solid var(--border); margin-bottom: 40px; }
    .tab-btn {
      background: none; border: none; color: var(--text-muted);
      font-size: 18px; font-weight: 600; padding: 16px 0; cursor: pointer;
      position: relative;
    }
    .tab-btn.active { color: var(--text); }
    .tab-btn.active:after {
      content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: var(--primary);
    }

    .specs-table { width: 100%; border-collapse: collapse; }
    .specs-table tr { border-bottom: 1px solid var(--border); }
    .specs-table td { padding: 20px; font-size: 15px; }
    .specs-table .label { color: var(--text-muted); width: 250px; font-weight: 500; }
    .specs-table .value { color: var(--text); font-weight: 500; }

    .reviews-content { animation: fadeIn 0.3s ease; }
    .add-review-section {
      background: var(--card);
      padding: 32px;
      border-radius: 20px;
      margin-bottom: 40px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    }
    .add-review-section h3 {
      margin-bottom: 24px;
      font-size: 20px;
      font-weight: 700;
    }
    .review-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .rating-picker {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: rgba(0,0,0,0.02);
      border-radius: 12px;
      font-weight: 600;
    }
    .textarea-wrapper {
      position: relative;
    }
    .review-form textarea {
      width: 100%;
      padding: 20px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--card);
      font-family: inherit;
      resize: vertical;
      min-height: 120px;
      font-size: 15px;
      color: var(--text);
      transition: all 0.3s;
    }
    .review-form textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
    }
    .review-form textarea::placeholder {
      color: #94a3b8;
    }
    .review-form .btn-primary {
      align-self: flex-end;
      padding: 14px 32px;
      font-weight: 600;
      border-radius: 12px;
    }
    
    .reviews-list { display: flex; flex-direction: column; gap: 24px; }
    .review-item { padding-bottom: 24px; border-bottom: 1px solid var(--border); }
    .review-header { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
    .user-name { font-weight: 700; }
    .date { color: var(--text-muted); font-size: 14px; margin-left: auto; }
    .comment { line-height: 1.6; color: var(--text); }
    .empty-reviews { text-align: center; padding: 40px; color: var(--text-muted); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 992px) {
      .main-layout { grid-template-columns: 1fr; gap: 40px; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private wishlistService = inject(WishlistService);
  public auth = inject(AuthService);
  private ui = inject(UiService);

  product = signal<ProductDetail | null>(null);
  isLoading = signal(true);
  selectedImage = signal<string | null>(null);
  selectedVariant = signal<ProductVariant | null>(null);
  activeTab = signal<'specs' | 'reviews'>('specs');
  isInWishlist = signal(false);
  quantity = 1;

  // Review form state
  newReviewRating = 0;
  newReviewComment = '';
  isSubmittingReview = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
      this.checkWishlist(+id);
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(p => {
      this.product.set(p);
      this.isLoading.set(false);

      if (p.imageUrls && p.imageUrls.length > 0) {
        this.selectedImage.set(p.imageUrls[0]);
      } else if (p.mainImageUrl) {
        this.selectedImage.set(p.mainImageUrl);
      }

      if (p.variants && p.variants.length > 0 && !this.selectedVariant()) {
        this.selectedVariant.set(p.variants[0]);
      }
    });
  }

  checkWishlist(id: number) {
    if (this.auth.isLoggedIn()) {
      this.wishlistService.getWishlist().subscribe(list => {
        this.isInWishlist.set(list.some(item => item.id === id));
      });
    }
  }

  toggleWishlist() {
    if (!this.auth.isLoggedIn()) {
      this.ui.showToast('Zaloguj się, aby dodać do ulubionych', 'error');
      return;
    }

    const productId = this.product()?.id;
    if (!productId) return;

    const originalState = this.isInWishlist();
    this.isInWishlist.set(!originalState);

    if (originalState) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.ui.showToast('Usunięto z ulubionych');
        },
        error: () => {
          this.isInWishlist.set(originalState); // Revert
          this.ui.showToast('Wystąpił błąd podczas usuwania', 'error');
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.ui.showToast('Dodano do ulubionych!');
        },
        error: () => {
          this.isInWishlist.set(originalState); // Revert
          this.ui.showToast('Wystąpił błąd podczas dodawania', 'error');
        }
      });
    }
  }

  submitReview() {
    if (!this.newReviewRating) return;
    
    const productId = this.product()?.id;
    if (!productId) return;

    this.isSubmittingReview.set(true);
    this.reviewService.addReview(productId, {
      rating: this.newReviewRating,
      comment: this.newReviewComment
    }).subscribe({
      next: () => {
        this.ui.showToast('Opinia została dodana!');
        this.loadProduct(productId); // Reload to show new review
        this.newReviewRating = 0;
        this.newReviewComment = '';
        this.isSubmittingReview.set(false);
      },
      error: (err) => {
        this.ui.showToast(err.error?.message || 'Wystąpił błąd podczas dodawania opinii', 'error');
        this.isSubmittingReview.set(false);
      }
    });
  }

  getAttributes() {
    const attrs = this.product()?.attributes || {};
    return Object.keys(attrs).map(key => ({ key, values: attrs[key] }));
  }

  isOutOfStock() {
    if (this.product()?.variants?.length) {
      return this.selectedVariant() ? this.selectedVariant()!.stockQuantity <= 0 : false;
    }
    return false; // Assuming base product stock is handled by variants
  }

  changeQuantity(delta: number) {
    this.quantity = Math.max(1, this.quantity + delta);
    if (this.selectedVariant() && this.quantity > this.selectedVariant()!.stockQuantity) {
      this.quantity = this.selectedVariant()!.stockQuantity;
    }
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    // Use selected variant or first variant if only one exist and none selected
    let variant = this.selectedVariant();
    if (!variant && p.variants.length === 1) {
      variant = p.variants[0];
    }

    if (!variant) {
      this.ui.showToast('Proszę wybrać wariant produktu', 'error');
      return;
    }

    const cartItem: CartItem = {
      productId: p.id,
      variantId: variant.id,
      productName: p.name,
      sku: variant.sku,
      mainImageUrl: p.mainImageUrl,
      price: variant.price || p.price,
      quantity: this.quantity,
      subtotal: (variant.price || p.price) * this.quantity,
      attributes: variant.attributeValues
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      this.ui.showToast('Dodano do koszyka!');
    });
  }
}
