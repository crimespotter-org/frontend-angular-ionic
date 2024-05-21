import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./components/tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'password-reset',
    loadComponent: () => import('./components/login/components/password-reset/password-reset.component').then(m => m.PasswordResetComponent),
  },
  {
    path: 'password-reset-form',
    loadComponent: () => import('./components/login/components/password-reset-form/password-reset-form.component').then(m => m.PasswordResetFormComponent),
  },
  {
    path: 'register-confirm',
    loadComponent: () => import('./components/register/components/email-confirmation/email-confirmation.component').then(m => m.EmailConfirmationComponent),
  },
  {
    path: 'mail-change-old-confirm',
    loadComponent: () => import('./components/tab3/components/account-management/components/profile-edit/components/old-mail-change-confirmation/old-mail-change-confirmation.component').then(m => m.OldMailChangeConfirmationComponent),
  },
  {
    path: 'mail-change-new-confirm',
    loadComponent: () => import('./components/tab3/components/account-management/components/profile-edit/components/new-mail-change-confirmation/new-mail-change-confirmation.component').then(m => m.NewMailChangeConfirmationComponent),
  },
  {
    path: 'add-case',
    loadComponent: () => import('./components/add-case/add-case.page').then( m => m.AddCasePage)
  },
  {
    path: 'edit-case/:id',
    loadComponent: () => import('./components/edit-case/edit-case.component').then( m => m.EditCaseComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/tabs',
    pathMatch: 'full',
  },
];
