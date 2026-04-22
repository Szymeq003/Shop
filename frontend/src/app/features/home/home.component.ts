import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../products/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-page">
      <section class="hero-v2">
        <div class="hero-bg-glow"></div>
        <div class="container hero-container">
          <div class="hero-content">
            <div class="hero-badge animate-fade-in">
              <span>Niesamowite nowości M3</span>
            </div>
            <h1 class="hero-title animate-slide-up">
              Przyszłość <br>
              <span class="gradient-text">Technologii</span>
            </h1>
            <p class="hero-subtitle animate-slide-up-delayed">
              Dostarczamy najbardziej zaawansowane rozwiązania dla twórców, graczy i entuzjastów. Odkryj moc, która nie zna granic.
            </p>
            <div class="hero-btns animate-slide-up-further">
              <a routerLink="/products" class="btn btn-primary-glow btn-xl">Eksploruj sprzęt</a>
              <a routerLink="/products" [queryParams]="{categoryId: 4}" class="btn btn-glass btn-xl">Gaming Zone</a>
            </div>
          </div>
          <div class="hero-visual animate-float">
            <div class="main-image-wrap">
              <img src="assets/images/hero_setup.png" alt="High-end Setup" class="hero-main-img">
              <div class="glass-overlay"></div>
            </div>
            <div class="float-card card-1">🚀 15% OFF</div>
            <div class="float-card card-2">🔥 Nitro Power</div>
          </div>
        </div>
      </section>

      <section class="trust-deck container">
        <div class="trust-pill">
          <span class="pill-icon">🚚</span>
          <div class="pill-text"><strong>Ekspresowa dostawa</strong> 24h</div>
        </div>
        <div class="trust-pill">
          <span class="pill-icon">🛡️</span>
          <div class="pill-text"><strong>Gwarancja Premium</strong> 24 m-ce</div>
        </div>
        <div class="trust-pill">
          <span class="pill-icon">💎</span>
          <div class="pill-text"><strong>Oryginalny sprzęt</strong> certyfikowany</div>
        </div>
        <div class="trust-pill">
          <span class="pill-icon">📞</span>
          <div class="pill-text"><strong>Support 24/7</strong> dedykowany</div>
        </div>
      </section>

      <section class="bento-section container">
        <div class="section-top">
          <h2 class="title-v2">Kategorie Jutra</h2>
          <p class="subtitle-v2">Wybierz swoją ścieżkę ewolucji.</p>
        </div>
        
        <div class="bento-grid">
          <div class="bento-item bento-large laptop-box" routerLink="/products" [queryParams]="{categoryId: 1}">
            <div class="bento-info">
              <span class="bento-label">Performance</span>
              <h3>Laptopy i Komputery</h3>
              <p>Moc obliczeniowa bez granic dla profesjonalistów.</p>
            </div>
            <img src="assets/images/hero_setup.png" class="bento-img">
          </div>

          <div class="bento-item bento-tall smartphone-box" routerLink="/products" [queryParams]="{categoryId: 2}">
             <div class="bento-info">
                <span class="bento-label">Mobile</span>
                <h3>Mobilny Świat</h3>
                <p>Smartfony i smartwatche nowej generacji.</p>
              </div>
              <img src="assets/images/phones.png" class="bento-img">
          </div>

          <div class="bento-item bento-sq hardware-box" routerLink="/products" [queryParams]="{categoryId: 3}">
              <div class="bento-info">
                <h3>Podzespoły</h3>
              </div>
              <img src="assets/images/hardware.png" class="bento-img">
          </div>

          <div class="bento-item bento-sq audio-box" routerLink="/products" [queryParams]="{categoryId: 23}">
              <div class="bento-info">
                <h3>Audio i Hi-Fi</h3>
              </div>
              <img src="assets/images/audio.png" class="bento-img">
          </div>
        </div>
      </section>

      <section class="trending-section container">
        <div class="section-top">
          <h2 class="title-v2">Gorące Nowości</h2>
          <a routerLink="/products" class="btn-more-v2">Zobacz wszystkie nowości →</a>
        </div>
        
        <div class="product-grid" *ngIf="newArrivals().length > 0">
          <app-product-card *ngFor="let p of newArrivals()" [product]="p" class="premium-card"></app-product-card>
        </div>
        
        <div *ngIf="isLoading()" class="loading-v2">
          <div class="pulse-loader"></div>
        </div>
      </section>

      <section class="feature-highlight container">
        <div class="highlight-card">
          <div class="highlight-content">
            <h3>Jesteśmy częścią Twojego sukcesu.</h3>
            <p>Zapewniamy sprzęt, który pozwala Ci tworzyć to, co wydawało się niemożliwe.</p>
            <button routerLink="/products" class="btn btn-primary-white">Zacznij Tworzyć</button>
          </div>
          <div class="highlight-visual">
             <div class="blob"></div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  newArrivals = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadNewArrivals();
  }

  loadNewArrivals() {
    this.productService.getProducts({ sort: 'id,desc', size: 4 }).subscribe({
      next: (res) => {
        this.newArrivals.set(res.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}

