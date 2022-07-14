import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { MedioPagoModel } from '../models/MedioPago.model';

@Injectable({
  providedIn: 'root',
})
export class MedioPagoService {
  private url = this.urlService.URL + '/MedioPago';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  crearMedioPago(medioPago: MedioPagoModel) {
    return this.http.post(`${this.url}`, medioPago).pipe(
      map((resp: any) => {
        medioPago.Id_MedioPago = resp.Id_TipoDocumentoIdentidad;
        return medioPago;
      })
    );
  }

  actualizarMedioPago(medioPago: MedioPagoModel) {
    return this.http.put(`${this.url}/${medioPago.Id_MedioPago}`, medioPago);
  }

  getMedioPagos() {
    return this.http.get(this.url).pipe(
      map((resp: any) => {
        return resp.MedioPagos;
      })
    );
  }

  getMedioPago(id: string) {
    return this.http.get(`${this.url}/${id}`);
  }

  eliminarMedioPago(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
