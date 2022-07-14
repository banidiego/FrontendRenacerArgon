import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { map } from 'rxjs/operators';

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
  // InformacionInicialOrigen(Ano: number) {
  //   return this.http.get(`${this.url}/MenuInformacion/${Ano}`).pipe(
  //     map((resp: any) => {
  //       return resp.Lista;
  //     })
  //   );
  // }

  // // ==========================================
  // // Busca El Indice del Origen para Menu Información
  // // ==========================================
  // CambiarIndice(Ano: number, Nombre: string) {
  //   return this.http.get(`${this.url}/DatosMenuInformacion/${Ano}/${Nombre}`);
  // }

  // // ==========================================
  // // Busca El Nombre del Origen para El Título de Movimientos del Mes
  // // ==========================================
  // NombreOrigen(TipoOrigen: string, Origen: string, Ano: number) {
  //   return this.http.get(
  //     `${this.url}/NombreOrigen/${TipoOrigen}/${Origen}/${Ano}`
  //   );
  // }
}
