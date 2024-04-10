import {Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page)
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadComponent: () => import('../tab2/tab2.page').then((m) => m.Tab2Page)
          },
          {
            path: 'add',
            loadComponent: () => import('../tab2/components/add/add1/add1.page').then((m) => m.Add1Page)
          },
          {
            path: 'add2',
            loadComponent: () => import('../tab2/components/add/add2/add2.page').then((m) => m.Add2Page)
          },
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadComponent: () => import('../tab3/tab3.page').then(m => m.Tab3Page)
          },
          {
            path: 'profile-edit',
            loadComponent: () => import('../tab3/components/profile-edit/profile-edit.page').then(m => m.ProfileEditPage)
          },
          {
            path: 'password-change',
            loadComponent: () => import('../tab3/components/password-change/password-change.page').then(m => m.PasswordChangePage)
          },
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      },
    ],
  }
];
