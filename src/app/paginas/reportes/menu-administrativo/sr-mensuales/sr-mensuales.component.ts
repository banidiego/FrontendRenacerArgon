import { Component, OnInit, OnDestroy } from '@angular/core';
import { SRModel } from '../../../../models/SR.model';
import { SrService } from '../../../../services/sr.service';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { Subscription } from 'rxjs';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-sr-mensuales',
  templateUrl: './sr-mensuales.component.html',
  styleUrls: ['./sr-mensuales.component.scss'],
})
export class SrMensualesComponent implements OnInit, OnDestroy {
  // Tablas
  entries = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;

  SelectionType = SelectionType;

  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Datos: SRModel[] = [];
  VariablesSistema = new VariablesSistemaModel();
  Subscripcion: Subscription;
  TotalPresupuesto: number;
  TotalRI: number;
  TotalCC: number;
  TotalGasto: number;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private srService: SrService
  ) {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;

    this.Subscripcion = this.variablesGlobalesService
      .VariablesSistemaObservable()
      .pipe()
      .subscribe(
        (salida) => {
          if (this.variablesGlobalesService.VariablesSistema) {
            // Si los Datos Existen
            this.VariablesSistema =
              this.variablesGlobalesService.VariablesSistema;

            this.CargarTabla(
              this.VariablesSistema.Ano,
              this.VariablesSistema.Mes,
              this.VariablesSistema.Id_Proyecto
            );
          }
        },
        (error) => console.log(error)
      );

    this.CargarTabla(
      this.VariablesSistema.Ano,
      this.VariablesSistema.Mes,
      this.VariablesSistema.Id_Proyecto
    );
  }

  ngOnInit(): void {
    this.TemaOscuroNavBar();
  }

  // ==========================================
  // Destruir (Unsubscribe) el Observable al salir
  // ==========================================
  ngOnDestroy(): void {
    this.Subscripcion.unsubscribe();
  }

  TemaOscuroNavBar() {
    const navbar = document.getElementsByClassName('navbar-top')[0];
    navbar.classList.add('bg-secondary');
    navbar.classList.add('navbar-light');
    navbar.classList.remove('bg-danger');
    navbar.classList.remove('navbar-dark');

    const navbarSearch = document.getElementsByClassName('navbar-search')[0];
    navbarSearch.classList.add('navbar-search-dark');
    navbarSearch.classList.remove('navbar-search-light');
  }

  CargarTabla(Ano: number, Mes: string, Id_Proyecto: number) {
    this.srService
      .ListaSolicitudesMes(Ano, Mes, Id_Proyecto)
      .subscribe((datos: any) => {
        this.Datos = datos;

        this.SumaTotales(datos);
        // this.avgAge();

        this.temp = this.Datos.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      });
  }

  // ==========================================
  // Formato CSS de Columnas
  // ==========================================

  ColorPresupuesto({ row, column, value }): any {
    return column.Presupuesto >= 0 ? 'Presupuesto' : 'Presupuesto';
  }

  ColorMontoRICC({ row, column, value }): any {
    return column.MontoRI >= 0 ? 'MontoRICC' : 'MontoRICC';
  }

  ColorGastoTotal({ row, column, value }): any {
    return column.TotalGasto >= 0 ? 'GastoTotal' : 'GastoTotal';
  }

  Centrar({ row, column, value }): any {
    return column.TotalGasto >= 0 ? 'Centrar' : 'Centrar';
  }

  // ==========================================
  // Suma de Totales
  // ==========================================

  SumaTotales(datos: SRModel[]) {
    // console.log(this.Datos);

    this.TotalPresupuesto = datos
      .map((t) => t.Presupuesto)
      .reduce((acc, value) => acc + value, 0);

    this.TotalRI = datos
      .map((t) => t.MontoRI)
      .reduce((acc, value) => acc + value, 0);

    this.TotalCC = datos
      .map((t) => t.MontoCC)
      .reduce((acc, value) => acc + value, 0);

    this.TotalGasto = datos
      .map((t) => t.TotalGasto)
      .reduce((acc, value) => acc + value, 0);
  }

  CrearPDF() {}
}
