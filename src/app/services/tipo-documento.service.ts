import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { TipoDocumentoModel } from '../models/TipoDocumento.model';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  private url = this.urlService.URL + '/TipoComprobante';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  crearTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.http.post(`${this.url}`, tipoDocumento).pipe(
      map((resp: any) => {
        tipoDocumento.Id_TipoDocumento = resp.Id_TipoDocumento;
        return tipoDocumento;
      })
    );
  }

  actualizarTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.http.put(
      `${this.url}/${tipoDocumento.Id_TipoDocumento}`,
      tipoDocumento
    );
  }

  getTipoDocumentos() {
    return this.http.get(this.url).pipe(
      map((resp: any) => {
        return resp.TipoComprobantes;
      })
    );
  }

  getTipoDocumento(id: string) {
    return this.http.get(`${this.url}/${id}`);
  }

  eliminarTipoDocumento(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  FiltrarTipoDocumentoPorCodigo(Codigo_TipoDocumento) {
    return this.http
      .get(`${this.url}/FiltrarTipoDocumento/${Codigo_TipoDocumento}`)
      .pipe(
        map((resp: any) => {
          return resp.TipoDocumento[0];
        })
      );
  }
}
