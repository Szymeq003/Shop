import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
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
  template: `
    <div class="products-page">
      <div class="container">

        <!-- ── Page Header ── -->
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

        <!-- ── Category Navigation Bar ── -->
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

          <!-- Subcategory row -->
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

        <!-- ── Active filter chips ── -->
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

        <!-- ── Main layout ── -->
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
            <!-- Skeleton -->
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

            <!-- Empty -->
            <div *ngIf="!isLoading() && products().length === 0" class="empty-state">
              <div class="empty-icon">🔍</div>
              <h3>Brak wyników</h3>
              <p>Nie znaleźliśmy produktów spełniających Twoje kryteria.</p>
              <button class="btn btn-secondary" (click)="clearAllFilters()" style="margin-top:20px" type="button">
                Wyczyść filtry i pokaż wszystkie
              </button>
            </div>

            <!-- Grid / List -->
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

            <!-- Pagination -->
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
  styles: [`
    .products-page {
      min-height: 100vh;
      padding: 36px 0 80px;
      background: radial-gradient(ellipse at 20% 0%, rgba(108,99,255,0.07) 0%, transparent 60%);
    }

    /* ── Header ── */
    .page-header { margin-bottom: 24px; }
    .header-top { margin-bottom: 18px; }

    .page-title {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--text) 60%, var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 6px;
    }

    .results-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .results-count { font-weight: 700; color: var(--primary-light); font-size: 15px; }

    .filter-indicator {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--primary-light);
      background: rgba(108,99,255,0.12);
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
    }

    /* ── Toolbar ── */
    .toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 200px;
      max-width: 440px;
    }

    .search-icon {
      position: absolute;
      left: 13px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 11px 40px 11px 40px;
      color: var(--text);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.25s;
    }

    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
      background: rgba(255,255,255,0.07);
    }

    .search-input::placeholder { color: var(--text-muted); }

    .search-clear {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.1);
      border: none;
      color: var(--text-muted);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .search-clear:hover { background: rgba(255,255,255,0.18); color: var(--text); }

    .sort-wrapper { position: relative; flex-shrink: 0; }

    .sort-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .sort-select {
      appearance: none;
      -webkit-appearance: none;
      background: var(--card);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239090b0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 11px 36px 11px 36px;
      color: var(--text);
      font-size: 14px;
      font-family: inherit;
      min-width: 195px;
      outline: none;
      cursor: pointer;
      transition: all 0.25s;
    }
    .sort-select:focus, .sort-select:hover { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(108,99,255,0.1); }
    .sort-select option { background: #16213e; color: var(--text); }

    /* View toggle */
    .view-toggle { display: flex; background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; flex-shrink: 0; }
    .view-btn { background: none; border: none; color: var(--text-muted); width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .view-btn:hover { color: var(--text); background: rgba(255,255,255,0.05); }
    .view-btn.active { color: var(--primary-light); background: rgba(108,99,255,0.15); }

    /* Mobile filter btn */
    .mobile-filter-btn {
      display: none;
      align-items: center;
      gap: 8px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 16px;
      color: var(--text);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      position: relative;
    }
    .mobile-filter-btn:hover { border-color: var(--primary); }

    .filter-count-badge {
      background: var(--primary);
      color: white;
      font-size: 10px;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -5px;
      right: -5px;
    }

    /* ══ Category Navigation ══ */
    .category-nav {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .cat-main-row {
      display: flex;
      align-items: center;
      gap: 2px;
      overflow-x: auto;
      scrollbar-width: none;
      padding: 8px 10px;
    }
    .cat-main-row::-webkit-scrollbar { display: none; }

    .cat-btn-wrap { flex-shrink: 0; }

    .cat-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: none;
      border: 1px solid transparent;
      border-radius: 100px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .cat-btn:hover {
      background: rgba(108,99,255,0.1);
      border-color: rgba(108,99,255,0.2);
      color: var(--primary-light);
    }

    .cat-btn.active {
      background: rgba(108,99,255,0.15);
      border-color: rgba(108,99,255,0.35);
      color: var(--primary-light);
      font-weight: 600;
    }

    .cat-chevron {
      color: var(--text-muted);
      transition: transform 0.2s;
      opacity: 0.7;
    }

    .cat-btn-wrap:hover .cat-chevron { transform: rotate(180deg); color: var(--primary-light); }

    /* Subcategory row */
    .cat-sub-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px 10px;
      border-top: 1px solid var(--border);
      background: rgba(108,99,255,0.04);
      overflow-x: auto;
      scrollbar-width: none;
      animation: subRowIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .cat-sub-row::-webkit-scrollbar { display: none; }

    @keyframes subRowIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .sub-row-label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      white-space: nowrap;
      flex-shrink: 0;
      padding-right: 4px;
      border-right: 1px solid var(--border);
      margin-right: 4px;
    }

    .cat-sub-btn {
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 100px;
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .cat-sub-btn:hover {
      background: rgba(108,99,255,0.15);
      border-color: rgba(108,99,255,0.35);
      color: var(--primary-light);
    }

    .cat-sub-btn.active {
      background: rgba(108,99,255,0.18);
      border-color: var(--primary);
      color: var(--primary-light);
      font-weight: 600;
    }

    /* ── Active filter chips ── */
    .active-chips-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
      padding: 10px 14px;
      background: rgba(108,99,255,0.05);
      border: 1px solid rgba(108,99,255,0.12);
      border-radius: 14px;
      animation: fadeSlideIn 0.25s ease;
    }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(108,99,255,0.15);
      border: 1px solid rgba(108,99,255,0.3);
      color: var(--primary-light);
      font-size: 12px;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 100px;
    }

    .chip-x {
      background: none;
      border: none;
      color: rgba(139,133,255,0.7);
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 0;
      transition: color 0.2s;
      display: flex;
      align-items: center;
    }
    .chip-x:hover { color: #ef4444; }

    .chip-clear {
      background: rgba(239,68,68,0.1);
      border-color: rgba(239,68,68,0.2);
      color: #ef4444;
      cursor: pointer;
      font-family: inherit;
    }
    .chip-clear:hover { background: rgba(239,68,68,0.2); }

    /* ── Layout ── */
    .layout { display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start; }
    .sidebar { position: relative; }

    /* ── Skeleton ── */
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }

    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%);
      background-size: 800px 100%;
      animation: shimmer 1.6s infinite linear;
    }

    .skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .skeleton-list .skeleton-card { display: flex; height: 120px; }
    .skeleton-list .sk-img { width: 120px !important; height: 100% !important; flex-shrink: 0; border-radius: 12px 0 0 12px !important; }

    .skeleton-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
    .sk-img { width: 100%; padding-top: 75%; border-radius: 0; }
    .sk-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
    .sk-line { height: 12px; border-radius: 6px; }
    .sk-short { width: 45%; }
    .sk-medium { width: 70%; }
    .sk-price { height: 18px; width: 55%; border-radius: 6px; margin-top: 4px; }

    /* ── Empty state ── */
    .empty-state { text-align: center; padding: 80px 24px; color: var(--text-muted); }
    .empty-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.4; }
    .empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .empty-state p { font-size: 14px; line-height: 1.7; }

    /* ── Product Grid ── */
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 18px; }
    .product-grid.list-view { grid-template-columns: 1fr; gap: 12px; }

    /* ── Pagination ── */
    .pagination { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 48px; flex-wrap: wrap; }

    .page-btn {
      min-width: 38px;
      height: 38px;
      padding: 0 10px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-family: inherit;
    }

    .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary-light); background: rgba(108,99,255,0.08); }
    .page-btn.active { background: var(--primary); border-color: var(--primary); color: white; font-weight: 700; box-shadow: 0 4px 12px rgba(108,99,255,0.4); }
    .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .page-ellipsis { color: var(--text-muted); font-size: 16px; padding: 0 4px; }
    .page-info { margin-left: 12px; font-size: 12px; color: var(--text-muted); }

    /* ── Mobile sidebar drawer ── */
    .sidebar-backdrop { display: none; }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .layout { grid-template-columns: 230px 1fr; gap: 18px; }
    }

    @media (max-width: 860px) {
      .mobile-filter-btn { display: flex; }
      .layout { grid-template-columns: 1fr; }
      .sidebar {
        display: none;
        position: fixed;
        inset: 0 0 0 auto;
        width: 300px;
        z-index: 500;
        overflow-y: auto;
        box-shadow: -8px 0 40px rgba(0,0,0,0.5);
      }
      .sidebar.mobile-open { display: block; animation: slideInRight 0.3s ease; }
      @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }

      .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 499;
        backdrop-filter: blur(3px);
      }

      .mobile-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: var(--surface-2);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .mobile-sidebar-header span { font-size: 15px; font-weight: 700; color: var(--text); }
      .mobile-sidebar-header button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; display: flex; transition: color 0.2s; }
      .mobile-sidebar-header button:hover { color: var(--text); }

      .skeleton-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
      .search-wrapper { max-width: 100%; }
      .toolbar { gap: 8px; }
    }

    @media (max-width: 560px) {
      .page-title { font-size: 24px; }
      .sort-select { min-width: unset; }
      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    }
  `]
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

  /* ── Category nav ── */
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

  /* ── Filters ── */
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
