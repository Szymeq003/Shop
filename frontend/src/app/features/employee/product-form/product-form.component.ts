import { Component, OnInit, inject } from '@angular/core';
import { UiService } from '../../../core/services/ui.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService, CategoryResponse } from '../../../core/services/employee.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <h1 class="page-title">{{ isEdit ? 'Edycja Produktu' : 'Nowy Produkt' }}</h1>
        <p class="page-subtitle">Wprowadź dane produktu, dodaj zdjęcia i zdefiniuj warianty.</p>
      </header>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-layout">
          <!-- Main Section -->
          <div class="main-column">
            <div class="card form-section">
              <h3 class="section-title">Podstawowe informacje</h3>
              
              <div class="form-group">
                <label for="name">Nazwa produktu</label>
                <input type="text" id="name" formControlName="name" placeholder="np. Laptop Gamingowy X-100">
              </div>

              <div class="form-group">
                <label for="description">Opis produktu</label>
                <textarea id="description" formControlName="description" rows="6" placeholder="Opisz najważniejsze cechy produktu..."></textarea>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="price">Cena domyślna (PLN)</label>
                  <div class="input-with-icon">
                    <input type="number" id="price" formControlName="price" step="0.01">
                    <span class="input-icon">zł</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="categoryId">Kategoria</label>
                  <select id="categoryId" formControlName="categoryId" class="form-select">
                    <option [value]="null">Wybierz kategorię...</option>
                    <ng-container *ngFor="let cat of categories">
                      <option [value]="cat.id" class="parent-cat">{{ cat.name }}</option>
                      <option *ngFor="let child of cat.children" [value]="child.id" class="child-cat">-- {{ child.name }}</option>
                    </ng-container>
                  </select>
                </div>
              </div>
            </div>

            <div class="card form-section variants-section">
              <div class="section-header">
                <h3 class="section-title">Warianty produktu</h3>
                <button type="button" (click)="addVariant()" class="btn btn-secondary btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Dodaj wariant
                </button>
              </div>

              <div formArrayName="variants" class="variants-list">
                <div *ngFor="let variant of variants.controls; let i=index" [formGroupName]="i" class="variant-item card">
                  <div class="variant-header">
                    <span class="variant-number">#{{ i + 1 }}</span>
                    <button type="button" (click)="removeVariant(i)" class="btn-remove" title="Usuń wariant">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                    </button>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label [for]="'sku-' + i">SKU (Unikalny kod)</label>
                      <input type="text" [id]="'sku-' + i" formControlName="sku" placeholder="np. LPT-X100-BLK">
                    </div>
                    <div class="form-group">
                      <label [for]="'vprice-' + i">Cena wariantu</label>
                      <input type="number" [id]="'vprice-' + i" formControlName="price" step="0.01">
                    </div>
                    <div class="form-group">
                      <label [for]="'stock-' + i">Stan magazynowy</label>
                      <input type="number" [id]="'stock-' + i" formControlName="stockQuantity">
                    </div>
                  </div>

                  <!-- Nested Attributes -->
                  <div class="attributes-box">
                    <h4 class="sub-section-title">Specyfikacja wariantu</h4>
                    <div class="attributes-list">
                      <div class="attribute-row" *ngFor="let attr of getAttributes(i); let j=index">
                         <input type="text" [id]="'attr-k-' + i + '-' + j" [name]="'attr-k-' + i + '-' + j" placeholder="Cecha (np. Kolor)" [(ngModel)]="attr.key" [ngModelOptions]="{standalone: true}">
                         <input type="text" [id]="'attr-v-' + i + '-' + j" [name]="'attr-v-' + i + '-' + j" placeholder="Wartość (np. Czarny)" [(ngModel)]="attr.value" [ngModelOptions]="{standalone: true}">
                         <button type="button" (click)="removeAttribute(i, j)" class="btn-icon-sub delete">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                         </button>
                      </div>
                      <button type="button" (click)="addAttribute(i)" class="btn-add-attr">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Dodaj atrybut
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="side-column">
            <div class="card form-section">
              <h3 class="section-title">Status i Widoczność</h3>
              <div class="form-group">
                <label for="status">Status produktu</label>
                <select id="status" formControlName="status" class="form-select">
                  <option value="AKTYWNY">🟢 Aktywny</option>
                  <option value="UKRYTY">🔴 Ukryty</option>
                </select>
              </div>
            </div>

            <div class="card form-section">
              <h3 class="section-title">Galeria zdjęć</h3>
              
              <div class="upload-controls">
                <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" hidden>
                <button type="button" (click)="fileInput.click()" class="btn-upload" [disabled]="isUploadingImage">
                  <svg *ngIf="!isUploadingImage" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span *ngIf="isUploadingImage" class="spinner-sm"></span>
                  {{ isUploadingImage ? 'Wgrywanie...' : 'Wgraj zdjęcie z dysku' }}
                </button>
              </div>

              <div class="divider-text"><span>LUB</span></div>

              <div formArrayName="imageUrls" class="images-list">
                <div *ngFor="let img of imageUrls.controls; let i=index" class="image-input-group">
                  <div class="image-field">
                    <input [formControlName]="i" type="text" placeholder="URL zdjęcia">
                    <button type="button" (click)="removeImage(i)" class="btn-remove-sm" title="Usuń">&times;</button>
                  </div>
                  <div class="image-preview" *ngIf="img.value">
                    <img [src]="img.value" alt="Podgląd">
                  </div>
                </div>
              </div>

              <button type="button" (click)="addImage()" class="btn btn-secondary-outline btn-full btn-sm">
                Dodaj pole URL
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/employee/products" class="btn btn-secondary">Anuluj</button>
          <button type="submit" class="btn btn-primary purple-glow" [disabled]="productForm.invalid || isLoading">
            {{ isLoading ? 'Zapisywanie...' : (isEdit ? 'Zapisz zmiany' : 'Utwórz produkt') }}
          </button>
        </div>
      </form>
    </div>
  `,

})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private uiService = inject(UiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm: FormGroup;
  isEdit = false;
  productId?: number;
  categories: CategoryResponse[] = [];
  isLoading = false;
  isUploadingImage = false;

  // Local storage for attributes of each variant since FormArray of nested maps is complex in Reactive Forms
  variantAttributes: {key: string, value: string}[][] = [];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      status: ['AKTYWNY'],
      imageUrls: this.fb.array([]),
      variants: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEdit = true;
      this.loadProduct();
    } else {
      // Add one default image input and one variant for new product
      this.addImage();
      this.addVariant();
    }
  }

  get imageUrls() { return this.productForm.get('imageUrls') as FormArray; }
  get variants() { return this.productForm.get('variants') as FormArray; }

  loadCategories() {
    this.employeeService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadProduct() {
    this.isLoading = true;
    this.employeeService.getProductById(this.productId!).subscribe(product => {
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        status: product.status
      });

      // Fill images
      this.imageUrls.clear();
      product.imageUrls.forEach((url: string) => this.imageUrls.push(this.fb.control(url)));

      // Fill variants
      this.variants.clear();
      this.variantAttributes = [];
      product.variants.forEach((v: any) => {
        this.variants.push(this.fb.group({
          sku: [v.sku],
          price: [v.price],
          stockQuantity: [v.stockQuantity]
        }));
        
        // Map attributes from Object to Array for local storage
        const attrs = Object.entries(v.attributeValues || {}).map(([k, v]) => ({ key: k, value: v as string }));
        this.variantAttributes.push(attrs);
      });

      this.isLoading = false;
    });
  }

  addImage() { this.imageUrls.push(this.fb.control('')); }
  removeImage(index: number) { this.imageUrls.removeAt(index); }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.isUploadingImage = true;
    this.employeeService.uploadImage(file).subscribe({
      next: (response) => {
        this.imageUrls.push(this.fb.control(response.url));
        this.isUploadingImage = false;
        this.uiService.showToast('Zdjęcie wgrane pomyślnie', 'success');
        event.target.value = '';
      },
      error: () => {
        this.isUploadingImage = false;
        this.uiService.showToast('Błąd podczas wgrywania zdjęcia', 'error');
      }
    });
  }

  addVariant() {
    this.variants.push(this.fb.group({
      sku: [''],
      price: [this.productForm.value.price],
      stockQuantity: [0]
    }));
    this.variantAttributes.push([]);
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
    this.variantAttributes.splice(index, 1);
  }

  getAttributes(variantIndex: number) {
    return this.variantAttributes[variantIndex];
  }

  addAttribute(variantIndex: number) {
    this.variantAttributes[variantIndex].push({ key: '', value: '' });
  }

  removeAttribute(variantIndex: number, attrIndex: number) {
    this.variantAttributes[variantIndex].splice(attrIndex, 1);
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const formValue = this.productForm.value;
    
    // Prepare data for API
    const requestData = {
      ...formValue,
      variants: formValue.variants.map((v: any, index: number) => ({
        ...v,
        attributes: this.variantAttributes[index].reduce((acc, curr) => {
          if (curr.key && curr.value) acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>)
      }))
    };

    const action = this.isEdit 
      ? this.employeeService.updateProduct(this.productId!, requestData)
      : this.employeeService.saveProduct(requestData);

    action.subscribe({
      next: () => {
        this.uiService.showToast(this.isEdit ? 'Produkt zaktualizowany' : 'Produkt utworzony', 'success');
        this.router.navigate(['/employee/products']);
      },
      error: () => {
        this.isLoading = false;
        this.uiService.showToast('Błąd podczas zapisywania produktu', 'error');
      }
    });
  }
}
