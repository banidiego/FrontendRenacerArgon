import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';

import { UrlService } from './url.service';
import { AuxiliarModel } from '../models/Auxiliar.model';
import Swal from 'sweetalert2';
import { empty } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuxiliarService {
  private url = this.urlService.URL + '/Auxiliar';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  BuscarAuxiliarSUNAT(id: string) {
    const longitud = id.length;

    if (longitud === 8) {
      // console.log('DNI');
      return this.http
        .get(
          `https://dniruc.apisperu.com/api/v1/dni/${id}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJhbmlkaWVnb0BnbWFpbC5jb20ifQ.rF5QUaXQhaHC31-DdfcxwtbWpgojNT6o91zGtDhqn7M`
        )
        .pipe(
          map((resp: any) => {
            return {
              RUC: resp.dni,
              ApellidoPaterno: resp.apellidoPaterno,
              ApellidoMaterno: resp.apellidoMaterno,
              Nombres: resp.nombres,
              RazonSocial:
                resp.apellidoPaterno +
                ' ' +
                resp.apellidoMaterno +
                ', ' +
                resp.nombres,
              Direccion: '',
              Codigo_TipoDocumentoIdentidad: 1,
            };
          })
        );
    } else if (longitud === 11) {
      // console.log('RUC');
      return this.http
        .get(
          `https://dniruc.apisperu.com/api/v1/ruc/${id}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJhbmlkaWVnb0BnbWFpbC5jb20ifQ.rF5QUaXQhaHC31-DdfcxwtbWpgojNT6o91zGtDhqn7M`
        )
        .pipe(
          map((resp: any) => {
            return {
              RUC: resp.ruc,
              ApellidoPaterno: '',
              ApellidoMaterno: '',
              Nombres: '',
              RazonSocial: resp.razonSocial,
              Direccion: resp.direccion,
              Codigo_TipoDocumentoIdentidad: 6,
            };
          }),
          catchError((err) => {
            Swal.fire(
              'Error al buscar',
              'No se encontró el Auxiliar en la Base de Datos SUNAT',
              'error'
            );
            // tslint:disable-next-line: deprecation
            return empty();
          })
        );
    } else {
      return this.http.get(`${this.url}/FiltrarRUC/${id}`).pipe(
        map((resp: any) => {
          // console.log('No existe');

          return resp.Auxiliar;
        })
      );
    }
  }

  crearAuxiliar(auxiliar: AuxiliarModel) {
    return this.http.post(`${this.url}`, auxiliar).pipe(
      map((resp: any) => {
        auxiliar.Id_Auxiliar = resp.Id_Auxiliar;
        return auxiliar;
      })
    );
  }

  actualizarAuxiliar(auxiliar: AuxiliarModel) {
    return this.http.put(`${this.url}/${auxiliar.Id_Auxiliar}`, auxiliar);
  }

  getAuxiliares() {
    return this.http.get(this.url).pipe(
      map((resp: any) => {
        return resp.auxiliares;
      })
    );
  }

  getAuxiliar(id: number) {
    return this.http.get(`${this.url}/${id}`).pipe(
      map((resp: any) => {
        return resp.auxiliar[0];
      })
    );
  }

  eliminarAuxiliar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  FiltrarAuxiliarRUC(RUC: string) {
    return this.http.get(`${this.url}/FiltrarRUC/${RUC}`).pipe(
      map((resp: any) => {
        return resp.Auxiliar[0];
      })
    );
  }

  FiltrarAuxiliarRazonSocial(RazonSocial: string) {
    return this.http.get(`${this.url}/FiltrarRazonSocial/${RazonSocial}`).pipe(
      map((resp: any) => {
        return resp.Auxiliar[0];
      })
    );
  }
}
