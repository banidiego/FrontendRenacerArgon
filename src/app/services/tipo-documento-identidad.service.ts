import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { TipoDocumentoIdentidadModel } from '../models/TipoDocumentoIdentidad.model';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoIdentidadService {
  private url = this.urlService.URL + '/TipoDocumentoIdentidad';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  crearTipoDocumentoIdentidad(
    tipoDocumentoIdentidad: TipoDocumentoIdentidadModel
  ) {
    return this.http.post(`${this.url}`, tipoDocumentoIdentidad).pipe(
      map((resp: any) => {
        tipoDocumentoIdentidad.Id_TipoDocumentoIdentidad =
          resp.Id_TipoDocumentoIdentidad;
        return tipoDocumentoIdentidad;
      })
    );
  }

  actualizarTipoDocumentoIdentidad(
    tipoDocumentoIdentidad: TipoDocumentoIdentidadModel
  ) {
    return this.http.put(
      `${this.url}/${tipoDocumentoIdentidad.Id_TipoDocumentoIdentidad}`,
      tipoDocumentoIdentidad
    );
  }

  getTipoDocumentoIdentidades() {
    return this.http.get(this.url);
  }

  getTipoDocumentoIdentidad(id: string) {
    return this.http.get(`${this.url}/${id}`);
  }

  eliminarTipoDocumentoIdentidad(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
