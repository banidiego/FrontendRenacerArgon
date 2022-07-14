export class OrigenModel {
  Id_Origen: any;
  Codigo_Origen: string;
  Descripcion: string;
  Codigo_PlanContable: string;
  Origen: string;
  Nombre: string;
  Ano: number;
  Autorizacion: number;
  Indice: string;

  constructor() {
    this.Id_Origen = null;
    this.Codigo_Origen = '';
    this.Descripcion = '';
    this.Codigo_PlanContable = '';
    this.Origen = '';
    this.Nombre = '';
    this.Ano = 0;
    this.Autorizacion = 0;
    this.Indice = '';
  }
}
