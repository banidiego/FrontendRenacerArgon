import { Routes } from '@angular/router';

import { InicioComponent } from './inicio.component';

export const InicioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InicioComponent,
      },
    ],
  },
];
