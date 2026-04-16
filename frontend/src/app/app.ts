import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { NewsletterComponent } from './shared/components/newsletter/newsletter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent, ConfirmModalComponent, NewsletterComponent],
  template: `
    <app-navbar />
    <router-outlet />
    <app-newsletter />
    <app-toast />
    <app-confirm-modal />
  `,
  styles: []
})
export class App {}
