import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrigenService {
  token: string;

  private url = this.urlService.URL + '/Origen';

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.token = localStorage.getItem('Token') || '';
  }

  // ==========================================
  // Lista de Movimiento Diario (Para Tabla Movimiento Diario)
  // ==========================================
  MovimientoDiarioAnoIndice(Ano: number, Indice: string) {
    return this.http
      .get(`${this.url}/OrigenAnoIndice/${Ano}/${Indice}`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          return resp.Origen;
        })
      );
  }

  // ==========================================
  // Cargar Información Inicial de Origen para LocalStorage y MenuInformación
  // ==========================================
  InformacionInicialOrigen(Ano: number) {
    return this.http.get(`${this.url}/MenuInformacion/${Ano}`).pipe(
      map((resp: any) => {
        return resp.Lista;
      })
    );
  }

  // ==========================================
  // Busca El Indice del Origen para Menu Información
  // ==========================================
  CambiarIndice(Ano: number, Nombre: string) {
    return this.http.get(`${this.url}/DatosMenuInformacion/${Ano}/${Nombre}`);
  }

  // ==========================================
  // Busca El Nombre del Origen para El Título de Movimientos del Mes
  // ==========================================
  NombreOrigen(TipoOrigen: string, Origen: string, Ano: number) {
    return this.http.get(
      `${this.url}/NombreOrigen/${TipoOrigen}/${Origen}/${Ano}`
    );
  }

  // ==========================================
  // Devuelve el Listado de Origenes para Solicitud
  // ==========================================
  ListadoOrigenIdProyecto(Ano: number, Id_Proyecto: number) {
    return this.http
      .get(`${this.url}/OrigenAnoIdProyecto/${Ano}/${Id_Proyecto}`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          return resp.Origen;
        })
      );
  }
}
