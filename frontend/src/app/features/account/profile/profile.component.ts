import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page container">
      <div class="account-layout">
        <aside class="account-nav">
          <h3 style="margin-bottom: 20px; font-size: 16px; padding: 0 14px;">Nawigacja</h3>
          <a class="active">Ustawienia konta</a>
          <a href="/account/addresses">Adresy dostawy</a>
          <a href="/account/orders">Historia zamówień</a>
        </aside>

        <main>
          <div class="page-header">
            <h2 class="page-title">Ustawienia konta</h2>
            <p class="page-subtitle">Zarządzaj swoimi danymi osobowymi, numerem telefonu i bezpieczeństwem.</p>
          </div>

          <!-- Dane osobowe -->
          <section class="card" style="margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
              <h3 style="font-size: 18px; margin: 0;">Dane podstawowe</h3>
              @if (!isEditMode()) {
                <button (click)="isEditMode.set(true)" class="btn btn-secondary btn-sm">Edytuj</button>
              }
            </div>
            
            @if (profileError()) {
              <div class="alert alert-error">{{ profileError() }}</div>
            }
            @if (profileSuccess()) {
              <div class="alert alert-success">{{ profileSuccess() }}</div>
            }

            @if (!isEditMode()) {
              <div class="info-grid">
                <div class="info-item">
                  <label>Imię i nazwisko</label>
                  <p>{{ profileData().name }}</p>
                </div>
                <div class="info-item">
                  <label>Adres e-mail</label>
                  <p>{{ profileData().email }}</p>
                </div>
                <div class="info-item">
                  <label>Numer telefonu</label>
                  <p>{{ profileData().phone || 'Nie podano' }}</p>
                </div>
              </div>
            } @else {
              <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
                <div class="form-group">
                  <label for="name">Imię i nazwisko</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    [(ngModel)]="editData.name"
                    required
                    #nameField="ngModel"
                  >
                </div>

                <div class="form-group">
                  <label for="phone">Numer telefonu</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    [(ngModel)]="editData.phone"
                    placeholder="+48 000 000 000"
                  >
                </div>

                <div class="form-group">
                  <label for="email">E-mail (nieedytowalny)</label>
                  <input
                    type="email"
                    id="email"
                    [value]="profileData().email"
                    disabled
                    style="opacity: 0.6; cursor: not-allowed;"
                  >
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="profileForm.invalid || isUpdatingProfile()"
                  >
                    @if (isUpdatingProfile()) { Zapisywanie... } @else { Zapisz zmiany }
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="cancelEdit()"
                    [disabled]="isUpdatingProfile()"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            }
          </section>

          <!-- Zmiana hasła -->
          <section class="card">
            <h3 style="margin-bottom: 24px; font-size: 18px;">Bezpieczeństwo</h3>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">Zalecamy regularną zmianę hasła dla lepszej ochrony konta.</p>

            @if (passwordError()) {
              <div class="alert alert-error">{{ passwordError() }}</div>
            }
            @if (passwordSuccess()) {
              <div class="alert alert-success">{{ passwordSuccess() }}</div>
            }

            <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
              <div class="form-group">
                <label for="currentPassword">Aktualne hasło</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  [(ngModel)]="passwordData.currentPassword"
                  required
                  placeholder="••••••••"
                >
              </div>

              <div class="form-group">
                <label for="newPassword">Nowe hasło</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  [(ngModel)]="passwordData.newPassword"
                  required
                  minlength="8"
                  placeholder="Min. 8 znaków"
                  #newPwd="ngModel"
                >
              </div>

              <div class="form-group">
                <label for="confirmNewPassword">Powtórz nowe hasło</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  [(ngModel)]="confirmNewPassword"
                  required
                  placeholder="Powtórz nowe hasło"
                >
                @if (confirmNewPassword && confirmNewPassword !== passwordData.newPassword) {
                  <span style="color: var(--error); font-size: 12px; margin-top: 4px;">Hasła nie są identyczne</span>
                }
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="passwordForm.invalid || passwordData.newPassword !== confirmNewPassword || isChangingPassword()"
              >
                @if (isChangingPassword()) { Zmienianie... } @else { Zmień hasło }
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .info-item label {
      display: block;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .info-item p {
      font-weight: 500;
      font-size: 15px;
      margin: 0;
    }
    .btn-sm {
      padding: 6px 14px;
      font-size: 13px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  profileData = signal({
    name: '',
    email: '',
    phone: ''
  });

  // Dane tymczasowe do formularza edycji
  editData = {
    name: '',
    phone: ''
  };

  passwordData = {
    currentPassword: '',
    newPassword: ''
  };
  confirmNewPassword = '';

  isEditMode = signal(false);
  isUpdatingProfile = signal(false);
  isChangingPassword = signal(false);
  
  profileError = signal<string | null>(null);
  profileSuccess = signal<string | null>(null);
  
  passwordError = signal<string | null>(null);
  passwordSuccess = signal<string | null>(null);

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        const data = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone || ''
        };
        this.profileData.set(data);
        this.editData = { name: data.name, phone: data.phone };
      },
      error: () => this.profileError.set('Błąd podczas ładowania profilu.')
    });
  }

  cancelEdit() {
    const data = this.profileData();
    this.editData = { name: data.name, phone: data.phone };
    this.isEditMode.set(false);
  }

  updateProfile() {
    this.isUpdatingProfile.set(true);
    this.profileError.set(null);
    this.profileSuccess.set(null);

    this.userService.updateProfile({ 
      name: this.editData.name,
      phone: this.editData.phone
    }).subscribe({
      next: (res) => {
        this.profileSuccess.set('Dane zostały zaktualizowane.');
        this.isUpdatingProfile.set(false);
        this.isEditMode.set(false);
        
        const updatedData = {
          name: res.name,
          email: res.email,
          phone: res.phone || ''
        };
        this.profileData.set(updatedData);
        this.editData = { name: updatedData.name, phone: updatedData.phone };
        
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          this.authService.currentUser.set({ ...currentUser, name: res.name });
          localStorage.setItem('shop_user', JSON.stringify(this.authService.currentUser()));
        }
      },
      error: (err) => {
        this.isUpdatingProfile.set(false);
        this.profileError.set(err.error?.message || 'Wystąpił błąd podczas aktualizacji.');
      }
    });
  }

  changePassword() {
    this.isChangingPassword.set(true);
    this.passwordError.set(null);
    this.passwordSuccess.set(null);

    this.userService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.passwordSuccess.set('Hasło zostało zmienione.');
        this.isChangingPassword.set(false);
        this.passwordData = { currentPassword: '', newPassword: '' };
        this.confirmNewPassword = '';
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(err.error?.message || 'Błąd podczas zmiany hasła.');
      }
    });
  }
}
