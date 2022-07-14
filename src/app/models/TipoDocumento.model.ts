export class TipoDocumentoModel {
  Id_TipoDocumento: any;
  Codigo_TipoDocumento: String;
  Descripcion: String;
  Codigo_TipoRegistro: string;
  Activo: boolean;

  constructor() {
    this.Id_TipoDocumento = null;
    this.Codigo_TipoDocumento = '';
    this.Descripcion = '';
    this.Codigo_TipoRegistro = '';
    this.Activo = true;
  }
}
