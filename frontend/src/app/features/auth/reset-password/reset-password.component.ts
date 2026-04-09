import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>Nowe hasło</h1>
          <p>Wprowadź swoje nowe hasło poniżej.</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-error">
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success">
            {{ successMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
          <div class="form-group">
            <label for="password">Nowe hasło</label>
            <div class="password-wrapper">
              <input
                [type]="showNewPassword() ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="newPassword"
                required
                minlength="8"
                placeholder="Min. 8 znaków"
                #passwordInput="ngModel"
                [class.error]="passwordInput.invalid && passwordInput.touched"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="showNewPassword.set(!showNewPassword())"
                [attr.aria-label]="showNewPassword() ? 'Ukryj hasło' : 'Pokaż hasło'"
              >
                @if (showNewPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Powtórz nowe hasło</label>
            <div class="password-wrapper">
              <input
                [type]="showConfirmPassword() ? 'text' : 'password'"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                placeholder="Powtórz hasło"
                #confirmPasswordInput="ngModel"
                [class.error]="(confirmPasswordInput.touched && confirmPassword !== newPassword)"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="showConfirmPassword.set(!showConfirmPassword())"
                [attr.aria-label]="showConfirmPassword() ? 'Ukryj hasło' : 'Pokaż hasło'"
              >
                @if (showConfirmPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              </button>
            </div>
            @if (confirmPasswordInput.touched && confirmPassword !== newPassword) {
              <span style="color: var(--error); font-size: 12px; margin-top: 4px;">Hasła nie są identyczne</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="resetForm.invalid || newPassword !== confirmPassword || isLoading()"
            style="margin-top: 12px;"
          >
            @if (isLoading()) {
              Zmienianie hasła...
            } @else {
              Zmień hasło
            }
          </button>
        </form>

        <div class="auth-footer">
          Wróć do <a routerLink="/auth/login">logowania</a>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token: string | null = null;
  newPassword = '';
  confirmPassword = '';

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage.set('Nieprawidłowy lub brakujący token resetowania hasła.');
    }
  }

  onSubmit() {
    if (!this.token) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.successMessage.set(res.message);
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd podczas zmiany hasła.');
      }
    });
  }
}
