export class UsuarioModel {
  Id_Usuario: any;
  Usuario: string;
  Email: string;
  Password: string;
  Nombres: string;
  Imagen: string;
  Id_TipoUsuario: number;

  constructor() {
    this.Id_Usuario = null;
    this.Usuario = '';
    this.Password = '';
    this.Nombres = '';
    this.Email = '';
    this.Imagen = '';
    this.Id_TipoUsuario = 0;
  }
}
