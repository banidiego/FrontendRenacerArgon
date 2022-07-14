export class VariablesSistemaModel {
  NombreProyecto: string;
  Origen: string;
  Indice: string;
  Ano: number;
  Mes: string;
  Id_Proyecto: number;

  constructor() {
    this.NombreProyecto = '';
    this.Origen = '';
    this.Indice = '';
    this.Ano = 0;
    this.Mes = '';
    this.Id_Proyecto = 0;
  }
}
