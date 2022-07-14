export class AutorizacionModel {
  Id_Autorizacion: any;
  Tipo: Number;
  Numero: Number;
  ResponsableAutorizacion: String;
  RUCResponsable: String;
  Fecha: Date;
  ResponsableGiro: String;
  RUCGiro: String;
  ChequeDolares: String;
  ChequeSoles: String;
  TC: Number;
  ImporteSoles: Number;
  ImporteDolares: Number;
  Mes: String;
  Ano: Number;
  Id_Proyecto: number;
  Anulado: Boolean;

  constructor() {
    this.Id_Autorizacion = null;
    this.Tipo = 0;
    this.Numero = 0;
    this.ResponsableAutorizacion = '';
    this.RUCResponsable = '';
    this.Fecha = new Date();
    this.ResponsableGiro = '';
    this.RUCGiro = '';
    this.ChequeDolares = '';
    this.ChequeSoles = '';
    this.TC = 0;
    this.ImporteSoles = 0;
    this.ImporteDolares = 0;
    this.Mes = '';
    this.Ano = 0;
    this.Id_Proyecto = 0;
    this.Anulado = false;
  }
}
