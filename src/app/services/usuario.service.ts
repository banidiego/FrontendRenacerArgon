import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UrlService } from './url.service';

import { UsuarioModel } from '../models/Usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = this.urlService.URL + '/Usuario';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  crearUsuario(usuario: UsuarioModel) {
    return this.http.post(`${this.url}`, usuario).pipe(
      map((resp: any) => {
        usuario.Id_Usuario = resp.Id_Usuario;
        return usuario;
      })
    );
  }

  actualizarUsuario(usuario: UsuarioModel) {
    return this.http.put(`${this.url}/${usuario.Id_Usuario}`, usuario);
  }

  getUsuarios() {
    return this.http.get(this.url).pipe(
      map((resp: any) => {
        return resp.Usuarios;
      })
    );
  }

  getUsuario(id: number) {
    return this.http.get(`${this.url}/${id}`).pipe(
      map((resp: any) => {
        return resp.Usuario[0];
      })
    );
  }

  eliminarUsuario(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
