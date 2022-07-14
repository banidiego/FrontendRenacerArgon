export class DetalleAutorizacionDolaresModel {
  Id_DetalleAutorizacionDolares: any;
  Id_Autorizacion: Number;
  NumeroCheque: String;
  Fecha: Date;
  Responsable: String;
  RUCResponsable: String;
  Descripcion: String;
  MontoDolares: Number;
  TC: Number;
  MontoSoles: Number;
  Id_SR: Number;
  Saldo: Number;
  Agotamiento: Boolean;

  constructor() {
    this.Id_DetalleAutorizacionDolares = null;
    this.Id_Autorizacion = 0;
    this.NumeroCheque = '';
    this.Fecha = new Date();
    this.Responsable = '';
    this.RUCResponsable = '';
    this.Descripcion = '';
    this.MontoDolares = 0;
    this.TC = 0;
    this.MontoSoles = 0;
    this.Id_SR = 0;
    this.Saldo = 0;
    this.Agotamiento = false;
  }
}
