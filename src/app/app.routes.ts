import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth.guard";
import {roleCrimespotterGuard} from "./guards/role.crimespotter.guard";

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
    path: 'add-case-1',
    loadComponent: () => import('./components/add/add1/add1.page').then(m => m.Add1Page),
    canActivate: [authGuard,roleCrimespotterGuard]
  },
  {
    path: 'add-case-2',
    loadComponent: () => import('./components/add/add2/add2.page').then(m => m.Add2Page),
    canActivate: [authGuard,roleCrimespotterGuard]
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
    path: 'edit-case/:id',
    loadComponent: () => import('./components/edit-case/edit-case.component').then(m => m.EditCaseComponent),
    canActivate: [authGuard, roleCrimespotterGuard]
  },
  {
    path: '**',
    redirectTo: '/tabs',
    pathMatch: 'full',
  },
];
