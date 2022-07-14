import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompartidoRoutingModule } from './compartido-routing.module';
import { BuscarAuxiliarComponent } from './dialogos/buscar-auxiliar/buscar-auxiliar.component';
import { BuscarPlanContableComponent } from './dialogos/buscar-plan-contable/buscar-plan-contable.component';
import { BuscarPlanProyectoComponent } from './dialogos/buscar-plan-proyecto/buscar-plan-proyecto.component';
import { NuevoAuxiliarComponent } from './dialogos/nuevo-auxiliar/nuevo-auxiliar.component';
import { LoadingComponent } from './loading/loading.component';
import { MenuEstaticoComponent } from './menu-estatico/menu-estatico.component';
import { MenuInformacionComponent } from './menu-informacion/menu-informacion.component';

@NgModule({
  declarations: [
    BuscarAuxiliarComponent,
    BuscarPlanContableComponent,
    BuscarPlanProyectoComponent,
    NuevoAuxiliarComponent,
    LoadingComponent,
    MenuEstaticoComponent,
    MenuInformacionComponent,
  ],
  imports: [CommonModule, CompartidoRoutingModule],
  exports: [LoadingComponent, MenuInformacionComponent, MenuEstaticoComponent],
})
export class CompartidoModule {}
