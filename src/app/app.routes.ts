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
