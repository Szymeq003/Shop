import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { UiService } from '../../../core/services/ui.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService, ProductResponse } from '../../../core/services/employee.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <div class="header-flex">
          <div>
            <h1 class="page-title">Zarządzanie Produktami</h1>
            <p class="page-subtitle">
              Znaleziono <strong>{{ totalElements() }}</strong> produktów w katalogu.
            </p>
          </div>
          <div class="header-actions">
            <a routerLink="/employee/categories" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Kategorie
            </a>
            <a routerLink="/employee/products/new" class="btn btn-primary purple-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Dodaj Produkt
            </a>
          </div>
        </div>
      </header>

      <div class="card table-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Kategoria</th>
                <th>Cena</th>
                <th>Stan</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products()">
                <td>
                  <div class="product-info">
                    <div class="product-image">
                      <img [src]="product.mainImageUrl || 'assets/placeholder.png'" [alt]="product.name">
                    </div>
                    <div class="product-details">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-sku">ID: #{{ product.id }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="category-tag">{{ product.categoryName }}</span>
                </td>
                <td>
                  <span class="price-text">{{ product.price | currency:'PLN' }}</span>
                </td>
                <td>
                  <span class="badge" 
                        [class.badge-paid]="product.totalStock > 5" 
                        [class.badge-pending]="product.totalStock > 0 && product.totalStock <= 5"
                        [class.badge-anulowane]="product.totalStock === 0">
                    {{ product.totalStock }} szt.
                  </span>
                </td>
                <td>
                  <span class="badge" [class.badge-paid]="product.status === 'AKTYWNY'" [class.badge-anulowane]="product.status === 'UKRYTY'">
                    {{ product.status === 'AKTYWNY' ? 'Aktywny' : 'Ukryty' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/employee/products/edit', product.id]" class="btn-action edit" title="Edytuj">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </a>
                    <button (click)="deleteProduct(product.id)" class="btn-action delete" title="Usuń">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Loading state -->
              <tr *ngIf="isLoading()">
                <td colspan="6">
                  <div class="loading-state">
                    <div class="spinner-purple"></div>
                    <p>Ładowanie produktów...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr *ngIf="!isLoading() && products().length === 0">
                <td colspan="6" class="empty-row">
                  <div class="empty-state">
                    <div class="icon">📦</div>
                    <p>Brak produktów w bazie. Dodaj swój pierwszy produkt!</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar" *ngIf="totalPages() > 1">
          <div class="pagination-info">
            Strona {{ currentPage() + 1 }} z {{ totalPages() }}
          </div>
          <div class="pagination-controls">
            <button class="btn-page" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">
              Poprzednia
            </button>
            <div class="page-numbers">
              <button *ngFor="let p of [].constructor(totalPages()); let i = index" 
                      class="page-num" 
                      [class.active]="i === currentPage()"
                      (click)="goToPage(i)">
                {{ i + 1 }}
              </button>
            </div>
            <button class="btn-page" [disabled]="currentPage() === totalPages() - 1" (click)="goToPage(currentPage() + 1)">
              Następna
            </button>
          </div>
        </div>
      </div>
    </div>
  `,

})
export class ProductManagementComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private uiService = inject(UiService);
  private cdr = inject(ChangeDetectorRef);
  
  products = signal<ProductResponse[]>([]);
  isLoading = signal(true);
  
  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 12;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.employeeService.getProducts(this.currentPage(), this.pageSize).subscribe({
      next: (page) => {
        this.products.set(page.content || []);
        this.totalPages.set(page.totalPages || 0);
        this.totalElements.set(page.totalElements || 0);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: number) {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      this.employeeService.deleteProduct(id).subscribe(() => {
        this.uiService.showToast('Produkt został usunięty', 'success');
        this.loadProducts();
      });
    }
  }
}
