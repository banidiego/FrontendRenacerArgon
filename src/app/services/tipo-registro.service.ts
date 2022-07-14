import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { TipoRegistroModel } from '../models/TipoRegistro.model';

@Injectable({
  providedIn: 'root',
})
export class TipoRegistroService {
  private url = this.urlService.URL + '/TipoRegistro';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  crearTipoRegistro(tipoRegistro: TipoRegistroModel) {
    return this.http.post(`${this.url}`, tipoRegistro).pipe(
      map((resp: any) => {
        tipoRegistro.Id_TipoRegistro = resp.Id_TipoDocumentoIdentidad;
        return tipoRegistro;
      })
    );
  }

  actualizarTipoRegistro(tipoRegistro: TipoRegistroModel) {
    return this.http.put(
      `${this.url}/${tipoRegistro.Id_TipoRegistro}`,
      tipoRegistro
    );
  }

  getTipoRegistros() {
    return this.http.get(this.url).pipe(
      map((resp: any) => {
        return resp.TipoRegistros;
      })
    );
  }

  getTipoRegistro(id: string) {
    return this.http.get(`${this.url}/${id}`);
  }

  eliminarTipoRegistro(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
