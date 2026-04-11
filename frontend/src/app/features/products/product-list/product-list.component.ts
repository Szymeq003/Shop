import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductSearchCriteria } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, FilterSidebarComponent],
  template: `
    <div class="product-browsing-page container">
      <div class="page-header">
        <h1 class="page-title">Wszystkie produkty</h1>
        <div class="search-sort-bar">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" placeholder="Szukaj produktów..." [(ngModel)]="searchQuery" (keyup.enter)="onSearch()">
          </div>
          
          <select class="sort-select" [(ngModel)]="sortOrder" (change)="onSortChange()">
            <option value="id,desc">Najnowsze</option>
            <option value="price,asc">Cena: od najniższej</option>
            <option value="price,desc">Cena: od najwyższej</option>
            <option value="popularity,desc">Popularność</option>
          </select>
        </div>
      </div>

      <div class="layout">
        <aside class="sidebar">
          <app-filter-sidebar [categories]="categories()" (filterChange)="onFilterChange($event)"></app-filter-sidebar>
        </aside>

        <main class="content">
          <div *ngIf="isLoading()" class="loading-state">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!isLoading() && products().length === 0" class="empty-state">
            <div class="icon">🔍</div>
            <h3>Brak produktów</h3>
            <p>Nie znaleźliśmy produktów spełniających Twoje kryteria.</p>
          </div>

          <div *ngIf="!isLoading()" class="product-grid">
            <app-product-card *ngFor="let p of products()" [product]="p"></app-product-card>
          </div>

          <div *ngIf="!isLoading() && totalPages() > 1" class="pagination">
            <button [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">Poprzednia</button>
            <span>Strona {{ currentPage() + 1 }} z {{ totalPages() }}</span>
            <button [disabled]="currentPage() === totalPages() - 1" (click)="goToPage(currentPage() + 1)">Następna</button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .product-browsing-page {
      padding-top: 40px;
      padding-bottom: 80px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
      gap: 20px;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 0;
    }

    .search-sort-bar {
      display: flex;
      gap: 16px;
      flex-grow: 1;
      justify-content: flex-end;
      max-width: 600px;
    }

    .search-box {
      position: relative;
      flex-grow: 1;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      fill: currentColor;
    }

    .search-box input {
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 12px 12px 40px;
      color: var(--text);
      outline: none;
      transition: all 0.3s;
    }

    .search-box input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.1);
    }

    .sort-select {
      appearance: none;
      -webkit-appearance: none;
      background: var(--card);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 44px 12px 16px;
      color: var(--text);
      font-size: 14px;
      font-weight: 500;
      min-width: 200px;
      outline: none;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sort-select:hover {
      border-color: var(--primary-light);
      background-color: rgba(255, 255, 255, 0.05);
    }

    .sort-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.15);
      background-color: var(--card);
    }

    /* Option styling (limited support in browsers, but good for some) */
    .sort-select option {
      background: #1e293b;
      color: white;
      padding: 12px;
    }

    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 40px;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
    }

    .loading-state, .empty-state {
      padding: 100px 0;
      text-align: center;
    }

    .pagination {
      margin-top: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
    }

    .pagination button {
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination button:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary-light);
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 992px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { display: none; } /* On mobile filters could be in a modal */
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  
  searchQuery = '';
  sortOrder = 'id,desc';
  currentFilters: any = {};

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  loadProducts() {
    this.isLoading.set(true);
    const criteria: ProductSearchCriteria = {
      ...this.currentFilters,
      search: this.searchQuery || undefined,
      page: this.currentPage(),
      sort: this.sortOrder
    };

    this.productService.getProducts(criteria).subscribe(response => {
      this.products.set(response.content);
      this.totalPages.set(response.totalPages);
      this.isLoading.set(false);
      window.scrollTo(0, 0);
    });
  }

  onFilterChange(filters: any) {
    this.currentFilters = filters;
    this.currentPage.set(0);
    this.loadProducts();
  }

  onSearch() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  onSortChange() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }
}
