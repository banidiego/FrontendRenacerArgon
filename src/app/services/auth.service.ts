import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UrlService } from './url.service';
import { Observable, of } from 'rxjs';
import { VariablesSesionModel } from '../models/VariablesSesion.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = this.urlService.URL + '/Auth';

  VariablesSesion: VariablesSesionModel;

  constructor(private http: HttpClient, private urlService: UrlService) {}

  Login(DatosSesion: any) {
    return this.http.post(`${this.url}`, DatosSesion).pipe(
      map((resp: any) => {
        this.VariablesSesion = {
          Id_Usuario: resp.Usuario[0].Id_Usuario,
          Nombres: resp.Usuario[0].Nombres,
          Imagen: resp.Usuario[0].Imagen,
          Id_TipoUsuario: resp.Usuario[0].Id_TipoUsuario,
          Token: resp.token,
        };

        localStorage.setItem(
          'VariablesSesion',
          JSON.stringify(this.VariablesSesion)
        );

        return resp;
      })
    );
  }

  ValidarToken(): Observable<boolean> {
    const token = this.VariablesSesion.Token || '';

    return this.http
      .get(`${this.url}/RenewToken`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        map((resp: any) => {
          localStorage.setItem('Token', resp.token);
          return true;
        }),
        catchError((error) => of(false))
      );
  }
}
