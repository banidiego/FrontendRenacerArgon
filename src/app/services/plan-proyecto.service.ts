import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UrlService } from './url.service';
import { PlanProyectoModel } from '../models/PlanProyecto.model';
import Swal from 'sweetalert2';

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

  ListaPlanProyectosTodo(Ano: number, Id_Proyecto: number) {
    return this.http.get(`${this.url}/Todos/${Ano}/${Id_Proyecto}`).pipe(
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

  // ==========================================
  // Cargar PlanProyecto por Id_PlanProyecto
  // ==========================================
  CargarPlanProyectoIdProyecto(Id_PlanProyecto: number) {
    return this.http
      .get(`${this.url}/PlanProyectoIdProyecto/${Id_PlanProyecto}`)
      .pipe(
        map((resp: any) => {
          return resp.PlanProyecto[0];
        })
      );
  }

  // Guardar Proyecto
  GuardarPlanProyecto(PlanProyecto: PlanProyectoModel) {
    return this.http.post(`${this.url}`, PlanProyecto).pipe(
      map((resp: any) => {
        PlanProyecto.Id_PlanProyecto = resp.PlanProyecto._id;

        return PlanProyecto;
      })
    );
  }

  // Actualizar Proyecto
  ActualizarPlanProyecto(PlanProyecto: PlanProyectoModel) {
    return this.http
      .put(`${this.url}/${PlanProyecto.Id_PlanProyecto}`, PlanProyecto)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  EliminarPlanProyecto(Id_PlanProyecto: number) {
    return this.http.delete(`${this.url}/${Id_PlanProyecto}`).pipe(
      map((resp) => {
        Swal.fire(
          'Eliminado!',
          'Registro se eliminó correctamente!',
          'success'
        );
        return resp;
      })
    );
  }
}
