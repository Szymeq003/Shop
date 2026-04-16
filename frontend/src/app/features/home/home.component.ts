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
      <!-- HERO 2.0: CINEMATIC TECH -->
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
            <!-- Glass cards floating behind -->
            <div class="float-card card-1">🚀 15% OFF</div>
            <div class="float-card card-2">🔥 Nitro Power</div>
          </div>
        </div>
      </section>

      <!-- TRUST DECK (Modern integrated version) -->
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

      <!-- BENTO GRID CATEGORIES -->
      <section class="bento-section container">
        <div class="section-top">
          <h2 class="title-v2">Kategorie Jutra</h2>
          <p class="subtitle-v2">Wybierz swoją ścieżkę ewolucji.</p>
        </div>
        
        <div class="bento-grid">
          <!-- Large Horizontal Box -->
          <div class="bento-item bento-large laptop-box" routerLink="/products" [queryParams]="{categoryId: 1}">
            <div class="bento-info">
              <span class="bento-label">Performance</span>
              <h3>Laptopy i Komputery</h3>
              <p>Moc obliczeniowa bez granic dla profesjonalistów.</p>
            </div>
            <img src="assets/images/hero_setup.png" class="bento-img">
          </div>

          <!-- Vertical Tall Box -->
          <div class="bento-item bento-tall smartphone-box" routerLink="/products" [queryParams]="{categoryId: 2}">
             <div class="bento-info">
                <span class="bento-label">Mobile</span>
                <h3>Mobilny Świat</h3>
                <p>Smartfony i smartwatche nowej generacji.</p>
              </div>
              <img src="assets/images/phones.png" class="bento-img">
          </div>

          <!-- Small Square 1 -->
          <div class="bento-item bento-sq hardware-box" routerLink="/products" [queryParams]="{categoryId: 3}">
              <div class="bento-info">
                <h3>Podzespoły</h3>
              </div>
              <img src="assets/images/hardware.png" class="bento-img">
          </div>

          <!-- Small Square 2 -->
          <div class="bento-item bento-sq audio-box" routerLink="/products" [queryParams]="{categoryId: 23}">
              <div class="bento-info">
                <h3>Audio i Hi-Fi</h3>
              </div>
              <img src="assets/images/audio.png" class="bento-img">
          </div>
        </div>
      </section>

      <!-- TRENDING PRODUCTS -->
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

      <!-- FEATURE HIGHLIGHT -->
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
  styles: [`
    :host { --p-grad: linear-gradient(135deg, #6c63ff 0%, #3f37c9 100%); }

    .home-page { 
      background: #0a0a0c; 
      color: #fff; 
      overflow-x: hidden;
      padding-bottom: 80px;
    }

    /* Hero Section V2 */
    .hero-v2 {
      position: relative;
      min-height: 90vh;
      display: flex;
      align-items: center;
      padding: 120px 0 80px;
      overflow: hidden;
    }
    .hero-bg-glow {
      position: absolute;
      top: -10%; right: -10%;
      width: 60%; height: 60%;
      background: radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(108, 99, 255, 0.1);
      border: 1px solid rgba(108, 99, 255, 0.2);
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: #a29dff;
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: clamp(48px, 6vw, 84px);
      font-weight: 900;
      line-height: 0.95;
      margin-bottom: 24px;
      letter-spacing: -3px;
    }
    .gradient-text {
      background: linear-gradient(to right, #6c63ff, #4cc9f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 18px;
      line-height: 1.6;
      color: #94a3b8;
      max-width: 540px;
      margin-bottom: 40px;
    }
    .hero-btns { display: flex; gap: 20px; }
    .btn-xl { padding: 18px 40px; font-size: 18px; border-radius: 14px; font-weight: 700; }
    .btn-primary-glow {
      background: var(--p-grad);
      color: white; border: none;
      box-shadow: 0 10px 30px rgba(108, 99, 255, 0.4);
      transition: all 0.3s;
    }
    .btn-primary-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(108, 99, 255, 0.6); }
    .btn-glass {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
    }
    .btn-glass:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

    .hero-visual { position: relative; }
    .main-image-wrap {
      position: relative;
      background: #111;
      border-radius: 40px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 50px 100px rgba(0,0,0,0.5);
    }
    .hero-main-img { width: 100%; height: auto; display: block; filter: brightness(0.9); transition: transform 0.8s; }
    .main-image-wrap:hover .hero-main-img { transform: scale(1.05); }
    .glass-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
    }
    
    .float-card {
      position: absolute;
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 16px 24px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      animation: floatEffect 6s infinite ease-in-out;
      z-index: 2;
    }
    .card-1 { top: -20px; right: -20px; }
    .card-2 { bottom: 40px; left: -30px; animation-delay: 2s; }

    /* Trust Deck */
    .trust-deck {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 120px;
    }
    .trust-pill {
      flex: 1;
      min-width: 220px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s;
    }
    .trust-pill:hover { background: rgba(255,255,255,0.05); border-color: rgba(108, 99, 255, 0.3); }
    .pill-icon { font-size: 24px; }
    .pill-text { font-size: 14px; color: #94a3b8; line-height: 1.3; }
    .pill-text strong { display: block; color: #fff; font-size: 15px; }

    /* Bento Section */
    .section-top { margin-bottom: 40px; }
    .title-v2 { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
    .subtitle-v2 { color: #64748b; font-size: 16px; }

    .bento-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-auto-rows: 250px;
      gap: 20px;
    }
    .bento-item {
      position: relative;
      background: #111;
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.05);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .bento-item:hover { border-color: var(--primary); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    
    .bento-large { grid-column: span 1; grid-row: span 1; }
    .bento-tall { grid-column: 2; grid-row: span 2; }
    .bento-sq { grid-column: span 1; grid-row: span 1; }

    .bento-info {
      position: absolute;
      top: 30px; left: 30px;
      z-index: 2;
      max-width: 280px;
    }
    .bento-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--primary-light);
      margin-bottom: 10px;
      display: block;
    }
    .bento-info h3 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .bento-info p { font-size: 14px; color: #94a3b8; }

    .bento-img {
      position: absolute;
      bottom: -20px; right: -20px;
      width: 70%; height: auto;
      object-fit: cover;
      opacity: 0.6;
      transition: all 0.6s;
      z-index: 1;
    }
    .bento-item:hover .bento-img { opacity: 1; transform: scale(1.1) rotate(-5deg); }

    .laptop-box { background: linear-gradient(135deg, #0f172a 0%, #020617 100%); }
    .smartphone-box .bento-img { width: 100%; bottom: -40px; right: 0; }
    .hardware-box { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); }
    .audio-box { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }

    /* Trending Section */
    .trending-section { margin-top: 120px; }
    .section-top { display: flex; justify-content: space-between; align-items: flex-end; }
    .btn-more-v2 { color: var(--primary-light); text-decoration: none; font-weight: 600; font-size: 14px; }
    .btn-more-v2:hover { text-decoration: underline; }
    
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
    .premium-card { transition: all 0.3s; }
    .premium-card:hover { transform: translateY(-10px); }

    /* Highlight Card */
    .feature-highlight { margin-top: 120px; }
    .highlight-card {
      background: var(--p-grad);
      border-radius: 40px;
      padding: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
    }
    .highlight-content { position: relative; z-index: 2; max-width: 500px; }
    .highlight-content h3 { font-size: 42px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
    .highlight-content p { font-size: 18px; margin-bottom: 32px; opacity: 0.9; }
    .btn-primary-white { background: white; color: var(--primary); font-weight: 800; border: none; padding: 14px 32px; border-radius: 12px; cursor: pointer; }
    
    .blob {
      position: absolute;
      top: -100px; right: -100px;
      width: 400px; height: 400px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      filter: blur(60px);
      z-index: 1;
    }

    /* Animations */
    @keyframes floatEffect { 
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes slideUp { 
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUp 0.8s ease forwards; }
    .animate-slide-up-delayed { animation: slideUp 0.8s 0.2s ease forwards; opacity: 0; }
    .animate-slide-up-further { animation: slideUp 0.8s 0.4s ease forwards; opacity: 0; }
    .animate-fade-in { animation: fadeIn 1s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media (max-width: 1024px) {
      .hero-container { grid-template-columns: 1fr; text-align: center; }
      .hero-subtitle { margin-inline: auto; }
      .hero-btns { justify-content: center; }
      .bento-grid { grid-template-columns: 1fr; grid-auto-rows: min-content; }
      .bento-tall { grid-column: 1; grid-row: auto; height: 350px; }
      .bento-large { height: 350px; }
      .bento-sq { height: 250px; }
      .highlight-card { padding: 40px; flex-direction: column; text-align: center; }
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
    this.productService.getProducts({ sort: 'id,desc', size: 4 }).subscribe({
      next: (res) => {
        this.newArrivals.set(res.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
