import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { map } from 'rxjs/operators';
import { VariablesSistemaModel } from '../models/VariablesSistema.model';
import { OrigenService } from './origen.service';
import { Observable } from 'rxjs';

import { Subscription } from 'rxjs';

const MesesName = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobalesService {
  // Definiendo el Objeto que obtendra todas las variables de Sesión
  VariablesSistema = new VariablesSistemaModel();

  // -- variables de Sesión para ser Emitidas
  Informacion$ = new EventEmitter<VariablesSistemaModel>();

  InfoSubscripcion: Subscription;

  constructor(private origenService: OrigenService) {
    this.CargarInformacion();
  }

  CargarInformacion() {
    if (localStorage.getItem('VariablesSistema')) {
      // Como Existe VariablesSistema en lo LocalStorage, simplemente lo carga
      // console.log('Existe');
      this.VariablesSistema = JSON.parse(
        localStorage.getItem('VariablesSistema')
      );
    } else {
      // Si no existe VariablesSistema, entonces los genera
      // console.log('No existe');
      this.VariablesSistema.Ano = new Date().getFullYear();
      this.VariablesSistema.Mes = MesesName[new Date().getMonth()];

      // Cargando Información Inicial de Origen
      this.origenService
        .InformacionInicialOrigen(this.VariablesSistema.Ano)
        // tslint:disable-next-line: deprecation
        .subscribe((datos) => {
          this.VariablesSistema.Indice = datos[0].Indice;
          this.VariablesSistema.NombreProyecto = datos[0].Nombre;
          this.VariablesSistema.Origen = datos[0].Origen;
          this.VariablesSistema.Id_Proyecto = datos[0].Id_Proyecto;

          // Guardando en el LocalStorage
          localStorage.setItem(
            'VariablesSistema',
            JSON.stringify(this.VariablesSistema)
          );
        });
    }
  }

  // ==========================================
  // Observable pendiente de cambios de Menu Información (Mes y Año)
  // ==========================================
  public VariablesSistemaObservable() {
    const obs = new Observable((observador) => {
      this.InfoSubscripcion = this.Informacion$.subscribe(() => {
        observador.next(this.VariablesSistema);
      });
    });
    return obs;
  }
}
