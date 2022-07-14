import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class ReportesGlobalesService {
  private url = this.urlService.URL + '/ReportesGlobales';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  // Informacion de Inicio - Tarjetas
  InfoInicio(Ano: number, Id_Proyecto: number) {
    return this.http.get(`${this.url}/InfoInicio/${Ano}/${Id_Proyecto}`).pipe(
      map((resp: any) => {
        return resp.Reportes[0][0];
      })
    );
  }

  // Listado de Asientos no Cuadrados para Menu Inicio
  ListaAsientosNoCuadrados(Ano: number, Id_Proyecto: number) {
    return this.http
      .get(`${this.url}/ListaAsientosNoCuadrados/${Ano}/${Id_Proyecto}`)
      .pipe(
        map((resp: any) => {
          return resp.Lista;
        })
      );
  }
}
