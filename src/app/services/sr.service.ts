import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { SRModel } from '../models/SR.model';

@Injectable({
  providedIn: 'root',
})
export class SrService {
  private url = this.urlService.URL + '/SR';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  // Lista de Solicitudes del Mes
  ListaSolicitudesMes(Ano: number, Mes: String, Id_Proyecto: number) {
    return this.http
      .get(`${this.url}/SolicitudesMes/${Ano}/${Mes}/${Id_Proyecto}`)
      .pipe(
        map((resp: any) => {
          return resp.Solicitudes;
        })
      );
  }

  // Lista de Solicitudes por Rendir - Para Inicio
  SolicitudesRendir(Id_Proyecto: number) {
    return this.http.get(`${this.url}/SolicitudesRendir/${Id_Proyecto}`).pipe(
      map((resp: any) => {
        return resp.Solicitudes;
      })
    );
  }

  // Numero máximo para generar Numero de Solicitud
  MaximoNumeroSolicitud(Ano: number, Id_Proyecto: number) {
    return this.http
      .get(`${this.url}/NumeroSolicitud/${Ano}/${Id_Proyecto}`)
      .pipe(
        map((resp: any) => {
          if (resp.Numero.length > 0) {
            return resp.Numero[0].Maximo + 1;
          } else {
            return 1;
          }
        })
      );
  }

  // Guardar SR
  GuardarSR(sr: SRModel) {
    return this.http.post(`${this.url}`, sr).pipe(
      map((resp: any) => {
        // console.log(resp);
        return resp.SR;
      })
    );
  }

  // Actualizar SR
  ActualizarSR(sr: SRModel) {
    return this.http.put(`${this.url}/${sr.Id_SR}`, sr).pipe(
      map((resp: any) => {
        return resp.SR;
      })
    );
  }

  // Busca la Información del SR a través del Id_SR
  getSR(id: number) {
    return this.http.get(`${this.url}/${id}`).pipe(
      map((resp: any) => {
        return resp.SR[0];
      })
    );
  }

  // Busca la Información del SR a través del Id_SR
  SolicitudesTodo() {
    return this.http.get(`${this.url}/`).pipe(
      map((resp: any) => {
        return resp.Solicitudes;
      })
    );
  }

  // ==========================================
  // Funcion que Convierte la Fecha Javascript en Fecha Mysql (String)
  // ==========================================
  formatearFecha(date: Date) {
    // tslint:disable-next-line: prefer-const
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      // tslint:disable-next-line: prefer-const
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
