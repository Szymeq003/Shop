import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { NewsletterComponent } from './shared/components/newsletter/newsletter.component';
import { ScrollTopComponent } from './shared/components/scroll-top/scroll-top.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent, ConfirmModalComponent, NewsletterComponent, ScrollTopComponent],
  template: `
    <app-navbar />
    <div style="min-height: calc(100vh - 70px);">
      <router-outlet />
    </div>
    @if (auth.currentUser()?.role !== 'pracownik') {
      <app-newsletter />
    }
    <app-toast />
    <app-confirm-modal />
    <app-scroll-top />
  `,

})
export class App {
  auth = inject(AuthService);
}
