import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-sidebar">

      <div class="sidebar-header">
        <span class="sidebar-title">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A1 1 0 0 0 18.95 4H5.04a1 1 0 0 0-.79 1.61z" fill="currentColor"/></svg>
          Filtry
        </span>
        <span class="active-badge" *ngIf="totalActiveCount > 0">{{ totalActiveCount }}</span>
      </div>

      <!-- Price range -->
      <div class="filter-section">
        <button class="section-header" (click)="toggleSection('price')" type="button">
          <span class="section-title">Zakres ceny</span>
          <svg class="chevron" [class.open]="!collapsed.price" viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
        <div class="section-content" [class.collapsed]="collapsed.price">
          <div class="price-inputs">
            <div class="price-field">
              <label>Od</label>
              <div class="price-input-wrap">
                <input type="number" [(ngModel)]="minPrice" placeholder="0" min="0" (change)="emitFilters()">
                <span class="currency">zł</span>
              </div>
            </div>
            <div class="price-sep">—</div>
            <div class="price-field">
              <label>Do</label>
              <div class="price-input-wrap">
                <input type="number" [(ngModel)]="maxPrice" placeholder="∞" min="0" (change)="emitFilters()">
                <span class="currency">zł</span>
              </div>
            </div>
          </div>
          <div class="quick-price-buttons">
            <button class="quick-btn" (click)="setQuickPrice(0, 500)" type="button">do 500 zł</button>
            <button class="quick-btn" (click)="setQuickPrice(500, 2000)" type="button">500–2000 zł</button>
            <button class="quick-btn" (click)="setQuickPrice(2000, undefined)" type="button">powyżej 2000 zł</button>
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="filter-section">
        <button class="section-header" (click)="toggleSection('rating')" type="button">
          <span class="section-title">Minimalna ocena</span>
          <svg class="chevron" [class.open]="!collapsed.rating" viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
        <div class="section-content" [class.collapsed]="collapsed.rating">
          <div class="rating-options">
            <button
              *ngFor="let r of ratingOptions"
              class="rating-btn"
              [class.active]="selectedRating === r"
              (click)="setRating(r)"
              type="button"
            >
              <div class="stars-row">
                <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= r">★</span>
              </div>
              <span class="rating-label">i wyżej</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Brands -->
      <div class="filter-section">
        <button class="section-header" (click)="toggleSection('brands')" type="button">
          <span class="section-title">Marka</span>
          <span class="section-badge" *ngIf="selectedBrands.length">{{ selectedBrands.length }}</span>
          <svg class="chevron" [class.open]="!collapsed.brands" viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
        <div class="section-content" [class.collapsed]="collapsed.brands">
          <label class="check-label" *ngFor="let brand of brands">
            <input type="checkbox" [checked]="selectedBrands.includes(brand)" (change)="toggleBrand(brand)">
            <span class="checkmark"></span>
            <span class="check-text">{{ brand }}</span>
          </label>
        </div>
      </div>

      <!-- Availability -->
      <div class="filter-section">
        <button class="section-header" (click)="toggleSection('avail')" type="button">
          <span class="section-title">Dostępność</span>
          <svg class="chevron" [class.open]="!collapsed.avail" viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
        <div class="section-content" [class.collapsed]="collapsed.avail">
          <label class="check-label">
            <input type="checkbox" [(ngModel)]="inStock" (change)="emitFilters()">
            <span class="checkmark"></span>
            <span class="check-text">Tylko dostępne w magazynie</span>
          </label>
          <label class="check-label">
            <input type="checkbox" [(ngModel)]="fastShipping" (change)="emitFilters()">
            <span class="checkmark"></span>
            <span class="check-text">Szybka dostawa (24h)</span>
          </label>
        </div>
      </div>

      <button class="reset-btn" (click)="resetFilters()" [disabled]="totalActiveCount === 0" type="button">
        <svg viewBox="0 0 24 24" width="15" height="15"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/></svg>
        Wyczyść filtry
        <span *ngIf="totalActiveCount > 0">({{ totalActiveCount }})</span>
      </button>
    </div>
  `,

})
export class FilterSidebarComponent implements OnChanges {
  @Input() resetKey: number = 0;
  @Output() filterChange = new EventEmitter<any>();
  @Output() filterCount = new EventEmitter<number>();

  minPrice?: number;
  maxPrice?: number;
  selectedRating?: number;
  selectedBrands: string[] = [];
  inStock = false;
  fastShipping = false;
  totalActiveCount = 0;

  readonly brands = ['Apple', 'Samsung', 'Lenovo', 'ASUS', 'HP', 'Dell', 'Acer', 'Sony', 'LG', 'Microsoft', 'Corsair', 'Logitech'];
  readonly ratingOptions = [4, 3, 2, 1];

  collapsed = { price: false, rating: false, brands: true, avail: true };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetKey'] && !changes['resetKey'].firstChange) {
      this.resetFilters();
    }
  }

  toggleSection(section: keyof typeof this.collapsed) {
    this.collapsed[section] = !this.collapsed[section];
  }

  toggleBrand(brand: string) {
    const idx = this.selectedBrands.indexOf(brand);
    if (idx > -1) this.selectedBrands.splice(idx, 1);
    else this.selectedBrands.push(brand);
    this.emitFilters();
  }

  setRating(rating: number) {
    this.selectedRating = this.selectedRating === rating ? undefined : rating;
    this.emitFilters();
  }

  setQuickPrice(min: number, max: number | undefined) {
    this.minPrice = min || undefined;
    this.maxPrice = max;
    this.collapsed.price = false;
    this.emitFilters();
  }

  emitFilters() {
    let count = 0;
    if (this.minPrice || this.maxPrice) count++;
    if (this.selectedRating) count++;
    if (this.selectedBrands.length) count += this.selectedBrands.length;
    if (this.inStock) count++;
    if (this.fastShipping) count++;

    this.totalActiveCount = count;
    this.filterCount.emit(count);

    this.filterChange.emit({
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      minRating: this.selectedRating,
      brands: this.selectedBrands.length ? [...this.selectedBrands] : undefined,
      inStock: this.inStock || undefined,
      fastShipping: this.fastShipping || undefined
    });
  }

  resetFilters() {
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.selectedRating = undefined;
    this.selectedBrands = [];
    this.inStock = false;
    this.fastShipping = false;
    this.totalActiveCount = 0;
    this.filterCount.emit(0);
    this.filterChange.emit({});
  }
}
