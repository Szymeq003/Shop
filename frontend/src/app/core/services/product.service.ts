import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductDetail, ProductSearchCriteria, PaginatedResponse } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly API_BASE = 'http://localhost:8080/api';
  private apiUrl = `${this.API_BASE}/products`;
  private categoryUrl = `${this.API_BASE}/categories`;

  getProducts(criteria: ProductSearchCriteria): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();
    
    Object.keys(criteria).forEach(key => {
      const value = criteria[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params = params.append(key, v));
        } else if (typeof value === 'object') {
          Object.keys(value).forEach(subKey => {
            params = params.append(subKey, value[subKey]);
          });
        } else {
          params = params.set(key, value);
        }
      }
    });

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }
}
