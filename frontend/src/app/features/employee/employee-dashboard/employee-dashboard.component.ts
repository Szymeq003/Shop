import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <h1 class="page-title">Panel Pracownika</h1>
        <p class="page-subtitle">Witaj w centrum zarządzania sklepem. Wybierz obszar, nad którym chcesz pracować.</p>
      </header>

      <div class="dashboard-grid">
        <a routerLink="/employee/orders" class="card dashboard-card">
          <div class="icon-box order-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Zamówienia</h3>
            <p>Zarządzaj statusem zamówień i śledź sprzedaż.</p>
          </div>
          <div class="card-action">
            <span class="btn-text">Otwórz</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/employee/products" class="card dashboard-card">
          <div class="icon-box product-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.27 6.96 8.73 5.04 8.73-5.04"/><path d="M12 22.08V12"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Produkty</h3>
            <p>Dodawaj nowe pozycje i aktualizuj asortyment.</p>
          </div>
          <div class="card-action">
            <span class="btn-text">Zarządzaj</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/employee/categories" class="card dashboard-card">
          <div class="icon-box category-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Kategorie</h3>
            <p>Organizuj strukturę działów i kategorii sklepu.</p>
          </div>
          <div class="card-action">
            <span class="btn-text">Edytuj</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>
      </div>
    </div>
  `,

})
export class EmployeeDashboardComponent {}
