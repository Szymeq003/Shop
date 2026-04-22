import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductSearchCriteria } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, FilterSidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="products-page">
      <div class="container">
        <div class="page-header">
          <div class="header-top">
            <h1 class="page-title">Katalog produktów</h1>
            <p class="results-meta" *ngIf="!isLoading()">
              <span class="results-count">{{ totalElements() }}</span> produktów
              <span class="filter-indicator" *ngIf="hasActiveFilters()">
                <svg viewBox="0 0 24 24" width="12" height="12"><path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A1 1 0 0 0 18.95 4H5.04a1 1 0 0 0-.79 1.61z" fill="currentColor"/></svg>
                filtry aktywne
              </span>
            </p>
          </div>

          <div class="toolbar">
            <div class="search-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" width="17" height="17">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
              </svg>
              <input
                id="product-search"
                type="text"
                class="search-input"
                placeholder="Szukaj produktów..."
                [(ngModel)]="searchQuery"
                (input)="onSearchInput()"
                (keyup.enter)="onSearch()"
              >
              <button *ngIf="searchQuery" class="search-clear" (click)="clearSearch()" type="button">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
              </button>
            </div>

            <div class="sort-wrapper">
              <svg class="sort-icon" viewBox="0 0 24 24" width="15" height="15">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="currentColor"/>
              </svg>
              <select id="product-sort" class="sort-select" [(ngModel)]="sortOrder" (change)="onSortChange()">
                <option value="id,desc">Najnowsze</option>
                <option value="price,asc">Cena: rosnąco</option>
                <option value="price,desc">Cena: malejąco</option>
                <option value="averageRating,desc">Najwyżej oceniane</option>
                <option value="reviewCount,desc">Najpopularniejsze</option>
              </select>
            </div>

            <div class="view-toggle">
              <button id="view-grid" class="view-btn" [class.active]="viewMode === 'grid'" (click)="setViewMode('grid')" type="button" title="Siatka">
                <svg viewBox="0 0 24 24" width="17" height="17"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" fill="currentColor"/></svg>
              </button>
              <button id="view-list" class="view-btn" [class.active]="viewMode === 'list'" (click)="setViewMode('list')" type="button" title="Lista">
                <svg viewBox="0 0 24 24" width="17" height="17"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/></svg>
              </button>
            </div>

            <button id="toggle-mobile-filters" class="mobile-filter-btn" (click)="showMobileFilters = !showMobileFilters" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A1 1 0 0 0 18.95 4H5.04a1 1 0 0 0-.79 1.61z" fill="currentColor"/></svg>
              Filtry
              <span class="filter-count-badge" *ngIf="activeFilterCount > 0">{{ activeFilterCount }}</span>
            </button>
          </div>
        </div>

        <div class="category-nav" *ngIf="categories().length > 0">
          <div class="cat-main-row">
            <button
              class="cat-btn"
              [class.active]="!currentFilters.categoryId"
              (click)="selectCategory(undefined)"
              type="button"
            >Wszystkie</button>

            <div
              class="cat-btn-wrap"
              *ngFor="let cat of categories()"
              (mouseenter)="setHovered(cat.id)"
              (mouseleave)="clearHovered()"
            >
              <button
                class="cat-btn"
                [class.active]="currentFilters.categoryId === cat.id || isChildActive(cat)"
                (click)="selectCategory(cat.id)"
                type="button"
              >
                {{ cat.name }}
                <svg *ngIf="cat.children && cat.children.length > 0" class="cat-chevron" viewBox="0 0 24 24" width="13" height="13">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>

          <div
            class="cat-sub-row"
            *ngIf="hoveredMainCategory && hoveredMainCategory.children && hoveredMainCategory.children.length > 0"
            (mouseenter)="keepHovered()"
            (mouseleave)="clearHovered()"
          >
            <span class="sub-row-label">
              <svg viewBox="0 0 24 24" width="12" height="12"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
              {{ hoveredMainCategory.name }}
            </span>
            <button
              *ngFor="let sub of hoveredMainCategory.children"
              class="cat-sub-btn"
              [class.active]="currentFilters.categoryId === sub.id"
              (click)="selectCategory(sub.id)"
              type="button"
            >{{ sub.name }}</button>
          </div>
        </div>

        <div class="active-chips-bar" *ngIf="hasActiveFilters()">
          <span class="chip" *ngIf="searchQuery">
            <svg viewBox="0 0 24 24" width="11" height="11"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>
            "{{ searchQuery }}"
            <button class="chip-x" (click)="clearSearch()" type="button">×</button>
          </span>
          <span class="chip" *ngIf="currentFilters.categoryId">
            {{ getCategoryName(currentFilters.categoryId) }}
            <button class="chip-x" (click)="selectCategory(undefined)" type="button">×</button>
          </span>
          <span class="chip" *ngIf="currentFilters.minPrice || currentFilters.maxPrice">
            Cena: {{ currentFilters.minPrice || 0 }} – {{ currentFilters.maxPrice ? currentFilters.maxPrice + ' zł' : '∞' }}
            <button class="chip-x" (click)="clearPriceFilter()" type="button">×</button>
          </span>
          <span class="chip" *ngIf="currentFilters.minRating">
            Min. ★ {{ currentFilters.minRating }}
            <button class="chip-x" (click)="clearFilter('minRating')" type="button">×</button>
          </span>
          <span class="chip" *ngIf="currentFilters.inStock">
            W magazynie <button class="chip-x" (click)="clearFilter('inStock')" type="button">×</button>
          </span>
          <span class="chip" *ngIf="currentFilters.brands && currentFilters.brands.length">
            {{ currentFilters.brands.join(', ') }}
            <button class="chip-x" (click)="clearFilter('brands')" type="button">×</button>
          </span>
          <button class="chip chip-clear" (click)="clearAllFilters()" type="button">
            Wyczyść wszystko
          </button>
        </div>

        <div class="layout">
          <div class="sidebar-backdrop" *ngIf="showMobileFilters" (click)="showMobileFilters = false"></div>

          <aside class="sidebar" [class.mobile-open]="showMobileFilters">
            <div class="mobile-sidebar-header" *ngIf="showMobileFilters">
              <span>Filtry</span>
              <button (click)="showMobileFilters = false" type="button">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
              </button>
            </div>
            <app-filter-sidebar
              [resetKey]="filterResetKey"
              (filterChange)="onFilterChange($event)"
              (filterCount)="onFilterCountChange($event)"
            ></app-filter-sidebar>
          </aside>

          <main class="content">
            <div *ngIf="isLoading()" class="skeleton-grid" [class.skeleton-list]="viewMode === 'list'">
              <div class="skeleton-card" *ngFor="let i of skeletonItems">
                <div class="sk-img shimmer"></div>
                <div class="sk-body">
                  <div class="sk-line sk-short shimmer"></div>
                  <div class="sk-line shimmer"></div>
                  <div class="sk-line sk-medium shimmer"></div>
                  <div class="sk-price shimmer"></div>
                </div>
              </div>
            </div>

            <div *ngIf="!isLoading() && products().length === 0" class="empty-state">
              <div class="empty-icon">🔍</div>
              <h3>Brak wyników</h3>
              <p>Nie znaleźliśmy produktów spełniających Twoje kryteria.</p>
              <button class="btn btn-secondary" (click)="clearAllFilters()" style="margin-top:20px" type="button">
                Wyczyść filtry i pokaż wszystkie
              </button>
            </div>

            <div
              *ngIf="!isLoading() && products().length > 0"
              class="product-grid"
              [class.list-view]="viewMode === 'list'"
            >
              <app-product-card
                *ngFor="let p of products(); trackBy: trackByProductId"
                [product]="p"
                [viewMode]="viewMode"
                [isInWishlist]="isProductInWishlist(p.id)"
              ></app-product-card>
            </div>

            <div *ngIf="!isLoading() && totalPages() > 1" class="pagination">
              <button class="page-btn nav-btn" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)" type="button">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
              </button>

              <ng-container *ngFor="let page of pageNumbers()">
                <button *ngIf="page !== -1" class="page-btn" [class.active]="page === currentPage()" (click)="goToPage(page)" type="button">{{ page + 1 }}</button>
                <span *ngIf="page === -1" class="page-ellipsis">…</span>
              </ng-container>

              <button class="page-btn nav-btn" [disabled]="currentPage() === totalPages() - 1" (click)="goToPage(currentPage() + 1)" type="button">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
              </button>

              <span class="page-info">{{ currentPage() + 1 }} / {{ totalPages() }}</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  searchQuery = '';
  sortOrder = 'id,desc';
  viewMode: 'grid' | 'list' = 'grid';
  showMobileFilters = false;
  currentFilters: any = {};
  activeFilterCount = 0;
  filterResetKey = 0;

  hoveredCategoryId: number | null = null;
  private hoverTimer: any;

  readonly skeletonItems = new Array(8).fill(null);

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages: number[] = [0];
    if (current > 2) pages.push(-1);
    for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) pages.push(i);
    if (current < total - 3) pages.push(-1);
    pages.push(total - 1);
    return pages;
  });

  hasActiveFilters = computed(() => {
    return !!(this.searchQuery || this.activeFilterCount > 0 || this.currentFilters.categoryId);
  });

  get hoveredMainCategory(): Category | undefined {
    if (!this.hoveredCategoryId) return undefined;
    return this.categories().find(c => c.id === this.hoveredCategoryId);
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();

    if (this.authService.isLoggedIn()) {
      this.wishlistService.loadWishlist();
    }
    
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    clearTimeout(this.hoverTimer);
    this.destroy$.next();
    this.destroy$.complete();
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
      this.totalElements.set(response.totalElements);
      this.isLoading.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  isProductInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  setHovered(id: number) {
    clearTimeout(this.hoverTimer);
    this.hoveredCategoryId = id;
  }

  keepHovered() {
    clearTimeout(this.hoverTimer);
  }

  clearHovered() {
    this.hoverTimer = setTimeout(() => { this.hoveredCategoryId = null; }, 200);
  }

  selectCategory(id?: number) {
    if (id === undefined) {
      const { categoryId, ...rest } = this.currentFilters;
      this.currentFilters = rest;
    } else {
      this.currentFilters = { ...this.currentFilters, categoryId: id };
    }
    this.hoveredCategoryId = null;
    this.currentPage.set(0);
    this.loadProducts();
  }

  isChildActive(cat: Category): boolean {
    return (cat.children ?? []).some(c => c.id === this.currentFilters.categoryId);
  }

  getCategoryName(id: number): string {
    for (const cat of this.categories()) {
      if (cat.id === id) return cat.name;
      const sub = (cat.children ?? []).find(c => c.id === id);
      if (sub) return sub.name;
    }
    return 'Kategoria';
  }

  onFilterChange(filters: any) {
    const categoryId = this.currentFilters.categoryId;
    this.currentFilters = { ...filters, ...(categoryId ? { categoryId } : {}) };
    this.currentPage.set(0);
    this.loadProducts();
  }

  onFilterCountChange(count: number) { this.activeFilterCount = count; }

  onSearchInput() { this.searchSubject.next(this.searchQuery); }
  onSearch() { this.currentPage.set(0); this.loadProducts(); }

  clearSearch() {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.currentPage.set(0);
    this.loadProducts();
  }

  onSortChange() { this.currentPage.set(0); this.loadProducts(); }
  setViewMode(mode: 'grid' | 'list') { this.viewMode = mode; }
  goToPage(page: number) { this.currentPage.set(page); this.loadProducts(); }

  clearFilter(key: string) {
    delete this.currentFilters[key];
    this.filterResetKey++;
    this.currentPage.set(0);
    this.loadProducts();
  }

  clearPriceFilter() {
    delete this.currentFilters['minPrice'];
    delete this.currentFilters['maxPrice'];
    this.filterResetKey++;
    this.currentPage.set(0);
    this.loadProducts();
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.currentFilters = {};
    this.activeFilterCount = 0;
    this.filterResetKey++;
    this.currentPage.set(0);
    this.loadProducts();
  }

  trackByProductId(_: number, product: Product): number { return product.id; }
}

