export class OperacionModel {
  Id_Operacion: any;
  Id_OperacionPrincipal: number;
  TipoOrigen: string;
  CodigoOperacion: string;
  DescripcionOperacion: string;
  FechaOperacion: Date;
  ResponsableGiro: string;
  RUCResponsableGiro: string;
  Solicitud: number;
  TipoSR: number;
  Id_SR: number;
  Id_DetalleSR: number;
  DescripcionDetalle: string;
  TC: number;
  Codigo_MedioPago: string;
  ChequeSoles: string;
  ChequeDolares: string;
  Codigo_TipoDocumento: string;
  Codigo_TipoRegistro: string;
  SerieComprobante: string;
  NumeroComprobante: string;
  FechaComprobante: Date;
  RUCAuxiliar: string;
  RazonSocial: string;
  Codigo_TipoDocumentoIdentidad: string;
  Codigo_PlanProyecto: string;
  Codigo_PlanCuenta: string;
  Nombre_PlanCuenta: string;
  MontoSoles: number;
  MontoDolares: number;
  DebeSoles: number;
  HaberSoles: number;
  DebeDolares: number;
  HaberDolares: number;
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  C5: number;
  C6: number;
  C7: number;
  C8: number;
  C9: number;
  C10: number;
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  Mes: string;
  Ano: number;
  Id_Proyecto: number;
  Anulado: Boolean;
  Saldo: number;
  CuentaPendiente: number;
  TipoSaldo: number;
  Cerrado: boolean;

  constructor() {
    this.Id_Operacion = null;
    this.Id_OperacionPrincipal = 0;
    this.TipoOrigen = '';
    this.CodigoOperacion = '';
    this.DescripcionOperacion = '';
    this.FechaOperacion = new Date();
    this.ResponsableGiro = '';
    this.RUCResponsableGiro = '';
    this.Solicitud = 0;
    this.TipoSR = 0;
    this.Id_SR = 0;
    this.Id_DetalleSR = 0;
    this.DescripcionDetalle = '';
    this.TC = 0;
    this.Codigo_MedioPago = '';
    this.ChequeSoles = '';
    this.ChequeDolares = '';
    this.Codigo_TipoDocumento = '';
    this.Codigo_TipoRegistro = '';
    this.SerieComprobante = '';
    this.NumeroComprobante = '';
    this.FechaComprobante = new Date();
    this.RUCAuxiliar = '';
    this.RazonSocial = '';
    this.Codigo_TipoDocumentoIdentidad = '';
    this.Codigo_PlanProyecto = '';
    this.Codigo_PlanCuenta = '';
    this.Nombre_PlanCuenta = '';
    this.MontoSoles = 0;
    this.MontoDolares = 0;
    this.DebeSoles = 0;
    this.HaberSoles = 0;
    this.DebeDolares = 0;
    this.HaberDolares = 0;
    this.C1 = 0;
    this.C2 = 0;
    this.C3 = 0;
    this.C4 = 0;
    this.C5 = 0;
    this.C6 = 0;
    this.C7 = 0;
    this.C8 = 0;
    this.C9 = 0;
    this.C10 = 0;
    this.V1 = 0;
    this.V2 = 0;
    this.V3 = 0;
    this.V4 = 0;
    this.V5 = 0;
    this.V6 = 0;
    this.V7 = 0;
    this.Mes = '';
    this.Ano = 0;
    this.Id_Proyecto = 0;
    this.Anulado = false;
    this.Saldo = 0;
    this.CuentaPendiente = 0;
    this.TipoSaldo = 0;
    this.Cerrado = false;
  }
}
