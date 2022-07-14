import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { DetalleSRModel } from '../models/DetalleSR.model';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DetalleSrService {
  private url = this.urlService.URL + '/DetalleSR';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  // Guardar DetalleSR
  GuardarDetalleSR(Detallesr: DetalleSRModel) {
    return this.http.post(`${this.url}`, Detallesr).pipe(
      map((resp: any) => {
        Detallesr.Id_DetalleSR = resp.DetalleSR._id;

        return Detallesr;
      })
    );
  }

  // Actualizar DetalleSR
  ActualizarDetalleSR(Detallesr: DetalleSRModel) {
    return this.http
      .put(`${this.url}/${Detallesr.Id_DetalleSR}`, Detallesr)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  EliminarDetalleSR(Id_DetalleSR: number) {
    return this.http.delete(`${this.url}/${Id_DetalleSR}`).pipe(
      map((resp) => {
        swal.fire(
          'Registro Eliminado',
          'El Registro se eliminó correctamente',
          'success'
        );
        return resp;
      })
    );
  }

  // Carga Tabla
  ListaDetalleSRIdSR(Id_SR: number) {
    return this.http.get(`${this.url}/ListaDetalleSR/${Id_SR}`).pipe(
      map((resp: any) => {
        return resp.DetalleSR;
      })
    );
  }

  // Carga Datos DetalleSR
  ListaDetalleSRIdDetalleSR(Id_SR: number) {
    return this.http.get(`${this.url}/DetalleSR/${Id_SR}`).pipe(
      map((resp: any) => {
        return resp.DetalleSR[0];
      })
    );
  }

  // Totales de DetalleSR por SR
  SumaTotales(Id_SR: number) {
    return this.http.get(`${this.url}/Totales/${Id_SR}`).pipe(
      map((resp: any) => {
        return resp.Totales[0];
      })
    );
  }
}
