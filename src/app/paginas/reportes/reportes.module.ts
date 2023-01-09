import { NgModule } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';

import { MenuContableComponent } from './menu-contable/menu-contable.component';
import { LibrosOficialesComponent } from './libros-oficiales/libros-oficiales.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { SrMensualesComponent } from './menu-administrativo/sr-mensuales/sr-mensuales.component';
import { GastosEjecutadosComponent } from './menu-administrativo/gastos-ejecutados/gastos-ejecutados.component';
import { RouterModule } from '@angular/router';

import { ReportesRoutes } from './reportes.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CompartidoModule } from '../compartido/compartido.module';

@NgModule({
  declarations: [
    MenuContableComponent,
    LibrosOficialesComponent,
    PresupuestoComponent,
    SrMensualesComponent,
    GastosEjecutadosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportesRoutes),
    NgxDatatableModule,
    CompartidoModule,
  ],
  providers: [DatePipe, TitleCasePipe, DecimalPipe],
})
export class ReportesModule {}
