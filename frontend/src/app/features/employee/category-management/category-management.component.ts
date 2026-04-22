import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmployeeService, CategoryResponse } from '../../../core/services/employee.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <div class="header-flex">
          <div>
            <h1 class="page-title">Zarządzanie Kategoriami</h1>
            <p class="page-subtitle">Organizuj asortyment sklepu w przejrzystą strukturę kategorii.</p>
          </div>
          <button (click)="openModal()" class="btn btn-primary purple-glow">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nowa Kategoria
          </button>
        </div>
      </header>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner-purple"></div>
          <p>Pobieranie struktury kategorii...</p>
        </div>
      } @else {
        <div class="categories-grid">
          <div class="card category-card" *ngFor="let cat of categories()">
            <div class="category-header">
              <div class="cat-title-group">
                <div class="cat-icon" [innerHTML]="getCategoryIcon(cat.name)"></div>
                <h3>{{ cat.name }}</h3>
              </div>
              <div class="actions">
                <a [routerLink]="['/products']" [queryParams]="{category: cat.id}" class="btn-action view" title="Zobacz produkty">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </a>
                <a [routerLink]="['/employee/products/new']" [queryParams]="{categoryId: cat.id}" class="btn-action add-prod" title="Dodaj produkt do tej kategorii">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </a>
                <button (click)="openModal(cat)" class="btn-action edit" title="Edytuj">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button (click)="deleteCategory(cat.id)" class="btn-action delete" title="Usuń">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                </button>
              </div>
            </div>
            <p class="cat-desc">{{ cat.description || 'Brak opisu dla tej kategorii.' }}</p>
            
            <div class="subcategories-section" *ngIf="cat.children && cat.children.length > 0">
              <h4 class="section-label">Podkategorie ({{ cat.children.length }})</h4>
              <div class="sub-list">
                <div class="sub-item" *ngFor="let child of cat.children">
                  <span class="sub-name">{{ child.name }}</span>
                  <div class="sub-actions">
                    <button (click)="openModal(child)" class="btn-icon-sub edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button (click)="deleteCategory(child.id)" class="btn-icon-sub delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <button (click)="openModal(undefined, cat.id)" class="btn-add-sub">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Dodaj podkategorię
            </button>
          </div>

          <div class="card empty-card" *ngIf="categories().length === 0">
            <div class="empty-state">
              <div class="icon-big">💜</div>
              <p>Stwórz pierwszą kategorię, aby zacząć budować strukturę sklepu.</p>
            </div>
          </div>
        </div>
      }

      <!-- Modal overlay and card -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editMode ? 'Edycja kategorii' : 'Nowa kategoria' }}</h2>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label for="cat-name">Nazwa kategorii</label>
              <input type="text" id="cat-name" name="cat-name" [(ngModel)]="currentCategory.name" placeholder="np. Komputery stacjonarne" class="form-input">
            </div>
            
            <div class="form-group">
              <label for="cat-desc">Opis (opcjonalnie)</label>
              <textarea id="cat-desc" name="cat-desc" [(ngModel)]="currentCategory.description" placeholder="Krótki opis kategorii..." rows="3" class="form-textarea"></textarea>
            </div>
            
            <div class="form-group">
              <label for="cat-parent">Kategoria nadrzędna</label>
                <select id="cat-parent" name="cat-parent" [(ngModel)]="currentCategory.parentId" class="form-select">
                  <option [ngValue]="null">Brak (Kategoria główna)</option>
                  <option *ngFor="let cat of categories()" [ngValue]="cat.id">{{ cat.name }}</option>
                </select>
            </div>
          </div>
          
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Anuluj</button>
            <button (click)="saveCategory()" class="btn btn-primary purple-glow" [disabled]="!currentCategory.name">
              {{ editMode ? 'Zapisz zmiany' : 'Utwórz kategorię' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,

})
export class CategoryManagementComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  
  categories = signal<CategoryResponse[]>([]);
  isLoading = signal(true);
  
  showModal = false;
  editMode = false;
  currentCategory: any = { name: '', description: '', parentId: null };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this.employeeService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading.set(false);
      }
    });
  }

  getCategoryIcon(name: string): SafeHtml {
    const n = name.toLowerCase();
    let svg = '';
    if (n.includes('laptop')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>';
    else if (n.includes('smartfon') || n.includes('telefon')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>';
    else if (n.includes('audio') || n.includes('słuchawki')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>';
    else if (n.includes('gaming') || n.includes('gry')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="14" y="15" width="2" height="2" rx="1"/><rect x="17" y="12" width="2" height="2" rx="1"/><path d="M12 7c-4.4 0-8 3.6-8 8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1c0-4.4-3.6-8-8-8z"/><path d="M9 2v3"/><path d="M15 2v3"/></svg>';
    else if (n.includes('office') || n.includes('biur')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="10" x="4" y="4" rx="2"/><path d="M12 14v7"/><path d="M7 21h10"/></svg>';
    else if (n.includes('podzesp') || n.includes('komponent')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 4V2"/><path d="M15 4V2"/><path d="M9 22v-2"/><path d="M15 22v-2"/><path d="M20 9h2"/><path d="M20 15h2"/><path d="M2 9h2"/><path d="M2 15h2"/></svg>';
    else if (n.includes('rtv') || n.includes('agd') || n.includes('telewizor')) svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>';
    else svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>';
    
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  openModal(cat?: CategoryResponse, parentId?: number) {
    if (cat) {
      this.editMode = true;
      this.currentCategory = { ...cat, parentId: parentId || null };
    } else {
      this.editMode = false;
      this.currentCategory = { name: '', description: '', parentId: parentId || null };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    const action = this.editMode 
      ? this.employeeService.updateCategory(this.currentCategory.id, this.currentCategory)
      : this.employeeService.saveCategory(this.currentCategory);

    action.subscribe(() => {
      this.loadCategories();
      this.closeModal();
    });
  }

  deleteCategory(id: number) {
    if (confirm('Czy na pewno chcesz usunąć tę kategorię i jej podkategorie?')) {
      this.employeeService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
