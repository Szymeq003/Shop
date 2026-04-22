import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { UiService } from '../../../core/services/ui.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="page container">
      <div class="account-layout">
        <aside class="account-nav">
          <h3 style="margin-bottom: 20px; font-size: 16px; padding: 0 14px;">Cześć {{ profileData().name.split(' ')[0] }}</h3>
          <a routerLink="/account/orders"    routerLinkActive="active">Zamówienia</a>
          <a routerLink="/account/returns"   routerLinkActive="active">Zwroty</a>
          <a routerLink="/account/wishlist"  routerLinkActive="active">Obserwowane</a>
          <a routerLink="/account/reviews"   routerLinkActive="active">Opinie</a>
          <a routerLink="/account/addresses" routerLinkActive="active">Dane dostawy</a>
          <a routerLink="/account/profile"   routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Ustawienia konta</a>
        </aside>

        <main>
          <!-- Header -->
          <div style="margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <a routerLink="/account/orders" class="btn btn-secondary btn-sm">← Wróć</a>
              <h2 class="page-title" style="margin-bottom: 0;">Zamówienie #{{ orderId }}</h2>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
              <!-- Pay now button for unpaid non-cancelled orders -->
              <button
                *ngIf="order() && order()?.status !== 'anulowane' && order()?.paymentStatus !== 'Opłacone'"
                class="btn-pay-now"
                (click)="openPayModal()"
                [disabled]="isPayingNow()"
              >
                💳 {{ isPayingNow() ? 'Przetwarzanie...' : 'Zapłać teraz' }}
              </button>
              <!-- Cancel button -->
              <button
                *ngIf="order()?.status === 'nowe'"
                class="btn-outline-danger"
                (click)="cancelOrder()"
                [disabled]="isCancelling()"
              >
                {{ isCancelling() ? 'Anulowanie...' : 'Anuluj zamówienie' }}
              </button>
            </div>
          </div>

          @if (isLoading()) {
            <div style="min-height: 60vh; display: flex; align-items: center; justify-content: center;">
              <div class="spinner" style="margin: 0;"></div>
            </div>
          } @else if (order()) {
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">

              <!-- LEFT: Products + Delivery + Order Status + Payment Status -->
              <div>
                <!-- Products table -->
                <section class="card" style="padding: 0; margin-bottom: 24px;">
                  <h3 style="padding: 20px 24px; border-bottom: 1px solid var(--border); font-size: 17px;">📦 Zamówione produkty</h3>
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

                <!-- Delivery & payment info -->
                <section class="card" style="margin-bottom: 24px;">
                  <h3 style="margin-bottom: 20px; font-size: 17px;">🚚 Dostawa i płatność</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="info-block">
                      <div class="info-label">METODA DOSTAWY</div>
                      <div class="info-value">{{ order()?.shippingMethod }}</div>
                    </div>
                    <div class="info-block">
                      <div class="info-label">METODA PŁATNOŚCI</div>
                      <div class="info-value">{{ order()?.paymentMethod }}</div>
                    </div>
                  </div>
                </section>

                <!-- Order & Payment status -->
                <section class="card">
                  <h3 style="margin-bottom: 20px; font-size: 17px;">📋 Status zamówienia i płatności</h3>

                  <div class="status-grid">
                    <!-- Order status -->
                    <div class="status-tile">
                      <div class="status-tile-label">STATUS ZAMÓWIENIA</div>
                      <div class="status-row">
                        <div class="status-dot" [class]="order()?.status"></div>
                        <div>
                          <div class="status-name" [class]="'status-text-' + order()?.status">{{ statusLabel(order()?.status) }}</div>
                          <div class="status-date">{{ order()?.updatedAt | date:'dd.MM.yyyy HH:mm' }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Payment status -->
                    <div class="status-tile" [class.payment-paid]="order()?.paymentStatus === 'Opłacone'" [class.payment-pending]="order()?.paymentStatus !== 'Opłacone'">
                      <div class="status-tile-label">STATUS PŁATNOŚCI</div>
                      <div class="status-row">
                        <div class="pay-status-icon">{{ order()?.paymentStatus === 'Opłacone' ? '✅' : '⏳' }}</div>
                        <div>
                          <div class="status-name" [style.color]="order()?.paymentStatus === 'Opłacone' ? 'var(--success)' : 'var(--warning)'">
                            {{ order()?.paymentStatus }}
                          </div>
                          <div class="status-date">
                            {{ order()?.paymentStatus === 'Opłacone' ? 'Płatność zaksięgowana' : 'Oczekiwanie na płatność' }}
                          </div>
                        </div>
                      </div>
                      <!-- Pay now inline CTA for pending -->
                      <button
                        *ngIf="order()?.paymentStatus !== 'Opłacone' && order()?.status !== 'anulowane'"
                        class="pay-inline-btn"
                        (click)="openPayModal()"
                      >
                        Zapłać teraz →
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <!-- RIGHT: Address + Summary -->
              <aside>
                <div class="card" style="margin-bottom: 24px;">
                  <h3 style="margin-bottom: 16px; font-size: 17px;">📍 Adres dostawy</h3>
                  <div style="font-size: 14px; line-height: 1.8; color: var(--text);">
                    <strong>{{ order()?.address?.firstName }} {{ order()?.address?.lastName }}</strong><br>
                    {{ order()?.address?.street }}<br>
                    {{ order()?.address?.postalCode }} {{ order()?.address?.city }}<br>
                    {{ order()?.address?.country }}<br>
                    <span style="color: var(--text-muted);">Tel: {{ order()?.address?.phone }}</span>
                  </div>
                </div>

                <div class="card summary-card">
                  <h3 style="margin-bottom: 16px; font-size: 17px;">💰 Podsumowanie</h3>
                  <div class="summary-row">
                    <span>Wartość produktów</span>
                    <span>{{ (order()!.totalPrice - (order()?.shippingFee || 0)) | currency:'PLN' }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Dostawa</span>
                    <span [style.color]="(order()?.shippingFee || 0) === 0 ? 'var(--success)' : ''">
                      {{ (order()?.shippingFee || 0) === 0 ? 'Bezpłatnie' : (order()?.shippingFee | currency:'PLN') }}
                    </span>
                  </div>
                  <hr style="border: none; border-top: 1px dashed var(--border); margin: 14px 0;">
                  <div class="summary-row total-row">
                    <span>Łącznie</span>
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

    <!-- ===== PAY MODAL ===== -->
    <div class="modal-overlay" *ngIf="showPayModal()" (click)="onBackdropClick($event)">
      <div class="pay-modal" id="pay-modal-dialog">
        <div class="pay-modal-head">
          <span>🔒 Płatność za zamówienie #{{ orderId }}</span>
          <span class="pay-modal-amount">{{ order()?.totalPrice | currency:'PLN' }}</span>
        </div>

        <div class="pay-modal-body">
          <div class="pay-method-info">
            <span class="pay-badge">{{ paymentIcon() }} {{ order()?.paymentMethod }}</span>
          </div>

          <!-- BLIK -->
          <div *ngIf="paymentType() === 'blik'">
            <p class="pay-hint">Otwórz aplikację bankową i wpisz 6-cyfrowy kod BLIK:</p>
            <div class="blik-wrap">
              <input
                id="blik-retry-code"
                type="text" maxlength="6" inputmode="numeric" placeholder="● ● ● ● ● ●"
                [(ngModel)]="blikCode" class="blik-input" (input)="filterBlik($event)"
              >
            </div>
          </div>

          <!-- CARD -->
          <div *ngIf="paymentType() === 'card'">
            <div class="mini-card">
              <div class="mini-card-num">{{ displayCard() }}</div>
              <div class="mini-card-row">
                <span>{{ cardHolder || '— —' }}</span>
                <span>{{ cardExpiry || 'MM/RR' }}</span>
              </div>
            </div>
            <input type="text"  placeholder="0000 0000 0000 0000" [(ngModel)]="cardNumber" maxlength="19" (input)="fmtCard($event)" class="pay-field">
            <input type="text"  placeholder="Imię i nazwisko" [(ngModel)]="cardHolder" class="pay-field" style="text-transform:uppercase; margin-top:10px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
              <input type="text"     placeholder="MM/RR" [(ngModel)]="cardExpiry" maxlength="5" (input)="fmtExpiry($event)" class="pay-field">
              <input type="password" placeholder="CVV" [(ngModel)]="cardCvv" maxlength="3" class="pay-field">
            </div>
          </div>

          <!-- TRANSFER -->
          <div *ngIf="paymentType() === 'transfer'">
            <p class="pay-hint">Przelej środki na poniższe konto, a zamówienie zostanie potwierdzone:</p>
            <div class="transfer-box">
              <div class="tr-row"><span>Odbiorca</span><strong>Shop Sp. z o.o.</strong></div>
              <div class="tr-row"><span>Konto</span><strong>PL 12 1234 5678 9012 3456 7890 1234</strong></div>
              <div class="tr-row"><span>Kwota</span><strong>{{ order()?.totalPrice | currency:'PLN' }}</strong></div>
              <div class="tr-row"><span>Tytuł</span><strong>Zamówienie #{{ orderId }}</strong></div>
            </div>
          </div>

          <!-- QUICK (Google/Apple) -->
          <div *ngIf="paymentType() === 'quick'" class="quick-center">
            <div class="quick-icon">{{ paymentIcon() }}</div>
            <p class="pay-hint">Potwierdź płatność na swoim urządzeniu</p>
            <div class="dots"><span></span><span></span><span></span></div>
          </div>
        </div>

        <div class="pay-modal-actions">
          <button class="btn btn-secondary" (click)="showPayModal.set(false)">Anuluj</button>
          <button class="btn-confirm-pay" [disabled]="!canConfirmPay() || isPayingNow()" (click)="submitPayment()">
            <span *ngIf="isPayingNow()" class="spin"></span>
            {{ isPayingNow() ? 'Przetwarzanie...' : 'Potwierdź płatność' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService  = inject(AuthService);
  private ui           = inject(UiService);
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);

  orderId: string | null = null;
  order        = signal<Order | null>(null);
  isLoading    = signal(true);
  isCancelling = signal(false);
  isPayingNow  = signal(false);
  showPayModal = signal(false);

  profileData = signal({ name: this.authService.currentUser()?.name || '' });

  // Payment form fields
  blikCode   = '';
  cardNumber = '';
  cardHolder = '';
  cardExpiry = '';
  cardCvv    = '';

  private readonly paymentMap: Record<string, { type: string; icon: string }> = {
    'BLIK':            { type: 'blik',     icon: '📱' },
    'Karta płatnicza': { type: 'card',     icon: '💳' },
    'Google Pay':      { type: 'quick',    icon: '🔵' },
    'Apple Pay':       { type: 'quick',    icon: '🍎' },
    'Przelew bankowy': { type: 'transfer', icon: '🏦' },
  };

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) this.loadOrder(+this.orderId);
  }

  loadOrder(id: number) {
    this.isLoading.set(true);
    this.orderService.getOrderById(id).subscribe({
      next:  d  => { this.order.set(d); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  statusLabel(s?: string): string {
    const map: Record<string, string> = {
      nowe: 'Nowe', oplacone: 'Opłacone', pakowane: 'Pakowane', wyslane: 'Wysłane', dostarczone: 'Dostarczone', anulowane: 'Anulowane'
    };
    return map[s ?? ''] ?? s ?? '';
  }

  paymentType(): string { return this.paymentMap[this.order()?.paymentMethod ?? '']?.type ?? 'blik'; }
  paymentIcon(): string { return this.paymentMap[this.order()?.paymentMethod ?? '']?.icon ?? '💳'; }

  openPayModal() { this.showPayModal.set(true); }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showPayModal.set(false);
    }
  }

  canConfirmPay(): boolean {
    const t = this.paymentType();
    if (t === 'blik')     return this.blikCode.length === 6;
    if (t === 'card')     return this.cardNumber.replace(/\s/g,'').length === 16
                              && this.cardHolder.length > 2
                              && this.cardExpiry.length === 5
                              && this.cardCvv.length === 3;
    return true;
  }

  submitPayment() {
    if (!this.orderId) return;
    this.isPayingNow.set(true);
    setTimeout(() => {
      this.orderService.confirmPayment(+this.orderId!).subscribe({
        next: updatedOrder => {
          this.order.set(updatedOrder);
          this.isPayingNow.set(false);
          this.showPayModal.set(false);
          this.ui.showToast('Płatność zakończona pomyślnie! 🎉');
        },
        error: (err: any) => {
          this.isPayingNow.set(false);
          this.ui.showToast(err.error?.message || 'Błąd płatności', 'error');
        }
      });
    }, 1500);
  }

  async cancelOrder() {
    const confirmed = await this.ui.confirm('Czy na pewno chcesz anulować to zamówienie? Operacja jest nieodwracalna.');
    if (confirmed && this.orderId) {
      this.isCancelling.set(true);
      this.orderService.cancelOrder(+this.orderId).subscribe({
        next: () => {
          this.ui.showToast('Zamówienie zostało anulowane i przeniesione do zwrotów.');
          this.isCancelling.set(false);
          this.router.navigate(['/account/returns']);
        },
        error: (err: any) => {
          this.ui.showToast(err.error?.message || 'Błąd podczas anulowania zamówienia', 'error');
          this.isCancelling.set(false);
        }
      });
    }
  }

  filterBlik(e: Event)  {
    const el = e.target as HTMLInputElement;
    el.value = el.value.replace(/\D/g,'').slice(0, 6);
    this.blikCode = el.value;
  }
  fmtCard(e: Event)    {
    const el = e.target as HTMLInputElement;
    let v = el.value.replace(/\D/g,'').slice(0, 16);
    el.value = v.replace(/(.{4})/g,'$1 ').trim();
    this.cardNumber = el.value;
  }
  fmtExpiry(e: Event)  {
    const el = e.target as HTMLInputElement;
    let v = el.value.replace(/\D/g,'').slice(0, 4);
    if (v.length >= 2) v = v.slice(0,2)+'/'+v.slice(2);
    el.value = v; this.cardExpiry = v;
  }
  displayCard(): string {
    return this.cardNumber.replace(/\s/g,'').padEnd(16,'•').replace(/(.{4})/g,'$1 ').trim();
  }
}
