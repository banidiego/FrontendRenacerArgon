export class TipoDocumentoIdentidadModel {
  Id_TipoDocumentoIdentidad: any;
  Codigo_TipoDocumentoIdentidad: String;
  Descripcion: String;
  Activo: boolean;

  constructor() {
    this.Id_TipoDocumentoIdentidad = null;
    this.Codigo_TipoDocumentoIdentidad = '';
    this.Descripcion = '';
    this.Activo = true;
  }
}
