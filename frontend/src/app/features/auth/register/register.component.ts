import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>Sklep</h1>
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
          </div>

          <div class="form-group">
            <label for="password">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="registerData.password"
              required
              minlength="8"
              placeholder="Min. 8 znaków"
              #password="ngModel"
              [class.error]="password.invalid && password.touched"
            >
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="registerForm.invalid || isLoading()"
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
    password: ''
  };

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.successMessage.set('Konto utworzone! Możesz się teraz zalogować.');
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd rejestracji. Spróbuj ponownie.');
      }
    });
  }
}
