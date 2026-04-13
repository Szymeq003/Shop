import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="page container">
      <div class="account-layout">
        <aside class="account-nav">
          <h3 style="margin-bottom: 20px; font-size: 16px; padding: 0 14px;">Cześć {{ profileData().name.split(' ')[0] }}</h3>
          <a routerLink="/account/orders" routerLinkActive="active">Zamówienia</a>
          <a routerLink="/account/returns" routerLinkActive="active">Zwroty</a>
          <a routerLink="/account/wishlist" routerLinkActive="active">Obserwowane</a>
          <a routerLink="/account/reviews" routerLinkActive="active">Opinie</a>
          <a routerLink="/account/addresses" routerLinkActive="active">Dane dostawy</a>
          <a routerLink="/account/profile" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Ustawienia konta</a>
        </aside>

        <main>
          <div style="margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
            <a routerLink="/account/orders" class="btn btn-secondary btn-sm">← Wróć</a>
            <h2 class="page-title" style="margin-bottom: 0;">Szczegóły zamówienia #{{ orderId }}</h2>
          </div>

          @if (isLoading()) {
            <div class="spinner"></div>
          } @else if (order()) {
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
              
              <!-- Lewa kolumna: Przedmioty -->
              <div>
                <section class="card" style="padding: 0; margin-bottom: 24px;">
                  <h3 style="padding: 24px; border-bottom: 1px solid var(--border); font-size: 18px;">Zamówione produkty</h3>
                  <div class="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Produkt</th>
                          <th>Cena</th>
                          <th>Ilość</th>
                          <th>Suma</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (item of order()?.items; track item.productId) {
                          <tr>
                            <td>
                              <div style="font-weight: 500;">Produkt ID: {{ item.productId }}</div>
                              <div style="font-size: 12px; color: var(--text-muted);">Wariant ID: {{ item.variantId || 'Brak' }}</div>
                            </td>
                            <td>{{ item.price | currency:'PLN' }}</td>
                            <td>{{ item.quantity }}</td>
                            <td style="font-weight: 600;">{{ (item.price * item.quantity) | currency:'PLN' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </section>

                <section class="card">
                  <h3 style="margin-bottom: 20px; font-size: 18px;">Historia statusów</h3>
                  <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; gap: 16px;">
                      <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--success); margin-top: 6px;"></div>
                      <div>
                        <div style="font-weight: 600;">Status zamówienia: {{ order()?.status }}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">{{ order()?.updatedAt | date:'dd.MM.yyyy HH:mm' }}</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Prawa kolumna: Podsumowanie i Adres -->
              <aside>
                <div class="card" style="margin-bottom: 24px;">
                  <h3 style="margin-bottom: 20px; font-size: 18px;">Adres dostawy</h3>
                  <div style="font-size: 14px;">
                    <strong>{{ order()?.address?.firstName }} {{ order()?.address?.lastName }}</strong><br>
                    {{ order()?.address?.street }}<br>
                    {{ order()?.address?.postalCode }} {{ order()?.address?.city }}<br>
                    {{ order()?.address?.country }}<br><br>
                    <span style="color: var(--text-muted);">Telefon:</span> {{ order()?.address?.phone }}
                  </div>
                </div>

                <div class="card" style="background: var(--surface-3);">
                  <h3 style="margin-bottom: 20px; font-size: 18px;">Podsumowanie</h3>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
                    <span>Wartość produktów:</span>
                    <span>{{ order()?.totalPrice | currency:'PLN' }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
                    <span>Dostawa:</span>
                    <span>0,00 PLN</span>
                  </div>
                  <hr style="border: none; border-top: 1px solid var(--border); margin: 16px 0;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px; color: var(--primary-light);">
                    <span>Łącznie:</span>
                    <span>{{ order()?.totalPrice | currency:'PLN' }}</span>
                  </div>
                </div>
              </aside>

            </div>
          } @else {
            <div class="empty-state">
              <h3>Nie znaleziono zamówienia</h3>
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  orderId: string | null = null;
  order = signal<Order | null>(null);
  isLoading = signal(true);
  profileData = signal({
    name: this.authService.currentUser()?.name || ''
  });

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.orderService.getOrderById(+this.orderId).subscribe({
        next: (data) => {
          this.order.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
}
