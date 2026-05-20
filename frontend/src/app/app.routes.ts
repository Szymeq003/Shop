import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { nonEmployeeGuard } from './core/guards/non-employee.guard';
import { nonAdminGuard } from './core/guards/non-admin.guard';
import { ProductManagementComponent } from './features/employee/product-management/product-management.component';
import { ProductFormComponent } from './features/employee/product-form/product-form.component';
import { CategoryManagementComponent } from './features/employee/category-management/category-management.component';

import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [nonEmployeeGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'products',
    canActivate: [nonEmployeeGuard],
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
    canActivate: [nonEmployeeGuard],
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },

  {
    path: 'checkout',
    canActivate: [authGuard, nonEmployeeGuard],
    loadComponent: () => import('./features/cart/checkout/checkout.component').then(m => m.CheckoutComponent)
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
        canActivate: [nonEmployeeGuard, nonAdminGuard],
        loadComponent: () => import('./features/account/addresses/addresses.component').then(m => m.AddressesComponent)
      },
      {
        path: 'orders',
        canActivate: [nonEmployeeGuard, nonAdminGuard],
        loadComponent: () => import('./features/account/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'orders/:id',
        canActivate: [nonEmployeeGuard, nonAdminGuard],
        loadComponent: () => import('./features/account/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      {
        path: 'returns',
        canActivate: [nonEmployeeGuard, nonAdminGuard],
        loadComponent: () => import('./features/account/returns/returns.component').then(m => m.ReturnsComponent)
      },
      {
        path: 'reviews',
        canActivate: [nonEmployeeGuard, nonAdminGuard],
        loadComponent: () => import('./features/account/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
      {
        path: 'wishlist',
        canActivate: [nonEmployeeGuard, nonAdminGuard],
        loadComponent: () => import('./features/account/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },

  {
    path: 'employee',
    canActivate: [roleGuard],
    data: { role: 'pracownik' },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/employee/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/employee/order-list/order-list.component').then(m => m.OrderListComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./features/employee/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      {
        path: 'products',
        component: ProductManagementComponent
      },
      {
        path: 'products/new',
        component: ProductFormComponent
      },
      {
        path: 'products/edit/:id',
        component: ProductFormComponent
      },
      {
        path: 'categories',
        component: CategoryManagementComponent
      }
    ]
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'discount-codes',
        loadComponent: () => import('./features/admin/discount-codes/discount-codes.component').then(m => m.DiscountCodesComponent)
      },
      {
        path: 'promotions',
        loadComponent: () => import('./features/admin/promotions/promotions.component').then(m => m.PromotionsComponent)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./features/admin/campaigns/campaigns.component').then(m => m.CampaignsComponent)
      },
      {
        path: 'newsletter',
        loadComponent: () => import('./features/admin/newsletter/newsletter.component').then(m => m.NewsletterComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'payment-methods',
        loadComponent: () => import('./features/admin/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent)
      },
      {
        path: 'delivery-methods',
        loadComponent: () => import('./features/admin/delivery-methods/delivery-methods.component').then(m => m.DeliveryMethodsComponent)
      },
      {
        path: 'taxes',
        loadComponent: () => import('./features/admin/taxes/taxes.component').then(m => m.TaxesComponent)
      },
      {
        path: 'integrations',
        loadComponent: () => import('./features/admin/integrations/integrations.component').then(m => m.IntegrationsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'security',
        loadComponent: () => import('./features/admin/security/security.component').then(m => m.SecurityComponent)
      },
      {
        path: 'system',
        loadComponent: () => import('./features/admin/system/system.component').then(m => m.SystemComponent)
      }
    ]
  },

  { path: '**', redirectTo: '/auth/login' }
];
