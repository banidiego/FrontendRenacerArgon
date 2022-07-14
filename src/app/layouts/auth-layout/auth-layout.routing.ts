import { Routes } from '@angular/router';

import { PricingComponent } from '../../pages/examples/pricing/pricing.component';
import { LockComponent } from '../../pages/examples/lock/lock.component';
import { RegisterComponent } from '../../pages/examples/register/register.component';
import { PresentationComponent } from '../../pages/presentation/presentation.component';
import { LoginComponent } from 'src/app/paginas/login/login.component';

export const AuthLayoutRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'lock',
        component: LockComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'pricing',
        component: PricingComponent,
      },
    ],
  },
];
