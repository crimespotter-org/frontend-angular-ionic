import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
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
    path: '**',
    redirectTo: '/tabs',
    pathMatch: 'full',
  },
  {
    path: 'profile-edit',
    loadComponent: () => import('./tab3/profile-edit/profile-edit.page').then( m => m.ProfileEditPage)
  },
  {
    path: 'password-change',
    loadComponent: () => import('./tab3/password-change/password-change.page').then( m => m.PasswordChangePage)
  },
];
