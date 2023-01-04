import { NgModule } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';

import { BusquedaRapidaRoutes } from './busqueda-rapida.routing';
import { BusquedaRapidaComponent } from './busqueda-rapida.component';
import { RouterModule } from '@angular/router';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BuscarComprobanteComponent } from './buscar-comprobante/buscar-comprobante.component';
import { BuscarSrComponent } from './buscar-sr/buscar-sr.component';

import { BuscarAuxiliarComponent } from './buscar-auxiliar/buscar-auxiliar.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SolicitudesRendirComponent } from './solicitudes-rendir/solicitudes-rendir.component';
import { AsientosNoCerradosComponent } from './asientos-no-cerrados/asientos-no-cerrados.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    BusquedaRapidaComponent,
    BuscarComprobanteComponent,
    BuscarSrComponent,
    BuscarAuxiliarComponent,
    SolicitudesRendirComponent,
    AsientosNoCerradosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BusquedaRapidaRoutes),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
  ],
  providers: [DatePipe, TitleCasePipe, DecimalPipe],
})
export class BusquedaRapidaModule {}
