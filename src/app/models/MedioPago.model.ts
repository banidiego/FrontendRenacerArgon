export class MedioPagoModel {
  Id_MedioPago: any;
  Codigo_MedioPago: string;
  Descripcion: string;
  Activo: boolean;

  constructor() {
    this.Id_MedioPago = null;
    this.Codigo_MedioPago = '';
    this.Descripcion = '';
    this.Activo = true;
  }
}
