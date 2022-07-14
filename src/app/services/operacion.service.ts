import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { UrlService } from './url.service';
import { OperacionModel } from '../models/Operacion.model';

@Injectable({
  providedIn: 'root',
})
export class OperacionService {
  private url = this.urlService.URL + '/Operacion';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  ListaOperacionesIdOperacionPrincipal(Id_OperacionPrincipal: number) {
    return this.http.get(`${this.url}/Asiento/${Id_OperacionPrincipal}`).pipe(
      map((resp: any) => {
        return resp.operaciones;
      })
    );
  }

  ListaOperacionesIdDetalleSRRegistroGasto(Id_DetalleSR: number) {
    return this.http.get(`${this.url}/RegistroGasto/${Id_DetalleSR}`).pipe(
      map((resp: any) => {
        return resp.operaciones;
      })
    );
  }

  ListaOperacionesIdSR(Id_SR: number) {
    return this.http.get(`${this.url}/SR/${Id_SR}`).pipe(
      map((resp: any) => {
        return resp.SR[0];
      })
    );
  }

  SRTipo3(Id_SR: number) {
    return this.http.get(`${this.url}/SRTipo3/${Id_SR}`).pipe(
      map((resp: any) => {
        return resp.SR[0];
      })
    );
  }

  GuardarOperacion(operacion: OperacionModel) {
    return this.http.post(`${this.url}`, operacion).pipe(
      map((resp: any) => {
        Swal.fire('Guardado!', 'Registro guardado correctamente!', 'success');
        return resp.Operacion;
      })
    );
  }

  ActualizarOperacion(operacion: OperacionModel) {
    // // Transformamos la Fecha en Texto
    // operacion.FechaOperacionTexto = this.formatearFecha(
    //   operacion.FechaOperacion
    // );
    // operacion.FechaComprobanteTexto = this.formatearFecha(
    //   operacion.FechaComprobante
    // );
    return this.http
      .put(`${this.url}/${operacion.Id_Operacion}`, operacion)
      .pipe(
        map((resp: any) => {
          Swal.fire(
            'Modificado!',
            'Registro modificado correctamente!',
            'success'
          );
          return resp;
        })
      );
  }

  EliminarOperacion(Id_Operacion: number) {
    return this.http.delete(`${this.url}/${Id_Operacion}`).pipe(
      map((resp) => {
        Swal.fire(
          'Eliminado!',
          'Registro se eliminó correctamente!',
          'success'
        );
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
