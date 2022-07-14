import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusquedaRapidaRoutes } from './busqueda-rapida.routing';
import { BusquedaRapidaComponent } from './busqueda-rapida.component';
import { RouterModule } from '@angular/router';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BusquedaRapidaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(BusquedaRapidaRoutes),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class BusquedaRapidaModule {}
