import { Routes } from '@angular/router';

import { SrMensualesComponent } from './menu-administrativo/sr-mensuales/sr-mensuales.component';

export const ReportesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Administrativo/SRMensual',
        component: SrMensualesComponent,
      },
    ],
  },
];
