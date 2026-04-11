import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-sidebar">
      <div class="sidebar-search">
        <input type="text" placeholder="Szukaj w wynikach..." [(ngModel)]="localSearch" (input)="emitFilters()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div class="filter-section">
        <h3 (click)="toggleSection('categories')">Kategorie <span>{{ collapsed.categories ? '+' : '−' }}</span></h3>
        <ul class="category-list" [class.collapsed]="collapsed.categories">
          <li *ngFor="let cat of categories">
            <span class="cat-name" (click)="selectCategory(cat.id)" [class.active]="selectedCategoryId === cat.id">
              {{ cat.name }}
            </span>
            <ul *ngIf="cat.children && cat.children.length > 0" class="sub-categories">
              <li *ngFor="let sub of cat.children" (click)="selectCategory(sub.id)" [class.active]="selectedCategoryId === sub.id">
                {{ sub.name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="filter-section">
        <h3>Cena</h3>
        <div class="price-range">
          <div class="inputs">
            <input type="number" [(ngModel)]="minPrice" placeholder="od" (change)="emitFilters()">
            <span>-</span>
            <input type="number" [(ngModel)]="maxPrice" placeholder="do" (change)="emitFilters()">
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h3>Marka</h3>
        <div class="brand-list">
          <label class="checkbox-container" *ngFor="let brand of brands">
            {{ brand }}
            <input type="checkbox" (change)="toggleBrand(brand)">
            <span class="checkmark"></span>
          </label>
        </div>
      </div>

      <div class="filter-section">
        <h3>Minimalna ocena</h3>
        <div class="rating-filter">
          <div class="rating-option" *ngFor="let r of [4,3,2]" (click)="setRating(r)" [class.active]="selectedRating === r">
            <div class="stars">
              <span *ngFor="let s of [1,2,3,4,5]" [class.filled]="s <= r">★</span>
            </div>
            <span class="label">i więcej</span>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h3>Dostawa i dostępność</h3>
        <label class="checkbox-container">
          W magazynie
          <input type="checkbox" [(ngModel)]="inStock" (change)="emitFilters()">
          <span class="checkmark"></span>
        </label>
        <label class="checkbox-container">
          Szybka dostawa (24h)
          <input type="checkbox" [(ngModel)]="fastShipping" (change)="emitFilters()">
          <span class="checkmark"></span>
        </label>
      </div>

      <button class="btn btn-secondary btn-full reset-btn" (click)="resetFilters()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        Wyczyść wszystko
      </button>
    </div>
  `,
  styles: [`
    .filter-sidebar {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .sidebar-search {
      position: relative;
    }

    .sidebar-search input {
      width: 100%;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 12px 10px 36px;
      color: var(--text);
      font-size: 13px;
    }

    .sidebar-search svg {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    .filter-section h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
    }

    .category-list.collapsed { display: none; }

    .category-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cat-name, .sub-categories li {
      font-size: 13px;
      color: var(--text-muted);
      padding: 4px 0;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cat-name:hover, .sub-categories li:hover, .active {
      color: var(--primary-light);
      padding-left: 4px;
    }

    .sub-categories {
      margin-left: 14px;
      border-left: 1px solid var(--border);
      padding-left: 12px;
      margin-top: 4px;
    }

    .price-range .inputs { display: flex; align-items: center; gap: 8px; }
    .price-range input {
      width: 100%;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      padding: 10px;
      font-size: 13px;
    }

    .brand-list { display: flex; flex-direction: column; gap: 10px; }

    .rating-filter { display: flex; flex-direction: column; gap: 8px; }
    .rating-option {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .rating-option:hover { background: rgba(255,255,255,0.05); }
    .rating-option.active { background: rgba(108, 99, 255, 0.1); }
    .stars { color: #4b5563; font-size: 16px; }
    .stars .filled { color: #f59e0b; }
    .rating-option .label { font-size: 12px; color: var(--text-muted); }

    .checkbox-container {
      display: block;
      position: relative;
      padding-left: 28px;
      cursor: pointer;
      font-size: 13px;
      color: var(--text-muted);
      transition: color 0.2s;
    }
    .checkbox-container:hover { color: var(--text); }
    .checkbox-container input { position: absolute; opacity: 0; }
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 18px;
      width: 18px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 5px;
    }
    .checkbox-container input:checked ~ .checkmark {
      background-color: var(--primary);
      border-color: var(--primary);
    }
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .checkbox-container input:checked ~ .checkmark:after { display: block; }

    .reset-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 10px;
      border-radius: 12px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
    }
    .reset-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }
  `]
})
export class FilterSidebarComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId?: number;
  @Output() filterChange = new EventEmitter<any>();

  minPrice?: number;
  maxPrice?: number;
  localSearch = '';
  selectedRating?: number;
  selectedBrands: string[] = [];
  inStock = true;
  fastShipping = false;

  brands = ['Apple', 'Samsung', 'Lenovo', 'ASUS', 'Sony', 'Microsoft'];
  collapsed = { categories: false };

  toggleSection(section: keyof typeof this.collapsed) {
    this.collapsed[section] = !this.collapsed[section];
  }

  selectCategory(id: number) {
    this.selectedCategoryId = id;
    this.emitFilters();
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

  emitFilters() {
    this.filterChange.emit({
      categoryId: this.selectedCategoryId,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      search: this.localSearch || undefined,
      rating: this.selectedRating,
      brands: this.selectedBrands.length ? this.selectedBrands : undefined,
      inStock: this.inStock,
      fastShipping: this.fastShipping
    });
  }

  resetFilters() {
    this.selectedCategoryId = undefined;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.localSearch = '';
    this.selectedRating = undefined;
    this.selectedBrands = [];
    this.inStock = true;
    this.fastShipping = false;
    this.emitFilters();
  }
}

