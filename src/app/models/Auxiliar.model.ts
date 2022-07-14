export class AuxiliarModel {
  Id_Auxiliar: any;
  RUC: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Nombres: string;
  RazonSocial: string;
  Direccion: string;
  Codigo_TipoDocumentoIdentidad: string;
  constructor() {
    this.Id_Auxiliar = 1;
    this.RUC = '';
    this.ApellidoPaterno = '';
    this.ApellidoMaterno = '';
    this.Nombres = '';
    this.RazonSocial = '';
    this.Direccion = '';
    this.Codigo_TipoDocumentoIdentidad = '';
  }
}
