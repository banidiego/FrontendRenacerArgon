import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { DatosOrganizacionModel } from '../models/DatosOrganizacion.model';

@Injectable({
  providedIn: 'root',
})
export class DatosOrganizacionService {
  private url = this.urlService.URL + '/DatosOrganizacion';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  // ==========================================
  // Cargar Datos de Organizacion
  // ==========================================
  CargarDatosOrganizacion(Codigo_TipoDocumento) {
    return this.http
      .get(`${this.url}/CargarDatosOrganizacion/${Codigo_TipoDocumento}`)
      .pipe(
        map((resp: any) => {
          return resp.DatosOrganizacion[0];
        })
      );
  }

  // ==========================================
  // Actualizar Datos de la Organización
  // ==========================================
  ActualizarDatosOrganizacion(datosOrganizacion: DatosOrganizacionModel) {
    return this.http
      .put(
        `${this.url}/${datosOrganizacion.Id_DatosOrganizacion}`,
        datosOrganizacion
      )
      .pipe(
        map((resp: any) => {
          return resp.DatosOrganizacion;
        })
      );
  }
}
