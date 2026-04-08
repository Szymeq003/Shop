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
          <h1>Sklep</h1>
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
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="loginData.password"
              required
              placeholder="••••••••"
              #password="ngModel"
              [class.error]="password.invalid && password.touched"
            >
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

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/account/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd logowania. Sprawdź dane.');
      }
    });
  }
}
