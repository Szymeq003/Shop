import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../products/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="home-page">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container hero-inner">
          <div class="hero-content">
            <span class="badge-promo">Nowa dostawa MacBook Air M3</span>
            <h1>Technologia dla Twoich Marzeń</h1>
            <p>Odkryj najnowsze procesory, laptopy i smartfony w najniższych cenach na rynku.</p>
            <div class="hero-actions">
              <a routerLink="/products" class="btn btn-primary btn-lg">Rozpocznij zakupy</a>
              <a routerLink="/products" [queryParams]="{categoryId: 1}" class="btn btn-secondary btn-lg">Laptopy Gamingowe</a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="glass-box"></div>
            <div class="aura"></div>
          </div>
        </div>
      </section>

      <!-- TRUST BAR -->
      <section class="trust-bar container">
        <div class="trust-item">
          <div class="icon">🚚</div>
          <div class="text">
            <h4>Darmowa dostawa</h4>
            <p>Dla zamówień powyżej 200 zł</p>
          </div>
        </div>
        <div class="trust-item">
          <div class="icon">🛡️</div>
          <div class="text">
            <h4>2 lata gwarancji</h4>
            <p>Bezpieczeństwo każdych zakupów</p>
          </div>
        </div>
        <div class="trust-item">
          <div class="icon">↩️</div>
          <div class="text">
            <h4>14 dni na zwrot</h4>
            <p>Satysfakcja lub zwrot pieniędzy</p>
          </div>
        </div>
        <div class="trust-item">
          <div class="icon">⭐</div>
          <div class="text">
            <h4>Eksperckie doradztwo</h4>
            <p>Pomożemy Ci wybrać sprzęt</p>
          </div>
        </div>
      </section>

      <!-- CATEGORY HIGHLIGHTS -->
      <section class="categories-section container">
        <div class="section-header">
          <h2>Popularne kategorie</h2>
          <a routerLink="/products" class="link-more">Zobacz wszystkie →</a>
        </div>
        <div class="category-grid">
          <div class="cat-card" routerLink="/products" [queryParams]="{categoryId: 1}">
            <div class="cat-info">
              <h3>Laptopy</h3>
              <p>Wydajność bez kompromisów</p>
            </div>
          </div>
          <div class="cat-card" routerLink="/products" [queryParams]="{categoryId: 2}">
            <div class="cat-info">
              <h3>Smartfony</h3>
              <p>Cały świat w Twojej dłoni</p>
            </div>
          </div>
          <div class="cat-card" routerLink="/products" [queryParams]="{categoryId: 3}">
            <div class="cat-info">
              <h3>Podzespoły</h3>
              <p>Zbuduj swoją bestię</p>
            </div>
          </div>
        </div>
      </section>

      <!-- NEW ARRIVALS -->
      <section class="new-arrivals-section container">
        <div class="section-header">
          <h2>Ostatnio dodane</h2>
          <a routerLink="/products" class="link-more">Więcej nowości →</a>
        </div>
        <div class="product-grid" *ngIf="newArrivals().length > 0">
          <app-product-card *ngFor="let p of newArrivals()" [product]="p"></app-product-card>
        </div>
        <div *ngIf="isLoading()" class="loading-state">
          <div class="spinner"></div>
        </div>
      </section>

      <!-- PROMO BANNER -->
      <section class="promo-banner-section container">
        <div class="promo-banner">
          <div class="promo-content">
            <h2>Dołącz do newslettera</h2>
            <p>Odbierz 50 zł rabatu na pierwsze zakupy i bądź na bieżąco z okazjami.</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Twój adres email">
              <button class="btn btn-primary">Zapisz się</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page { padding-bottom: 100px; }

    /* Hero Section */
    .hero-section {
      background: radial-gradient(circle at 100% 0%, rgba(108, 99, 255, 0.1) 0%, transparent 40%),
                  radial-gradient(circle at 0% 100%, rgba(88, 81, 219, 0.05) 0%, transparent 40%);
      padding: 100px 0 120px;
      overflow: hidden;
    }
    .hero-inner { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; }
    .hero-content h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin: 16px 0 24px; letter-spacing: -1px; }
    .hero-content p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; max-width: 500px; }
    .badge-promo { background: rgba(108, 99, 255, 0.15); color: var(--primary-light); padding: 6px 16px; border-radius: 100px; font-size: 14px; font-weight: 600; }
    .hero-actions { display: flex; gap: 16px; }
    .hero-actions .btn-lg { padding: 16px 32px; font-size: 16px; }

    .hero-visual { position: relative; height: 400px; }
    .glass-box { 
      position: absolute; width: 300px; height: 300px; 
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 40px; transform: rotate(15deg);
      box-shadow: 0 40px 100px rgba(0,0,0,0.3);
      top: 50px; right: 50px;
    }
    .aura {
      position: absolute; width: 250px; height: 250px;
      background: var(--primary); filter: blur(100px); opacity: 0.3;
      top: 80px; right: 80px; z-index: -1;
    }

    /* Trust Bar */
    .trust-bar { 
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
      background: var(--card); border: 1px solid var(--border);
      padding: 32px; border-radius: 20px; margin-top: -60px;
      backdrop-filter: blur(20px);
    }
    .trust-item { display: flex; gap: 16px; align-items: center; }
    .trust-item .icon { font-size: 24px; background: rgba(255,255,255,0.05); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
    .trust-item h4 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
    .trust-item p { font-size: 12px; color: var(--text-muted); }

    /* Sections */
    section { margin-top: 100px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .section-header h2 { font-size: 28px; font-weight: 700; }
    .link-more { font-weight: 600; color: var(--primary-light); }

    /* Categories */
    .category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .cat-card { 
      height: 200px; border-radius: 20px; cursor: pointer;
      background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80');
      background-size: cover; background-position: center;
      display: flex; align-items: flex-end; padding: 24px;
      transition: all 0.3s;
    }
    .cat-card:nth-child(2) { background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'); }
    .cat-card:nth-child(3) { background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80'); }
    .cat-card:hover { transform: scale(1.02); filter: brightness(1.1); }
    .cat-info h3 { font-size: 20px; font-weight: 700; color: white; margin-bottom: 4px; }
    .cat-info p { font-size: 13px; color: rgba(255,255,255,0.7); }

    /* Product Grid */
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }

    /* Promo Banner */
    .promo-banner {
      background: linear-gradient(135deg, var(--surface-3), var(--surface-2));
      border: 1px solid var(--border); border-radius: 32px; padding: 60px;
      text-align: center; overflow: hidden; position: relative;
    }
    .promo-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
    .promo-content h2 { font-size: 32px; margin-bottom: 16px; }
    .promo-content p { color: var(--text-muted); margin-bottom: 32px; }
    .newsletter-form { display: flex; gap: 12px; max-width: 440px; margin: 0 auto; }
    .newsletter-form input { flex-grow: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; padding: 12px 20px; color: white; }

    @media (max-width: 992px) {
      .hero-inner { grid-template-columns: 1fr; text-align: center; }
      .hero-content h1 { font-size: 40px; }
      .hero-content p { margin-left: auto; margin-right: auto; }
      .hero-actions { justify-content: center; }
      .hero-visual { display: none; }
      .trust-bar { grid-template-columns: repeat(2, 1fr); margin-top: 40px; }
      .category-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  newArrivals = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadNewArrivals();
  }

  loadNewArrivals() {
    this.productService.getProducts({ sort: 'id,desc', size: 4 }).subscribe(res => {
      this.newArrivals.set(res.content);
      this.isLoading.set(false);
    });
  }
}
