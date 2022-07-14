export class ProyectoModel {
  Id_Proyecto: any;
  Codigo_Proyecto: String;
  Nombre_Proyecto: String;
  Cooperante: String;
  Estado: Boolean;
  Origen: String;
  Serie: String;

  constructor() {
    this.Id_Proyecto = null;
    this.Codigo_Proyecto = '';
    this.Nombre_Proyecto = '';
    this.Cooperante = '';
    this.Estado = false;
    this.Origen = '';
    this.Serie = '';
  }
}
