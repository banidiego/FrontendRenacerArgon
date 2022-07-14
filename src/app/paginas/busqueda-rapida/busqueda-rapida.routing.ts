import { Routes } from '@angular/router';

import { BusquedaRapidaComponent } from './busqueda-rapida.component';

export const BusquedaRapidaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BusquedaRapidaComponent,
      },
    ],
  },
];
