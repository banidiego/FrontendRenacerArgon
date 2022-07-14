import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { UrlService } from './url.service';
import { PlanContableModel } from '../models/PlanContable.model';

@Injectable({
  providedIn: 'root',
})
export class PlanContableService {
  private url = this.urlService.URL + '/PlanContable';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  ListaPlanContable(Ano: number) {
    return this.http.get(`${this.url}/Lista/${Ano}`).pipe(
      map((resp: any) => {
        return resp.PlanContable;
      })
    );
  }

  ListaPlanContableTodo(Ano: number) {
    return this.http.get(`${this.url}/ListaTodo/${Ano}`).pipe(
      map((resp: any) => {
        return resp.PlanContable;
      })
    );
  }

  FiltrarPlanContablePorCodigo(Codigo_PlanCuenta: string, Ano: number) {
    return this.http
      .get(`${this.url}/FiltrarCodigo/${Codigo_PlanCuenta}/${Ano}`)
      .pipe(
        map((resp: any) => {
          return resp.PlanContable[0];
        })
      );
  }

  // Guardar CuentaContable
  GuardarCuenta(PlanContable: PlanContableModel) {
    return this.http.post(`${this.url}`, PlanContable).pipe(
      map((resp: any) => {
        // console.log(resp);
        return resp.PlanContable;
      })
    );
  }

  // Actualizar CuentaContable
  ActualizarCuenta(PlanContable: PlanContableModel) {
    // console.log(sr);
    return this.http
      .put(`${this.url}/${PlanContable.Id_PlanContable}`, PlanContable)
      .pipe(
        map((resp: any) => {
          return resp.PlanContable;
        })
      );
  }

  eliminarAuxiliar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // ==========================================
  // Actualizar LibroDiarioSimplificado por Id_OperacionPrincipal
  // ==========================================
  ActualizarValoresPlanContable(Ano: number) {
    return this.http
      .get(`${this.url}/ActualizarValoresPlanContable/${Ano}`)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
