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
                <div class="price-row">
                  <span>Koszt dostawy</span>
                  <span [class.free-text]="getShippingPrice() === 0">
                    {{ getShippingPrice() === 0 ? 'Bezpłatnie' : (getShippingPrice() | currency:'PLN') }}
                  </span>
                </div>
                <div class="price-row total">
                  <span>Suma całkowita</span>
                  <span>{{ cart().totalPrice + getShippingPrice() | currency:'PLN' }}</span>
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
          <div class="modal-amount">{{ (cart().totalPrice + getShippingPrice()) | currency:'PLN' }}</div>
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
            <div class="transfer-row"><span>Kwota:</span><strong>{{ (cart().totalPrice + getShippingPrice()) | currency:'PLN' }}</strong></div>
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
            {{ isPaymentProcessing() ? 'Przetwarzanie...' : 'Zapłać ' + ((cart().totalPrice + getShippingPrice()) | currency:'PLN') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { padding: 40px 0 100px; max-width: 1000px; }
    .checkout-header { text-align: center; margin-bottom: 50px; }
    .checkout-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 30px; }

    .stepper {
      display: flex; align-items: center; justify-content: center; gap: 15px;
      max-width: 600px; margin: 0 auto;
    }
    .step { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; }
    .step-num {
      width: 36px; height: 36px; border-radius: 50%; background: var(--card);
      border: 2px solid var(--border); display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: var(--text-muted); transition: all 0.3s; font-size: 14px;
    }
    .step-label { font-size: 12px; font-weight: 600; color: var(--text-muted); }
    .line { flex-grow: 1; height: 2px; background: var(--border); max-width: 60px; margin-top: -20px; }
    .step.active .step-num { border-color: var(--primary); color: var(--primary); background: rgba(108,99,255,0.12); }
    .step.active .step-label { color: var(--primary-light); }
    .step.completed .step-num { background: var(--primary); border-color: var(--primary); color: white; }

    .checkout-content { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    .step-content { animation: fadeIn 0.35s ease; }
    .step-content h2 { font-size: 22px; margin-bottom: 24px; font-weight: 700; }
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

    .address-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
    .address-card {
      border: 2px solid var(--border); border-radius: 16px; padding: 20px; cursor: pointer;
      transition: all 0.25s; position: relative;
    }
    .address-card:hover { border-color: var(--primary-light); }
    .address-card.selected { border-color: var(--primary); background: rgba(108,99,255,0.07); }
    .selection-indicator {
      position: absolute; top: 14px; right: 14px; width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid var(--border); transition: all 0.25s;
    }
    .address-card.selected .selection-indicator { border-color: var(--primary); background: var(--primary); }
    .address-card.selected .selection-indicator::after { content: '✓'; color: white; font-size: 11px; display: flex; justify-content: center; padding-top: 1px; }
    .address-card .name { font-weight: 700; font-size: 15px; margin-bottom: 10px; }
    .address-card .details { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px; }
    .address-card .phone { font-size: 13px; color: var(--text-muted); }

    .options-list { display: flex; flex-direction: column; gap: 12px; }
    .option-item {
      display: flex; align-items: center; gap: 16px; padding: 18px 20px;
      border: 2px solid var(--border); border-radius: 14px; cursor: pointer; transition: all 0.25s;
    }
    .option-item:hover { border-color: var(--primary-light); background: rgba(108,99,255,0.03); }
    .option-item.selected { border-color: var(--primary); background: rgba(108,99,255,0.07); }
    .option-item input[type=radio] { width: 18px; height: 18px; accent-color: var(--primary); flex-shrink: 0; }
    .option-icon-wrap { font-size: 26px; width: 40px; text-align: center; flex-shrink: 0; }
    .pay-icon { font-size: 22px; }
    .option-info { flex-grow: 1; }
    .option-info .name { display: block; font-weight: 700; font-size: 15px; }
    .option-info .desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .option-price { font-weight: 700; font-size: 15px; color: var(--primary-light); flex-shrink: 0; }
    .option-price.free { color: var(--success); }
    .free-text { color: var(--success) !important; font-weight: 700; }

    .summary-layout { display: grid; grid-template-columns: 1fr 300px; gap: 40px; }
    .summary-section { margin-bottom: 28px; }
    .summary-section h3 { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px; }
    .summary-items { display: flex; flex-direction: column; gap: 14px; }
    .summary-item { display: flex; align-items: center; gap: 14px; }
    .summary-item img { width: 56px; height: 56px; object-fit: contain; background: rgba(255,255,255,0.08); border-radius: 8px; border: 1px solid var(--border); }
    .item-info { flex-grow: 1; }
    .item-name { font-weight: 600; font-size: 14px; }
    .item-meta { font-size: 12px; color: var(--text-muted); }
    .item-total { font-weight: 700; font-size: 14px; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .preview-box { background: rgba(255,255,255,0.04); padding: 14px; border-radius: 10px; font-size: 13px; line-height: 1.7; border: 1px solid var(--border); }

    .summary-sidebar { background: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; height: max-content; border: 1px solid var(--border); }
    .price-summary { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .price-row { display: flex; justify-content: space-between; font-size: 14px; }
    .price-row.total { margin-top: 12px; padding-top: 16px; border-top: 1px dashed var(--border); font-size: 18px; font-weight: 800; color: var(--primary-light); }
    .terms { font-size: 11px; color: var(--text-muted); text-align: center; line-height: 1.5; }

    .checkout-actions { display: flex; gap: 16px; margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--border); }
    .spacer { flex-grow: 1; }
    .btn-lg { padding: 14px 32px; font-size: 16px; }

    .empty-addresses { text-align: center; padding: 40px; grid-column: 1 / -1; }
    .empty-addresses p { margin-bottom: 16px; color: var(--text-muted); }

    .btn-secondary {
      background: rgba(255,255,255,0.05); border: 1px solid var(--border);
      color: var(--text); padding: 10px 20px; border-radius: 10px; font-weight: 600;
      cursor: pointer; transition: all 0.25s; font-family: inherit; font-size: 14px;
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: var(--primary); }
    .btn-sm { padding: 6px 12px; font-size: 13px; }

    /* ===== PAYMENT MODAL ===== */
    .payment-modal {
      background: var(--surface-2); border: 1px solid var(--border);
      border-radius: 24px; padding: 0; width: 100%; max-width: 480px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
      animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
    }
    .modal-head {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      padding: 28px 32px; display: flex; justify-content: space-between; align-items: center;
    }
    .modal-logo { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.9); }
    .modal-amount { font-size: 26px; font-weight: 800; color: white; }

    .pay-form { padding: 28px 32px; }
    .pay-method-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.3);
      color: var(--primary-light); padding: 6px 14px; border-radius: 100px;
      font-size: 13px; font-weight: 700; margin-bottom: 20px;
    }
    .pay-hint { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }

    /* BLIK */
    .blik-input-wrap { display: flex; justify-content: center; margin: 10px 0; }
    .blik-input {
      width: 200px; background: rgba(255,255,255,0.07); border: 2px solid var(--border);
      border-radius: 14px; padding: 18px; text-align: center; font-size: 28px;
      font-weight: 800; letter-spacing: 10px; color: var(--text); font-family: monospace;
      outline: none; transition: border 0.2s;
    }
    .blik-input:focus { border-color: var(--primary); }
    .blik-timer { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); margin-top: 12px; justify-content: center; }
    .timer-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); animation: pulse 1s infinite; }

    /* CARD */
    .card-preview {
      background: linear-gradient(135deg, #1a1a3e, #2d2d6e);
      border-radius: 16px; padding: 20px 24px; margin-bottom: 20px;
      border: 1px solid rgba(108,99,255,0.3); transition: all 0.3s;
      min-height: 110px; position: relative;
    }
    .card-chip { font-size: 18px; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
    .card-num { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 2px; color: white; margin-bottom: 14px; }
    .card-info-row { display: flex; gap: 32px; }
    .card-label { font-size: 9px; text-transform: uppercase; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
    .card-val { font-size: 13px; font-weight: 700; color: white; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .form-group label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; }
    .field {
      background: rgba(255,255,255,0.06); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text); font-size: 15px; padding: 11px 14px;
      outline: none; transition: border 0.2s; font-family: inherit;
    }
    .field:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
    .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* QUICK PAY (Google/Apple) */
    .pay-quick { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .pay-quick-icon { font-size: 48px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 32px; color: white; border: 2px solid var(--border); }
    .apple-icon { background: rgba(0,0,0,0.3); }
    .pay-quick p { color: var(--text-muted); font-size: 14px; max-width: 280px; }
    .quick-dots { display: flex; gap: 8px; }
    .quick-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); animation: bounce 1.2s infinite; }
    .quick-dots span:nth-child(2) { animation-delay: 0.2s; }
    .quick-dots span:nth-child(3) { animation-delay: 0.4s; }

    /* TRANSFER */
    .transfer-box { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
    .transfer-row { display: flex; gap: 12px; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .transfer-row:last-child { border-bottom: none; }
    .transfer-row span { color: var(--text-muted); flex-shrink: 0; }
    .transfer-row strong { color: var(--text); text-align: right; word-break: break-all; }

    .modal-actions { display: flex; gap: 12px; padding: 0 32px 28px; }
    .btn-pay {
      flex: 1; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700;
      font-size: 15px; cursor: pointer; transition: all 0.25s; font-family: inherit;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 4px 20px rgba(108,99,255,0.4);
    }
    .btn-pay:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(108,99,255,0.5); }
    .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }
    .pay-spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }
    @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 850px) {
      .summary-layout { grid-template-columns: 1fr; }
      .summary-sidebar { order: -1; }
      .summary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private addressService = inject(AddressService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private ui = inject(UiService);
  private router = inject(Router);

  readonly shippingOptions: ShippingOption[] = [
    { id: 'Kurier DPD',     name: 'Kurier DPD',        desc: 'Dostawa do drzwi',         price: 15, eta: '1–2 dni robocze',   icon: '📦' },
    { id: 'Kurier DHL',     name: 'Kurier DHL',        desc: 'Dostawa do drzwi',         price: 18, eta: '1–2 dni robocze',   icon: '🟡' },
    { id: 'FedEx Express',  name: 'FedEx Express',     desc: 'Dostawa ekspresowa',       price: 25, eta: 'Następny dzień',    icon: '🚀' },
    { id: 'Paczkomat InPost', name: 'Paczkomat InPost', desc: 'Dostawa do paczkomatu',  price: 12, eta: '1–2 dni robocze',   icon: '🏪' },
    { id: 'Odbior osobisty', name: 'Odbiór osobisty',  desc: 'Warszawa, ul. Sklepowa 1', price: 0,  eta: 'Pon–Pt 9:00–17:00', icon: '🏬' },
  ];

  readonly paymentOptions: PaymentOption[] = [
    { id: 'BLIK',              name: 'BLIK',              desc: 'Szybka płatność kodem z aplikacji bankowej', icon: '📱', type: 'blik'     },
    { id: 'Karta płatnicza',   name: 'Karta płatnicza',   desc: 'Visa, Mastercard, American Express',         icon: '💳', type: 'card'     },
    { id: 'Google Pay',        name: 'Google Pay',        desc: 'Płatność jednym dotknięciem',                icon: '🔵', type: 'google'   },
    { id: 'Apple Pay',         name: 'Apple Pay',         desc: 'Touch ID lub Face ID',                       icon: '🍎', type: 'apple'    },
    { id: 'Przelew bankowy',   name: 'Przelew bankowy',   desc: 'Tradycyjny przelew — realizacja do 24h',     icon: '🏦', type: 'transfer' },
  ];

  addresses = signal<Address[]>([]);
  cart = this.cartService.cart;

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
