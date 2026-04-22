import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>Logowanie</h1>
          <p>Witaj ponownie! Zaloguj się do swojego konta.</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-error">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="loginData.email"
              required
              email
              placeholder="twoj@email.pl"
              #email="ngModel"
              [class.error]="email.invalid && email.touched"
            >
          </div>

          <div class="form-group">
            <label for="password">Hasło</label>
            <div class="password-wrapper">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="loginData.password"
                required
                placeholder="••••••••"
                #password="ngModel"
                [class.error]="password.invalid && password.touched"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="showPassword.set(!showPassword())"
                [attr.aria-label]="showPassword() ? 'Ukryj hasło' : 'Pokaż hasło'"
              >
                @if (showPassword()) {
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

          <div style="text-align: right; margin-bottom: 24px;">
            <a routerLink="/auth/forgot-password" style="font-size: 14px;">Zapomniałeś hasła?</a>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              Logowanie...
            } @else {
              Zaloguj się
            }
          </button>
        </form>

        <div class="auth-footer">
          Nie masz konta? <a routerLink="/auth/register">Zarejestruj się</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        if (res.role === 'pracownik') {
          this.router.navigate(['/employee']);
        } else {
          this.router.navigate(['/account/orders']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd logowania. Sprawdź dane.');
      }
    });
  }
}
