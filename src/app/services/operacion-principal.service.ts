import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

import { map } from 'rxjs/operators';
import { UrlService } from './url.service';
import { OperacionPrincipalModel } from '../models/OperacionPrincipal.model';

@Injectable({
  providedIn: 'root',
})
export class OperacionPrincipalService {
  private url = this.urlService.URL + '/OperacionPrincipal';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  GuardarOperacionPrincipal(operacionPrincipal: OperacionPrincipalModel) {
    // Transformamos la Fecha en Texto =======================================> Para Chequear
    // operacionPrincipal.FechaOperacionTexto = this.formatearFecha(
    //   operacionPrincipal.FechaOperacion
    // );

    return this.http.post(`${this.url}`, operacionPrincipal).pipe(
      map((resp: any) => {
        Swal.fire('Guardado!', 'Registro guardado', 'success');

        return resp.OperacionPrincipal;
      })
    );
  }

  ActualizarOperacionPrincipal(operacionPrincipal: OperacionPrincipalModel) {
    // Transformamos la Fecha en Texto  =======================================> Para Chequear
    // operacionPrincipal.FechaOperacionTexto = this.formatearFecha(
    //   operacionPrincipal.FechaOperacion

    // );
    return this.http
      .put(
        `${this.url}/${operacionPrincipal.Id_OperacionPrincipal}`,
        operacionPrincipal
      )
      .pipe(
        map((resp: any) => {
          // Swal.fire('Modificado!', 'Registro modificado', 'success');
          return resp;
        })
      );
  }

  // ==========================================
  // Cargar Lista de Operaciones Principales del Mes (para la página Movimiento del Mes)
  // ==========================================
  ListaOperacionesPrincipalesMes(
    Ano: number,
    Mes: String,
    TipoOrigen: String,
    Id_proyecto: number
  ) {
    return this.http
      .get(`${this.url}/AsientosMes/${Ano}/${Mes}/${TipoOrigen}/${Id_proyecto}`)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  getOperacionPrincipales() {
    return this.http.get(this.url);
  }

  // Busca la Información de la Operación Principal a través del Id_OperaciónPrincipal
  getOperacionPrincipal(id: number) {
    return this.http.get(`${this.url}/${id}`).pipe(
      map((resp: any) => {
        return resp.OperacionPrincipal[0];
      })
    );
  }

  // Busca la Información de la Operación Principal a través del Id_OperaciónPrincipal
  OperacionesProncipalesNoCuadradas() {
    return this.http.get(`${this.url}/`).pipe(
      map((resp: any) => {
        return resp.OperacionPrincipal;
      })
    );
  }

  eliminarOperacionPrincipal(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Numero máximo para generar CodigoOperacion
  getMaximoNumero(
    Ano: number,
    Mes: string,
    TipoOrigen: string,
    Id_Proyecto: number
  ) {
    return this.http
      .get(
        `${this.url}/NumeroOperacion/${TipoOrigen}/${Ano}/${Mes}/${Id_Proyecto}`
      )
      .pipe(
        map((resp: any) => {
          if (resp.Numero.length > 0) {
            return resp.Numero[0].Maximo + 1;
          } else {
            return 0;
          }
        })
      );
  }

  // ==========================================
  // Actualizar LibroDiarioSimplificado por Id_OperacionPrincipal
  // ==========================================
  ActualizarLibroDiarioSimplificado(Id_OperacionPrincipal: number) {
    return this.http
      .get(
        `${this.url}/ActualizarLibroDiarioSimplificado/${Id_OperacionPrincipal}`
      )
      .pipe(
        map((resp: any) => {
          return resp;
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
