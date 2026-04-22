import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AddressService, Address } from '../../../core/services/address.service';
import { CartService } from '../../../core/services/cart.service';
import { OrderService, PlaceOrderRequest, Order } from '../../../core/services/order.service';
import { UiService } from '../../../core/services/ui.service';
import { FormsModule } from '@angular/forms';

interface ShippingOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  eta: string;
  icon: string;
}

interface PaymentOption {
  id: string;
  name: string;
  desc: string;
  icon: string;
  type: 'blik' | 'card' | 'google' | 'apple' | 'transfer';
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  template: `
    <div class="checkout-page container">
      <div class="checkout-header">
        <h1>Finalizacja zamówienia</h1>
        <div class="stepper">
          <div class="step" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
            <span class="step-num">{{ currentStep() > 1 ? '✓' : '1' }}</span>
            <span class="step-label">Adres</span>
          </div>
          <div class="line"></div>
          <div class="step" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
            <span class="step-num">{{ currentStep() > 2 ? '✓' : '2' }}</span>
            <span class="step-label">Dostawa</span>
          </div>
          <div class="line"></div>
          <div class="step" [class.active]="currentStep() >= 3" [class.completed]="currentStep() > 3">
            <span class="step-num">{{ currentStep() > 3 ? '✓' : '3' }}</span>
            <span class="step-label">Płatność</span>
          </div>
          <div class="line"></div>
          <div class="step" [class.active]="currentStep() >= 4">
            <span class="step-num">4</span>
            <span class="step-label">Podsumowanie</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <!-- Step 1: Address Selection -->
        <div class="step-content" *ngIf="currentStep() === 1">
          <div class="section-title">
            <h2>Wybierz adres dostawy</h2>
            <button class="btn btn-secondary btn-sm" routerLink="/account/addresses">Zarządzaj adresami</button>
          </div>
          <div class="address-grid">
            <div
              class="address-card"
              *ngFor="let addr of addresses()"
              [class.selected]="selectedAddressId() === addr.id"
              (click)="selectedAddressId.set(addr.id)"
            >
              <div class="selection-indicator"></div>
              <div class="name">{{ addr.firstName }} {{ addr.lastName }}</div>
              <div class="details">
                {{ addr.street }}{{ addr.apartmentNumber ? ' / ' + addr.apartmentNumber : '' }}<br>
                {{ addr.postalCode }} {{ addr.city }}<br>
                {{ addr.country }}
              </div>
              <div class="phone">Tel: {{ addr.phone }}</div>
            </div>
            <div class="empty-addresses" *ngIf="addresses().length === 0">
              <p>Nie masz zapisanych adresów dostawy.</p>
              <button class="btn btn-primary" routerLink="/account/addresses">Dodaj swój pierwszy adres</button>
            </div>
          </div>
        </div>

        <!-- Step 2: Shipping Method -->
        <div class="step-content" *ngIf="currentStep() === 2">
          <h2>Metoda dostawy</h2>
          <div class="options-list">
            <label
              class="option-item"
              *ngFor="let opt of shippingOptions"
              [class.selected]="selectedShipping() === opt.id"
            >
              <input type="radio" name="shipping" [value]="opt.id" [(ngModel)]="shippingMethod">
              <div class="option-icon-wrap">{{ opt.icon }}</div>
              <div class="option-info">
                <span class="name">{{ opt.name }}</span>
                <span class="desc">{{ opt.desc }} · {{ opt.eta }}</span>
              </div>
              <div class="option-price" [class.free]="opt.price === 0">
                {{ opt.price === 0 ? 'Bezpłatnie' : (opt.price | currency:'PLN') }}
              </div>
            </label>
          </div>
        </div>

        <!-- Step 3: Payment Method -->
        <div class="step-content" *ngIf="currentStep() === 3">
          <h2>Metoda płatności</h2>
          <div class="options-list">
            <label
              class="option-item"
              *ngFor="let opt of paymentOptions"
              [class.selected]="selectedPayment() === opt.id"
            >
              <input type="radio" name="payment" [value]="opt.id" [(ngModel)]="paymentMethod">
              <div class="option-icon-wrap pay-icon">{{ opt.icon }}</div>
              <div class="option-info">
                <span class="name">{{ opt.name }}</span>
                <span class="desc">{{ opt.desc }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 4: Summary -->
        <div class="step-content" *ngIf="currentStep() === 4">
          <h2>Podsumowanie zamówienia</h2>
          <div class="summary-layout">
            <div class="summary-details">
              <div class="summary-section">
                <h3>Produkty</h3>
                <div class="summary-items">
                  <div class="summary-item" *ngFor="let item of cart().items">
                    <img [src]="item.mainImageUrl || 'assets/placeholder.png'" alt="">
                    <div class="item-info">
                      <div class="item-name">{{ item.productName }}</div>
                      <div class="item-meta">{{ item.quantity }} szt. × {{ item.price | currency:'PLN' }}</div>
                    </div>
                    <div class="item-total">{{ item.subtotal | currency:'PLN' }}</div>
                  </div>
                </div>
              </div>

              <div class="summary-grid">
                <div class="summary-section">
                  <h3>Adres dostawy</h3>
                  <div class="preview-box" *ngIf="getSelectedAddress()">
                    <strong>{{ getSelectedAddress()?.firstName }} {{ getSelectedAddress()?.lastName }}</strong><br>
                    {{ getSelectedAddress()?.street }}<br>
                    {{ getSelectedAddress()?.postalCode }} {{ getSelectedAddress()?.city }}
                  </div>
                </div>
                <div class="summary-section">
                  <h3>Dostawa i płatność</h3>
                  <div class="preview-box">
                    <strong>Dostawa:</strong> {{ getShippingLabel() }}<br>
                    <strong>Płatność:</strong> {{ getPaymentLabel() }}
                  </div>
                </div>
              </div>
            </div>

            <div class="summary-sidebar">
              <div class="price-summary">
                <div class="price-row">
                  <span>Wartość produktów</span>
                  <span>{{ cart().totalPrice | currency:'PLN' }}</span>
                </div>
                <div class="price-row" *ngIf="cartService.appliedDiscount()">
                  <span>Rabat ({{ cartService.appliedDiscount()?.code }})</span>
                  <span class="discount-amount">-{{ cartService.getDiscountAmount() | currency:'PLN' }}</span>
                </div>
                <div class="price-row">
                  <span>Koszt dostawy</span>
                  <span [class.free-text]="getShippingPrice() === 0">
                    {{ getShippingPrice() === 0 ? 'Bezpłatnie' : (getShippingPrice() | currency:'PLN') }}
                  </span>
                </div>
                <div class="price-row total">
                  <span>Suma całkowita</span>
                  <span>{{ cartService.getFinalPrice() + getShippingPrice() | currency:'PLN' }}</span>
                </div>
              </div>
              <p class="terms">Klikając „Zamawiam i płacę", akceptujesz regulamin sklepu.</p>
            </div>
          </div>
        </div>

        <div class="checkout-actions">
          <button class="btn btn-secondary" *ngIf="currentStep() > 1" (click)="prevStep()">← Wstecz</button>
          <div class="spacer"></div>
          <button
            class="btn btn-primary btn-lg"
            *ngIf="currentStep() < 4"
            [disabled]="!canGoNext()"
            (click)="nextStep()"
          >
            Dalej →
          </button>
          <button
            class="btn btn-primary btn-lg"
            *ngIf="currentStep() === 4"
            (click)="placeOrder()"
            [disabled]="isSubmitting()"
          >
            {{ isSubmitting() ? 'Przetwarzanie...' : 'Zamawiam i płacę' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== PAYMENT MODAL ===== -->
    <div class="modal-overlay" *ngIf="showPaymentModal()" (click)="closeModalIfBackdrop($event)">
      <div class="payment-modal" id="payment-modal">
        <div class="modal-head">
          <div class="modal-logo">🔒 Bezpieczna płatność</div>
          <div class="modal-amount">{{ (cartService.getFinalPrice() + getShippingPrice()) | currency:'PLN' }}</div>
        </div>

        <!-- BLIK -->
        <div *ngIf="getPaymentType() === 'blik'" class="pay-form">
          <div class="pay-method-badge">📱 BLIK</div>
          <p class="pay-hint">Otwórz aplikację bankową i wpisz 6-cyfrowy kod BLIK:</p>
          <div class="blik-input-wrap">
            <input
              id="blik-code"
              type="text"
              maxlength="6"
              inputmode="numeric"
              placeholder="_ _ _ _ _ _"
              [(ngModel)]="blikCode"
              class="blik-input"
              (input)="formatBlik($event)"
            >
          </div>
          <div class="blik-timer" *ngIf="blikCode.length === 6">
            <span class="timer-dot"></span> Kod ważny przez <strong>{{ blikTimer }}s</strong>
          </div>
        </div>

        <!-- CARD -->
        <div *ngIf="getPaymentType() === 'card'" class="pay-form">
          <div class="pay-method-badge">💳 Karta płatnicza</div>
          <div class="card-preview" [class.filled]="cardNumber.length > 0">
            <div class="card-chip">▮▮</div>
            <div class="card-num">{{ formatCardDisplay() }}</div>
            <div class="card-info-row">
              <div><div class="card-label">Właściciel</div><div class="card-val">{{ cardHolder || '— — — —' }}</div></div>
              <div><div class="card-label">Ważna do</div><div class="card-val">{{ cardExpiry || 'MM/RR' }}</div></div>
            </div>
          </div>
          <div class="form-group">
            <label>Numer karty</label>
            <input type="text" placeholder="0000 0000 0000 0000" [(ngModel)]="cardNumber" maxlength="19" (input)="formatCard($event)" class="field">
          </div>
          <div class="form-group">
            <label>Imię i nazwisko</label>
            <input type="text" placeholder="JAN KOWALSKI" [(ngModel)]="cardHolder" class="field" style="text-transform: uppercase;">
          </div>
          <div class="card-row">
            <div class="form-group">
              <label>Data ważności</label>
              <input type="text" placeholder="MM/RR" [(ngModel)]="cardExpiry" maxlength="5" (input)="formatExpiry($event)" class="field">
            </div>
            <div class="form-group">
              <label>CVV</label>
              <input type="password" placeholder="•••" [(ngModel)]="cardCvv" maxlength="3" class="field">
            </div>
          </div>
        </div>

        <!-- GOOGLE PAY -->
        <div *ngIf="getPaymentType() === 'google'" class="pay-form pay-quick">
          <div class="pay-quick-icon">G</div>
          <p>Potwierdź płatność w Google Pay na swoim urządzeniu.</p>
          <div class="quick-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <!-- APPLE PAY -->
        <div *ngIf="getPaymentType() === 'apple'" class="pay-form pay-quick">
          <div class="pay-quick-icon apple-icon">🍎</div>
          <p>Potwierdź płatność przez Face ID lub Touch ID.</p>
          <div class="quick-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <!-- TRANSFER -->
        <div *ngIf="getPaymentType() === 'transfer'" class="pay-form">
          <div class="pay-method-badge">🏦 Przelew bankowy</div>
          <p class="pay-hint">Wykonaj przelew na poniższe dane. Zamówienie zostanie potwierdzone po zaksięgowaniu.</p>
          <div class="transfer-box">
            <div class="transfer-row"><span>Odbiorca:</span><strong>Shop Sp. z o.o.</strong></div>
            <div class="transfer-row"><span>Numer konta:</span><strong>PL 12 1234 5678 9012 3456 7890 1234</strong></div>
            <div class="transfer-row"><span>Kwota:</span><strong>{{ (cartService.getFinalPrice() + getShippingPrice()) | currency:'PLN' }}</strong></div>
            <div class="transfer-row"><span>Tytuł:</span><strong>Zamówienie #{{ placedOrderId() }}</strong></div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="skipPayment()">Zapłać później</button>
          <button
            class="btn btn-pay"
            [disabled]="!canPay() || isPaymentProcessing()"
            (click)="processPayment()"
          >
            <span *ngIf="isPaymentProcessing()" class="pay-spinner"></span>
            {{ isPaymentProcessing() ? 'Przetwarzanie...' : 'Zapłać ' + ((cartService.getFinalPrice() + getShippingPrice()) | currency:'PLN') }}
          </button>
        </div>
      </div>
    </div>
  `,

})
export class CheckoutComponent implements OnInit {
  private addressService = inject(AddressService);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private ui = inject(UiService);
  private router = inject(Router);

  cart = this.cartService.cart;

  readonly shippingOptions: ShippingOption[] = [
    { id: 'Kurier DPD',       name: 'Kurier DPD',        desc: 'Dostawa do drzwi',         price: 15, eta: '1–2 dni robocze',   icon: '📦' },
    { id: 'Kurier DHL',       name: 'Kurier DHL',        desc: 'Dostawa do drzwi',         price: 18, eta: '1–2 dni robocze',   icon: '🟡' },
    { id: 'FedEx Express',    name: 'FedEx Express',     desc: 'Dostawa ekspresowa',       price: 25, eta: 'Następny dzień',    icon: '🚀' },
    { id: 'Paczkomat InPost', name: 'Paczkomat InPost',  desc: 'Dostawa do paczkomatu',    price: 12, eta: '1–2 dni robocze',   icon: '🏪' },
    { id: 'Odbior osobisty',  name: 'Odbiór osobisty',   desc: 'Warszawa, ul. Sklepowa 1', price: 0,  eta: 'Pon–Pt 9:00–17:00', icon: '🏬' },
  ];

  readonly paymentOptions: PaymentOption[] = [
    { id: 'BLIK',            name: 'BLIK',            desc: 'Szybka płatność kodem z aplikacji bankowej', icon: '📱', type: 'blik'     },
    { id: 'Karta płatnicza', name: 'Karta płatnicza', desc: 'Visa, Mastercard, American Express',         icon: '💳', type: 'card'     },
    { id: 'Google Pay',      name: 'Google Pay',      desc: 'Płatność jednym dotknięciem',                icon: '🔵', type: 'google'   },
    { id: 'Apple Pay',       name: 'Apple Pay',       desc: 'Touch ID lub Face ID',                       icon: '🍎', type: 'apple'    },
    { id: 'Przelew bankowy', name: 'Przelew bankowy', desc: 'Tradycyjny przelew — realizacja do 24h',     icon: '🏦', type: 'transfer' },
  ];

  addresses = signal<Address[]>([]);

  currentStep = signal(1);
  selectedAddressId = signal<number | null>(null);

  shippingMethod = 'Kurier DPD';
  paymentMethod  = 'BLIK';

  isSubmitting        = signal(false);
  showPaymentModal    = signal(false);
  isPaymentProcessing = signal(false);
  placedOrderId       = signal<number | null>(null);

  // BLIK
  blikCode  = '';
  blikTimer = 120;
  private blikInterval: any;

  // Card
  cardNumber = '';
  cardHolder = '';
  cardExpiry = '';
  cardCvv    = '';

  ngOnInit() {
    this.loadAddresses();
    if (this.cart().items.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe(data => {
      this.addresses.set(data);
      if (data.length > 0) this.selectedAddressId.set(data[0].id);
    });
  }

  nextStep() { if (this.canGoNext()) { this.currentStep.update(s => s + 1); window.scrollTo(0, 0); } }
  prevStep()  { this.currentStep.update(s => s - 1); window.scrollTo(0, 0); }

  canGoNext() {
    if (this.currentStep() === 1) return !!this.selectedAddressId();
    if (this.currentStep() === 2) return !!this.shippingMethod;
    if (this.currentStep() === 3) return !!this.paymentMethod;
    return true;
  }

  getSelectedAddress() { return this.addresses().find(a => a.id === this.selectedAddressId()); }
  selectedShipping()   { return this.shippingMethod; }
  selectedPayment()    { return this.paymentMethod; }
  getShippingLabel()   { return this.shippingOptions.find(o => o.id === this.shippingMethod)?.name || this.shippingMethod; }
  getPaymentLabel()    { return this.paymentOptions.find(o => o.id === this.paymentMethod)?.name  || this.paymentMethod; }

  getShippingPrice(): number {
    return this.shippingOptions.find(o => o.id === this.shippingMethod)?.price ?? 15;
  }

  getPaymentType(): string {
    return this.paymentOptions.find(o => o.id === this.paymentMethod)?.type || 'blik';
  }

  placeOrder() {
    const request: PlaceOrderRequest = {
      addressId:      this.selectedAddressId()!,
      shippingMethod: this.shippingMethod,
      paymentMethod:  this.paymentMethod
    };
    this.isSubmitting.set(true);
    this.orderService.placeOrder(request).subscribe({
      next: (order: Order) => {
        this.placedOrderId.set(order.id);
        this.cartService.loadCart();
        this.isSubmitting.set(false);
        this.openPaymentModal();
      },
      error: (err: any) => {
        this.ui.showToast(err.error?.message || 'Błąd podczas składania zamówienia', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  openPaymentModal() {
    this.showPaymentModal.set(true);
    if (this.getPaymentType() === 'blik') {
      this.blikTimer = 120;
      this.blikInterval = setInterval(() => {
        this.blikTimer--;
        if (this.blikTimer <= 0) clearInterval(this.blikInterval);
      }, 1000);
    }
  }

  closeModalIfBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.skipPayment();
    }
  }

  canPay(): boolean {
    const type = this.getPaymentType();
    if (type === 'blik')     return this.blikCode.length === 6;
    if (type === 'card')     return this.cardNumber.replace(/\s/g,'').length === 16 && this.cardHolder.length > 2 && this.cardExpiry.length === 5 && this.cardCvv.length === 3;
    if (type === 'transfer') return true;
    return true; // google/apple
  }

  processPayment() {
    this.isPaymentProcessing.set(true);
    const orderId = this.placedOrderId();
    if (!orderId) return;

    setTimeout(() => {
      this.orderService.confirmPayment(orderId).subscribe({
        next: () => {
          this.isPaymentProcessing.set(false);
          clearInterval(this.blikInterval);
          this.showPaymentModal.set(false);
          this.ui.showToast('Płatność zakończona pomyślnie! 🎉');
          this.router.navigate(['/account/orders', orderId]);
        },
        error: (err: any) => {
          this.isPaymentProcessing.set(false);
          this.ui.showToast(err.error?.message || 'Błąd płatności', 'error');
        }
      });
    }, 1500);
  }

  skipPayment() {
    clearInterval(this.blikInterval);
    this.showPaymentModal.set(false);
    this.ui.showToast('Zamówienie złożone. Możesz zapłacić później w szczegółach zamówienia.');
    const oid = this.placedOrderId();
    if (oid) this.router.navigate(['/account/orders', oid]);
  }

  formatBlik(e: Event) {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    this.blikCode = input.value;
  }

  formatCard(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = v.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = input.value;
  }

  formatExpiry(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    input.value = v;
    this.cardExpiry = v;
  }

  formatCardDisplay(): string {
    const raw = this.cardNumber.replace(/\s/g, '');
    const padded = raw.padEnd(16, '•');
    return padded.replace(/(.{4})/g, '$1 ').trim();
  }
}
