import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      }
    ]
  },

  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },

  {
    path: 'checkout',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) // Placeholder
  },

  // Auth routes (public)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
        path: 'verify-account',
        loadComponent: () => import('./features/auth/verify-account/verify-account.component').then(m => m.VerifyAccountComponent)
      },
    ]
  },

  // Account routes (protected)
  {
    path: 'account',
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/account/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'addresses',
        loadComponent: () => import('./features/account/addresses/addresses.component').then(m => m.AddressesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/account/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./features/account/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/auth/login' }
];
