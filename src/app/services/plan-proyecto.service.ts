import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class PlanProyectoService {
  private url = this.urlService.URL + '/PlanProyecto';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  ListaPlanProyectos(Ano: number, Id_Proyecto: number) {
    return this.http.get(`${this.url}/Lista/${Ano}/${Id_Proyecto}`).pipe(
      map((resp: any) => {
        return resp.PlanProyecto;
      })
    );
  }

  // ==========================================
  // Actualizar LibroDiarioSimplificado por Id_OperacionPrincipal
  // ==========================================
  ActualizarValoresPlanProyecto(Id_Proyecto: number, Ano: number) {
    return this.http
      .get(`${this.url}/ActualizarValoresPlanProyecto/${Id_Proyecto}/${Ano}`)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
