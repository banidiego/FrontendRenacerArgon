import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ListaProyectosComponent } from './lista-proyectos/lista-proyectos.component';
import { ConfiguracionesRoutes } from './configuraciones-routing.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { CompartidoModule } from '../compartido/compartido.module';
import { OpcionesProyectoComponent } from './opciones-proyecto/opciones-proyecto.component';
import { PlanProyectoComponent } from './plan-proyecto/plan-proyecto.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { SubOrigenComponent } from './sub-origen/sub-origen.component';
import { PlanContableComponent } from './plan-contable/plan-contable.component';
import { MedioPagoComponent } from './medio-pago/medio-pago.component';
import { DocumentosIdentidadComponent } from './documentos-identidad/documentos-identidad.component';
import { TipoComprobanteComponent } from './tipo-comprobante/tipo-comprobante.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ListaSistemaComponent } from './lista-sistema/lista-sistema.component';

@NgModule({
  declarations: [ListaProyectosComponent, OpcionesProyectoComponent, PlanProyectoComponent, PresupuestoComponent, SubOrigenComponent, PlanContableComponent, MedioPagoComponent, DocumentosIdentidadComponent, TipoComprobanteComponent, UsuariosComponent, ListaSistemaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ConfiguracionesRoutes),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    CompartidoModule,
  ],
  providers: [],
})
export class ConfiguracionesModule {}
