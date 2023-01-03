import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { map } from 'rxjs/operators';
import { ProyectoModel } from '../models/Proyecto.model';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  token: string;

  private url = this.urlService.URL + '/Proyecto';

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.token = localStorage.getItem('Token') || '';
  }

  // ==========================================
  // Cargar Id_Proyecto para guardarlo en LocalStorage
  // ==========================================
  CargarProyectoIdProyecto(Id_Proyecto: number) {
    return this.http
      .get(`${this.url}/ProyectoActual/${Id_Proyecto}`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          if (resp.Proyecto[0].Id_Proyecto) {
            return resp.Proyecto[0];
          } else {
            return 0;
          }
        })
      );
  }

  // // ==========================================
  // // Cargar Información Inicial de Origen para LocalStorage y MenuInformación
  // // ==========================================
  ListaProyectos() {
    return this.http.get(`${this.url}/ListaProyectos`).pipe(
      map((resp: any) => {
        return resp.Proyecto;
      })
    );
  }

  // Guardar Proyecto
  GuardarProyecto(proyecto: ProyectoModel) {
    return this.http.post(`${this.url}`, proyecto).pipe(
      map((resp: any) => {
        proyecto.Id_Proyecto = resp.proyecto._id;

        return proyecto;
      })
    );
  }

  // Actualizar Proyecto
  ActualizarProyecto(proyecto: ProyectoModel) {
    return this.http.put(`${this.url}/${proyecto.Id_Proyecto}`, proyecto).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
}
