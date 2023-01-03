import { Routes } from '@angular/router';
import { ListaProyectosComponent } from './lista-proyectos/lista-proyectos.component';
import { OpcionesProyectoComponent } from './opciones-proyecto/opciones-proyecto.component';
import { PlanProyectoComponent } from './plan-proyecto/plan-proyecto.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { SubOrigenComponent } from './sub-origen/sub-origen.component';
import { PlanContableComponent } from './plan-contable/plan-contable.component';
import { MedioPagoComponent } from './medio-pago/medio-pago.component';
import { ListaSistemaComponent } from './lista-sistema/lista-sistema.component';
import { DocumentosIdentidadComponent } from './documentos-identidad/documentos-identidad.component';
import { TipoComprobanteComponent } from './tipo-comprobante/tipo-comprobante.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const ConfiguracionesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Proyectos',
        component: ListaProyectosComponent,
      },
      {
        path: 'Proyectos/OpcionesProyecto/:Id_Proyecto',
        component: OpcionesProyectoComponent,
      },
      {
        path: 'Proyectos/OpcionesProyecto/:Id_Proyecto/PlanProyecto',
        component: PlanProyectoComponent,
      },
      {
        path: 'Proyectos/OpcionesProyecto/:Id_Proyecto/Presupuesto',
        component: PresupuestoComponent,
      },
      {
        path: 'Proyectos/OpcionesProyecto/:Id_Proyecto/SubOrigen',
        component: SubOrigenComponent,
      },
      {
        path: 'PlanContable',
        component: PlanContableComponent,
      },

      {
        path: 'Sistema/MedioPago',
        component: MedioPagoComponent,
      },
      {
        path: 'Sistema/DocumentoIdentidad',
        component: DocumentosIdentidadComponent,
      },
      {
        path: 'Sistema/TipoComprobantes',
        component: TipoComprobanteComponent,
      },
      {
        path: 'Sistema/Usuarios',
        component: UsuariosComponent,
      },
    ],
  },
];
