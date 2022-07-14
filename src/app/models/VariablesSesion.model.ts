export class VariablesSesionModel {
  Id_Usuario: any;
  Nombres: string;
  Imagen: string;
  Id_TipoUsuario: number;
  Token: string;

  constructor() {
    this.Id_Usuario = null;
    this.Nombres = '';
    this.Imagen = '';
    this.Id_TipoUsuario = 0;
    this.Token = '';
  }
}
