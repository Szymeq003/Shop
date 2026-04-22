import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>Rejestracja</h1>
          <p>Utwórz konto, aby zacząć zakupy.</p>
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

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Imię i nazwisko</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="registerData.name"
              required
              placeholder="Jan Kowalski"
              #name="ngModel"
              [class.error]="name.invalid && name.touched"
            >
            @if (name.invalid && name.touched) {
              <span class="error-message">Imię i nazwisko jest wymagane</span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="registerData.email"
              required
              email
              placeholder="twoj@email.pl"
              #email="ngModel"
              [class.error]="email.invalid && email.touched"
            >
            @if (email.invalid && email.touched) {
              <span class="error-message">
                @if (email.errors?.['required']) { Email jest wymagany }
                @else if (email.errors?.['email']) { Nieprawidłowy format email }
              </span>
            }
          </div>

          <div class="form-group">
            <label for="password">Hasło</label>
            <div class="password-wrapper">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="registerData.password"
                required
                minlength="8"
                placeholder="Min. 8 znaków"
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
            @if (password.invalid && password.touched) {
              <span class="error-message">
                @if (password.errors?.['required']) { Hasło jest wymagane }
                @else if (password.errors?.['minlength']) { Hasło musi mieć co najmniej 8 znaków }
              </span>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Potwierdź hasło</label>
            <div class="password-wrapper">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="registerData.confirmPassword"
                required
                placeholder="Powtórz hasło"
                #confirmPassword="ngModel"
                [class.error]="(confirmPassword.invalid && confirmPassword.touched) || (confirmPassword.touched && registerData.password !== registerData.confirmPassword)"
              >
            </div>
            @if (confirmPassword.touched && registerData.password !== registerData.confirmPassword) {
              <span class="error-message">Hasła nie są identyczne</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="registerForm.invalid || isLoading() || registerData.password !== registerData.confirmPassword"
            style="margin-top: 12px;"
          >
            @if (isLoading()) {
              Tworzenie konta...
            } @else {
              Zarejestruj się
            }
          </button>
        </form>

        <div class="auth-footer">
          Masz już konto? <a routerLink="/auth/login">Zaloguj się</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage.set('Hasła nie są identyczne');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { name, email, password } = this.registerData;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.successMessage.set('Konto utworzone! Sprawdź e-mail, aby aktywować konto.');
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd rejestracji. Spróbuj ponownie.');
      }
    });
  }
}
