import { Routes } from '@angular/router';

import { BusquedaRapidaComponent } from './busqueda-rapida.component';
import { BuscarComprobanteComponent } from './buscar-comprobante/buscar-comprobante.component';
import { BuscarSrComponent } from './buscar-sr/buscar-sr.component';
import { BuscarAuxiliarComponent } from './buscar-auxiliar/buscar-auxiliar.component';
import { SolicitudesRendirComponent } from './solicitudes-rendir/solicitudes-rendir.component';
import { AsientosNoCerradosComponent } from './asientos-no-cerrados/asientos-no-cerrados.component';

export const BusquedaRapidaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'BuscarComprobante',
        component: BuscarComprobanteComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'BuscarSR',
        component: BuscarSrComponent,
      },
    ],
  },

  {
    path: '',
    children: [
      {
        path: 'BuscarAuxiliar',
        component: BuscarAuxiliarComponent,
      },
    ],
  },

  {
    path: '',
    children: [
      {
        path: 'SolicitudesPorRendir',
        component: SolicitudesRendirComponent,
      },
    ],
  },

  {
    path: '',
    children: [
      {
        path: 'AsientosNoCerrados',
        component: AsientosNoCerradosComponent,
      },
    ],
  },
];
