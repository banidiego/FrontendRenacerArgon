import { NgModule } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  TitleCasePipe,
  DecimalPipe,
} from '@angular/common';

import { OperacionesDiariasRoutes } from './operaciones-diarias-routing';
import { AutorizacionesMesComponent } from './autorizaciones/autorizaciones-mes/autorizaciones-mes.component';
import { MovimientoDiarioComponent } from './movimientos/movimiento-diario/movimiento-diario.component';
import { MovimientoMesComponent } from './movimientos/movimiento-mes/movimiento-mes.component';
import { RegistroAsientoComponent } from './movimientos/registro-asiento/registro-asiento.component';
import { RegistroGastoComponent } from './SR/registro-gasto/registro-gasto.component';
import { RegistroSolicitudComponent } from './SR/registro-solicitud/registro-solicitud.component';
import { RendicionComponent } from './SR/rendicion/rendicion.component';
import { SolicitudesMesComponent } from './SR/solicitudes-mes/solicitudes-mes.component';
import { RouterModule } from '@angular/router';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPrintModule } from 'ngx-print';
import { CompartidoModule } from '../compartido/compartido.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AutorizacionesMesComponent,
    MovimientoDiarioComponent,
    MovimientoMesComponent,
    RegistroAsientoComponent,
    RegistroGastoComponent,
    RegistroSolicitudComponent,
    RendicionComponent,
    SolicitudesMesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OperacionesDiariasRoutes),
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
  providers: [DatePipe, TitleCasePipe, DecimalPipe],
})
export class OperacionesDiariasModule {}
