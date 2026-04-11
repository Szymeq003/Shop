import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductDetail } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
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
            <img [src]="selectedImage() || product()?.mainImageUrl" [alt]="product()?.name">
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
          
          <div class="rating-summary">
            <span class="stars">★ {{ product()?.averageRating | number:'1.1-1' }}</span>
            <span class="count">({{ product()?.reviewCount }} opinii)</span>
          </div>

          <div class="price-box">
            <div class="price">{{ product()?.price | currency:'PLN':'symbol':'1.2-2' }}</div>
            <div class="availability">
              <span class="dot"></span> Dostępny w magazynie
            </div>
          </div>

          <div class="actions">
            <div class="quantity-input">
              <button (click)="changeQuantity(-1)">-</button>
              <input type="number" [(ngModel)]="quantity" readonly>
              <button (click)="changeQuantity(1)">+</button>
            </div>
            <button class="btn btn-primary btn-lg btn-add">Dodaj do koszyka</button>
          </div>

          <div class="short-description">
            <h3>Opis produktu</h3>
            <p>{{ product()?.description }}</p>
          </div>
        </div>
      </div>

      <div class="detailed-info">
        <div class="tabs">
          <button class="tab-btn active">Specyfikacja</button>
          <button class="tab-btn">Opinie</button>
        </div>

        <div class="tab-content">
          <table class="specs-table">
            <tr *ngFor="let attr of getAttributes()">
              <td class="label">{{ attr.key }}</td>
              <td class="value">{{ attr.values.join(', ') }}</td>
            </tr>
          </table>
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
    .price { font-size: 36px; font-weight: 700; color: var(--primary-light); margin-bottom: 8px; }
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

    @media (max-width: 992px) {
      .main-layout { grid-template-columns: 1fr; gap: 40px; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<ProductDetail | null>(null);
  isLoading = signal(true);
  selectedImage = signal<string | null>(null);
  quantity = 1;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe(p => {
        this.product.set(p);
        this.isLoading.set(false);
      });
    }
  }

  getAttributes() {
    const attrs = this.product()?.attributes || {};
    return Object.keys(attrs).map(key => ({ key, values: attrs[key] }));
  }

  changeQuantity(delta: number) {
    this.quantity = Math.max(1, this.quantity + delta);
  }
}
