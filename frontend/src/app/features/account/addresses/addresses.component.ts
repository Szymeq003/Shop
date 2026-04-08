import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService, Address, AddressRequest } from '../../../core/services/address.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page container">
      <div class="account-layout">
        <aside class="account-nav">
          <h3 style="margin-bottom: 20px; font-size: 16px; px: 14px;">Nawigacja</h3>
          <a href="/account/profile">Ustawienia konta</a>
          <a class="active">Adresy dostawy</a>
          <a href="/account/orders">Historia zamówień</a>
        </aside>

        <main>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
            <div>
              <h2 class="page-title">Adresy dostawy</h2>
              <p class="page-subtitle">Zarządzaj swoimi adresami do wysyłki zamówień.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddModal()">
              + Dodaj adres
            </button>
          </div>

          @if (isLoading()) {
            <div class="spinner"></div>
          } @else if (addresses().length === 0) {
            <div class="empty-state">
              <div class="icon">📍</div>
              <h3>Brak adresów</h3>
              <p>Nie masz jeszcze zapisanych żadnych adresów dostawy.</p>
            </div>
          } @else {
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
              @for (addr of addresses(); track addr.id) {
                <div class="card" style="padding: 24px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <h4 style="font-size: 16px;">{{ addr.firstName }} {{ addr.lastName }}</h4>
                    <div style="display: flex; gap: 8px;">
                      <button class="btn-sm btn-secondary" (click)="openEditModal(addr)">Edytuj</button>
                      <button class="btn-sm btn-danger" (click)="deleteAddress(addr.id)">Usuń</button>
                    </div>
                  </div>
                  <p style="font-size: 14px; color: var(--text-muted);">
                    {{ addr.street }}{{ addr.apartmentNumber ? '/' + addr.apartmentNumber : '' }}<br>
                    {{ addr.postalCode }} {{ addr.city }}<br>
                    {{ addr.country }}
                  </p>
                  <p style="font-size: 14px; margin-top: 8px;">
                    <span style="color: var(--text-muted);">Tel:</span> {{ addr.phone }}
                  </p>
                </div>
              }
            </div>
          }
        </main>
      </div>
    </div>

    @if (showModal()) {
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isEditing() ? 'Edytuj adres' : 'Dodaj nowy adres' }}</h2>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>

          <form (ngSubmit)="saveAddress()" #addressForm="ngForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Imię</label>
                <input name="firstName" [(ngModel)]="currentAddress.firstName" required>
              </div>
              <div class="form-group">
                <label>Nazwisko</label>
                <input name="lastName" [(ngModel)]="currentAddress.lastName" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Ulica i numer</label>
                <input name="street" [(ngModel)]="currentAddress.street" required placeholder="ul. Sezamkowa 15">
              </div>
              <div class="form-group">
                <label>Nr mieszkania</label>
                <input name="apartmentNumber" [(ngModel)]="currentAddress.apartmentNumber" placeholder="np. 2">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
              <div class="form-group">
                <label>Kod pocztowy</label>
                <input name="postalCode" [(ngModel)]="currentAddress.postalCode" required placeholder="00-000">
              </div>
              <div class="form-group">
                <label>Miasto</label>
                <input name="city" [(ngModel)]="currentAddress.city" required placeholder="Warszawa">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Kraj</label>
                <input name="country" [(ngModel)]="currentAddress.country" required placeholder="Polska">
              </div>
              <div class="form-group">
                <label>Telefon</label>
                <input name="phone" [(ngModel)]="currentAddress.phone" required placeholder="123456789">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Anuluj</button>
              <button type="submit" class="btn btn-primary" [disabled]="addressForm.invalid || isSaving()">
                {{ isSaving() ? 'Zapisywanie...' : 'Zapisz adres' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class AddressesComponent implements OnInit {
  private addressService = inject(AddressService);

  addresses = signal<Address[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);

  currentAddress: AddressRequest = this.emptyAddress();
  editingId: number | null = null;

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.isLoading.set(true);
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  emptyAddress(): AddressRequest {
    return {
      firstName: '',
      lastName: '',
      street: '',
      apartmentNumber: '',
      city: '',
      postalCode: '',
      country: '',
      phone: ''
    };
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentAddress = this.emptyAddress();
    this.showModal.set(true);
  }

  openEditModal(addr: Address) {
    this.isEditing.set(true);
    this.editingId = addr.id;
    this.currentAddress = { ...addr };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveAddress() {
    this.isSaving.set(true);
    const apiCall = this.isEditing() && this.editingId 
      ? this.addressService.updateAddress(this.editingId, this.currentAddress)
      : this.addressService.addAddress(this.currentAddress);

    apiCall.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModal.set(false);
        this.loadAddresses();
      },
      error: () => this.isSaving.set(false)
    });
  }

  deleteAddress(id: number) {
    if (confirm('Czy na pewno chcesz usunąć ten adres?')) {
      this.addressService.deleteAddress(id).subscribe(() => {
        this.addresses.update(prev => prev.filter(a => a.id !== id));
      });
    }
  }
}
