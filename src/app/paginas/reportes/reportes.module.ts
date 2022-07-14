import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { MenuAdministrativoComponent } from './menu-administrativo/menu-administrativo.component';
import { MenuContableComponent } from './menu-contable/menu-contable.component';
import { LibrosOficialesComponent } from './libros-oficiales/libros-oficiales.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';

@NgModule({
  declarations: [
    MenuAdministrativoComponent,
    MenuContableComponent,
    LibrosOficialesComponent,
    PresupuestoComponent,
  ],
  imports: [CommonModule, ReportesRoutingModule],
})
export class ReportesModule {}
