import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminStatsResponse, DailySales } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <h1 class="page-title">Panel Administratora</h1>
        <p class="page-subtitle">Witaj w panelu kontrolnym. Monitoruj aktywność sklepu i zarządzaj kontami użytkowników.</p>
      </header>

      <!-- Stat Cards Grid -->
      <div class="stats-grid">
        <div class="stat-card sales-card">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Całkowity Obrót</span>
            <h2 class="stat-value">{{ (stats()?.totalSales || 0) | currency:'PLN' }}</h2>
          </div>
        </div>

        <div class="stat-card orders-card">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Liczba Zamówień</span>
            <h2 class="stat-value">{{ stats()?.totalOrders || 0 }}</h2>
          </div>
        </div>

        <div class="stat-card products-card">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m7.5 4.27 9 5.15"></path>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.27 6.96 8.73 5.04 8.73-5.04"></path>
              <path d="M12 22.08V12"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Dostępne Produkty</span>
            <h2 class="stat-value">{{ stats()?.totalProducts || 0 }}</h2>
          </div>
        </div>

        <div class="stat-card users-card">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Użytkownicy</span>
            <h2 class="stat-value">{{ stats()?.totalUsers || 0 }}</h2>
          </div>
        </div>
      </div>

      <!-- Quick Navigation Grid -->
      <h3 class="section-title">Zarządzanie Sklepem</h3>
      <div class="management-grid">
        <a routerLink="/admin/users" class="mgmt-card">
          <div class="mgmt-icon users-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          </div>
          <div class="mgmt-content">
            <h4>Użytkownicy</h4>
            <p>Zarządzaj uprawnieniami, rolami i kontami pracowników.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/employee/orders" class="mgmt-card">
          <div class="mgmt-icon orders-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Zamówienia</h4>
            <p>Sprawdzaj i aktualizuj statusy oraz wysyłki zamówień.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/employee/products" class="mgmt-card">
          <div class="mgmt-icon products-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </div>
          <div class="mgmt-content">
            <h4>Produkty</h4>
            <p>Dodawaj nowe pozycje i modyfikuj parametry oraz zapasy.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/employee/categories" class="mgmt-card">
          <div class="mgmt-icon categories-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Kategorie</h4>
            <p>Zarządzaj hierarchią kategorii i atrybutami produktów.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>
      </div>

      <!-- Promotions & Marketing Grid -->
      <h3 class="section-title">Promocje i Marketing</h3>
      <div class="management-grid">
        <a routerLink="/admin/discount-codes" class="mgmt-card">
          <div class="mgmt-icon discounts-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Kody Rabatowe</h4>
            <p>Twórz kody rabatowe i zarządzaj ich warunkami oraz ważnością.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/admin/promotions" class="mgmt-card">
          <div class="mgmt-icon promos-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Promocje</h4>
            <p>Ustalaj promocje sezonowe, wyprzedaże i oferty specjalne.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/admin/campaigns" class="mgmt-card">
          <div class="mgmt-icon campaigns-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Kampanie Marketingowe</h4>
            <p>Zarządzaj kampaniami i śledź ich skuteczność w czasie.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/admin/newsletter" class="mgmt-card">
          <div class="mgmt-icon newsletter-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Newsletter</h4>
            <p>Zarządzaj subskrybentami i wysyłaj kampanie e-mailowe.</p>
          </div>
          <div class="mgmt-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </a>
      </div>

      <!-- System Management Grid -->
      <h3 class="section-title">Zarządzanie Systemem</h3>
      <div class="management-grid">
        <a routerLink="/admin/settings" class="mgmt-card">
          <div class="mgmt-icon settings-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Ustawienia Sklepu</h4>
            <p>Konfiguruj podstawowe parametry i zachowanie sklepu.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/payment-methods" class="mgmt-card">
          <div class="mgmt-icon payment-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Metody Płatności</h4>
            <p>Zarządzaj dostępnymi metodami płatności i bramkami.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/delivery-methods" class="mgmt-card">
          <div class="mgmt-icon delivery-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Metody Dostawy</h4>
            <p>Konfiguruj kurierów, odbiór osobisty i koszty wysyłki.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/taxes" class="mgmt-card">
          <div class="mgmt-icon taxes-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Konfiguracja Podatków</h4>
            <p>Zarządzaj stawkami VAT i regułami podatkowymi.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/integrations" class="mgmt-card">
          <div class="mgmt-icon integrations-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Integracje</h4>
            <p>Zarządzaj integracjami z płatnościami, kurierami i usługami.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>
      </div>

      <!-- Reports & Analytics Grid -->
      <h3 class="section-title">Raporty i Analityka</h3>
      <div class="management-grid">
        <a routerLink="/admin/reports" class="mgmt-card">
          <div class="mgmt-icon reports-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Statystyki Sprzedaży</h4>
            <p>Analizuj trendy sprzedaży, przychody i konwersje.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/reports" class="mgmt-card">
          <div class="mgmt-icon financial-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Raporty Finansowe</h4>
            <p>Generuj raporty finansowe, faktury i zestawienia.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/reports" class="mgmt-card">
          <div class="mgmt-icon behavior-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Analiza Użytkowników</h4>
            <p>Śledź zachowania, aktywność i segmentację klientów.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/reports" class="mgmt-card">
          <div class="mgmt-icon top-products-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Najlepsze Produkty</h4>
            <p>Przeglądaj ranking najchętniej kupowanych produktów.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>
      </div>

      <!-- Security Grid -->
      <h3 class="section-title">Bezpieczeństwo</h3>
      <div class="management-grid">
        <a routerLink="/admin/security" class="mgmt-card">
          <div class="mgmt-icon access-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Zarządzanie Dostępami</h4>
            <p>Kontroluj uprawnienia i dostępy do panelu administracyjnego.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/security" class="mgmt-card">
          <div class="mgmt-icon logs-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Logi Systemowe</h4>
            <p>Monitoruj zdarzenia, błędy i aktywność w systemie.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/security" class="mgmt-card">
          <div class="mgmt-icon backup-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Zarządzanie Backupami</h4>
            <p>Twórz i przywracaj kopie zapasowe danych sklepu.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>
      </div>

      <!-- System & Technical Grid -->
      <h3 class="section-title">System i Techniczne</h3>
      <div class="management-grid">
        <a routerLink="/admin/system" class="mgmt-card">
          <div class="mgmt-icon api-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Zarządzanie API</h4>
            <p>Konfiguruj klucze API, tokeny i integracje zewnętrzne.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/system" class="mgmt-card">
          <div class="mgmt-icon server-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Konfiguracja Serwera</h4>
            <p>Zarządzaj parametrami i konfiguracją serwera aplikacji.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/system" class="mgmt-card">
          <div class="mgmt-icon monitoring-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Monitorowanie Systemu</h4>
            <p>Obserwuj wydajność, dostępność i metryki systemu.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>

        <a routerLink="/admin/system" class="mgmt-card">
          <div class="mgmt-icon updates-mgmt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div class="mgmt-content">
            <h4>Aktualizacje Systemu</h4>
            <p>Zarządzaj aktualizacjami i wersjami systemu sklepu.</p>
          </div>
          <div class="mgmt-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
        </a>
      </div>

      <div class="dashboard-details">
        <div class="card details-card orders-section">
          <div class="section-header">
            <h3>Ostatnie Zamówienia</h3>
            <a routerLink="/employee/orders" class="btn btn-secondary btn-sm">Wszystkie</a>
          </div>

          <div class="table-wrap" *ngIf="stats()?.recentOrders?.length; else emptyOrders">
            <table>
              <thead>
                <tr>
                  <th>Klient</th>
                  <th>Kwota</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of stats()?.recentOrders">
                  <td>
                    <div class="client-info">
                      <span class="client-name">{{ order.customerName }}</span>
                      <span class="client-email">{{ order.customerEmail }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="price-val">{{ order.totalPrice | currency:'PLN' }}</span>
                  </td>
                  <td>
                    <span class="badge" [class]="'badge-' + order.status.toLowerCase()">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td>
                    <span class="date-val">{{ order.createdAt | date:'dd.MM.yyyy HH:mm' }}</span>
                  </td>
                  <td>
                    <a [routerLink]="['/employee/orders', order.id]" class="btn-detail" title="Pokaż">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyOrders>
            <div class="empty-data">Brak zamówień w systemie.</div>
          </ng-template>
        </div>

        <div class="card details-card chart-section">
          <h3>Trend Sprzedaży (7 dni)</h3>
          <div class="chart-container" *ngIf="stats()?.salesTrend?.length; else emptyTrend">
            <div class="bars-wrapper">
              <div class="bar-col" *ngFor="let day of stats()?.salesTrend">
                <div class="bar-bar-wrapper">
                  <div class="bar-bar" [style.height.%]="(day.sales / getMaxSales()) * 100">
                    <span class="bar-tooltip">{{ day.sales | currency:'PLN' }}</span>
                  </div>
                </div>
                <span class="bar-date">{{ formatDate(day.date) }}</span>
              </div>
            </div>
          </div>
          <ng-template #emptyTrend>
            <div class="empty-data">Brak danych o sprzedaży.</div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 40px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(139, 92, 246, 0.3);
      box-shadow: 0 10px 25px rgba(139, 92, 246, 0.1);
    }

    .stat-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary-light);
    }

    .stat-icon-wrapper svg {
      width: 26px;
      height: 26px;
    }

    .sales-card .stat-icon-wrapper {
      background: rgba(81, 207, 102, 0.15);
      color: var(--success);
    }

    .orders-card .stat-icon-wrapper {
      background: rgba(139, 92, 246, 0.15);
      color: var(--primary-light);
    }

    .products-card .stat-icon-wrapper {
      background: rgba(255, 212, 59, 0.15);
      color: var(--warning);
    }

    .users-card .stat-icon-wrapper {
      background: rgba(255, 107, 107, 0.15);
      color: var(--error);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--text);
    }

    .management-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .mgmt-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: var(--radius);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .mgmt-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(139, 92, 246, 0.25);
      transform: translateY(-3px);
    }

    .mgmt-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .mgmt-icon svg {
      width: 22px;
      height: 22px;
    }

    .users-mgmt {
      background: rgba(255, 107, 107, 0.1);
      color: var(--error);
    }
    .orders-mgmt {
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary-light);
    }
    .products-mgmt {
      background: rgba(81, 207, 102, 0.1);
      color: var(--success);
    }
    .categories-mgmt {
      background: rgba(255, 212, 59, 0.1);
      color: var(--warning);
    }
    .discounts-mgmt {
      background: rgba(255, 159, 67, 0.1);
      color: #ff9f43;
    }
    .promos-mgmt {
      background: rgba(255, 107, 107, 0.1);
      color: #ff6b6b;
    }
    .campaigns-mgmt {
      background: rgba(56, 176, 230, 0.1);
      color: #38b0e6;
    }
    .newsletter-mgmt {
      background: rgba(81, 207, 102, 0.1);
      color: #51cf66;
    }
    .settings-mgmt {
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary-light);
    }
    .payment-mgmt {
      background: rgba(81, 207, 102, 0.1);
      color: var(--success);
    }
    .delivery-mgmt {
      background: rgba(255, 212, 59, 0.1);
      color: var(--warning);
    }
    .taxes-mgmt {
      background: rgba(81, 207, 102, 0.1);
      color: var(--success);
    }
    .integrations-mgmt {
      background: rgba(56, 176, 230, 0.1);
      color: #38b0e6;
    }
    .reports-mgmt {
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary-light);
    }
    .financial-mgmt {
      background: rgba(81, 207, 102, 0.1);
      color: var(--success);
    }
    .behavior-mgmt {
      background: rgba(56, 176, 230, 0.1);
      color: #38b0e6;
    }
    .top-products-mgmt {
      background: rgba(255, 212, 59, 0.1);
      color: var(--warning);
    }
    .access-mgmt {
      background: rgba(255, 107, 107, 0.1);
      color: var(--error);
    }
    .logs-mgmt {
      background: rgba(255, 159, 67, 0.1);
      color: #ff9f43;
    }
    .backup-mgmt {
      background: rgba(56, 176, 230, 0.1);
      color: #38b0e6;
    }
    .api-mgmt {
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary-light);
    }
    .server-mgmt {
      background: rgba(56, 176, 230, 0.1);
      color: #38b0e6;
    }
    .monitoring-mgmt {
      background: rgba(81, 207, 102, 0.1);
      color: var(--success);
    }
    .updates-mgmt {
      background: rgba(255, 212, 59, 0.1);
      color: var(--warning);
    }

    .mgmt-content {
      flex-grow: 1;
    }

    .mgmt-content h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--text);
    }

    .mgmt-content p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .mgmt-arrow {
      color: var(--text-muted);
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .mgmt-arrow svg {
      width: 20px;
      height: 20px;
    }

    .mgmt-card:hover .mgmt-arrow {
      transform: translateX(4px);
      color: var(--primary-light);
    }

    .dashboard-details {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 32px;
    }

    @media (max-width: 992px) {
      .dashboard-details {
        grid-template-columns: 1fr;
      }
    }

    .details-card {
      padding: 24px;
      min-height: 380px;
      display: flex;
      flex-direction: column;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3, .chart-section h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      margin: 0;
    }

    .client-info {
      display: flex;
      flex-direction: column;
    }

    .client-name {
      font-weight: 500;
      color: var(--text);
    }

    .client-email {
      font-size: 12px;
      color: var(--text-muted);
    }

    .price-val {
      font-weight: 600;
      color: var(--text);
    }

    .date-val {
      font-size: 13px;
      color: var(--text-muted);
    }

    .btn-detail {
      color: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .btn-detail:hover {
      transform: scale(1.15);
      color: var(--primary);
    }

    .empty-data {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      color: var(--text-muted);
      font-size: 14px;
    }

    /* Sales Trend Chart styles */
    .chart-container {
      flex-grow: 1;
      display: flex;
      align-items: flex-end;
      padding-top: 30px;
      margin-top: 10px;
    }

    .bars-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      height: 240px;
      gap: 12px;
    }

    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      height: 100%;
    }

    .bar-bar-wrapper {
      height: 200px;
      width: 100%;
      display: flex;
      align-items: flex-end;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 6px;
      overflow: visible;
      position: relative;
    }

    .bar-bar {
      width: 100%;
      background: linear-gradient(to top, var(--primary), var(--primary-light));
      border-radius: 6px;
      transition: height 0.5s ease-out;
      cursor: pointer;
      position: relative;
    }

    .bar-bar:hover {
      background: var(--primary-light);
      filter: brightness(1.1);
    }

    .bar-tooltip {
      visibility: hidden;
      background: var(--surface-3);
      border: 1px solid var(--border);
      color: var(--text);
      text-align: center;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      position: absolute;
      bottom: 105%;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .bar-bar:hover .bar-tooltip {
      visibility: visible;
      opacity: 1;
    }

    .bar-date {
      margin-top: 10px;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<AdminStatsResponse | null>(null);

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: (err) => {
        console.error('Error fetching admin stats:', err);
      }
    });
  }

  getMaxSales(): number {
    const trend = this.stats()?.salesTrend;
    if (!trend || trend.length === 0) return 1;
    const max = Math.max(...trend.map(t => t.sales));
    return max > 0 ? max : 1;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}`;
    }
    return dateStr;
  }

  getStatusText(status: string): string {
    const map: Record<string, string> = {
      'NOWE': 'Nowe',
      'OPLACONE': 'Opłacone',
      'PAKOWANE': 'Pakowane',
      'WYSLANE': 'Wysłane',
      'DOSTARCZONE': 'Dostarczone',
      'ANULOWANE': 'Anulowane'
    };
    return map[status.toUpperCase()] || status;
  }
}
