import { Routes } from '@angular/router';
import { MovimientoDiarioComponent } from './movimientos/movimiento-diario/movimiento-diario.component';
import { MovimientoMesComponent } from './movimientos/movimiento-mes/movimiento-mes.component';
import { RegistroAsientoComponent } from './movimientos/registro-asiento/registro-asiento.component';
import { SolicitudesMesComponent } from './SR/solicitudes-mes/solicitudes-mes.component';
import { RegistroSolicitudComponent } from './SR/registro-solicitud/registro-solicitud.component';
import { RendicionComponent } from './SR/rendicion/rendicion.component';
import { RegistroGastoComponent } from './SR/registro-gasto/registro-gasto.component';
import { AutorizacionesMesComponent } from './autorizaciones/autorizaciones-mes/autorizaciones-mes.component';

export const OperacionesDiariasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'MovimientoDiario',
        component: MovimientoDiarioComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'MovimientoDiario/:TipoOrigen',
        component: MovimientoMesComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'MovimientoDiario/:TipoOrigen/:Id_OperacionPrincipal',
        component: RegistroAsientoComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'SolicitudesMes',
        component: SolicitudesMesComponent,
      },
      {
        path: 'Solicitud/:Id_SR',
        component: RegistroSolicitudComponent,
      },
      {
        path: 'Rendicion/:Id_SR',
        component: RendicionComponent,
      },
      {
        path: 'Rendicion/:Id_SR/RegistroGasto/:Id_DetalleSR',
        component: RegistroGastoComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'AutorizacionesMes',
        component: AutorizacionesMesComponent,
      },
    ],
  },
];
