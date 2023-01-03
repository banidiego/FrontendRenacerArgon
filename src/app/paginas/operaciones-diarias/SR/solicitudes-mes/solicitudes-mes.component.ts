import { Component, OnInit, OnDestroy } from '@angular/core';
import { SRModel } from '../../../../models/SR.model';
import { Subscription } from 'rxjs';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { SrService } from '../../../../services/sr.service';
export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-solicitudes-mes',
  templateUrl: './solicitudes-mes.component.html',
  styleUrls: ['./solicitudes-mes.component.scss'],
})
export class SolicitudesMesComponent implements OnInit, OnDestroy {
  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Datos: SRModel[] = [];
  dataSource: any;
  Subscripcion: Subscription;
  VariablesSistema = new VariablesSistemaModel();

  // Tablas
  entries = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  columns = [
    { name: 'Codigo', prop: 'codigo' },
    { name: 'Descripcion', prop: 'descripcion' },
    { name: 'Actions', prop: 'actions' },
  ];

  SelectionType = SelectionType;

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

  // ==========================================
  // Función para Cargar Tabla - Desde Origen
  // ==========================================
  // tslint:disable-next-line: variable-name
  CargarTabla(Ano: number, Mes: string, Id_Proyecto: number) {
    this.srService
      .ListaSolicitudesMes(Ano, Mes, Id_Proyecto)
      .subscribe((datos: any) => {
        this.Datos = datos.reverse();

        this.temp = this.Datos.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      });
  }

  // ==========================================
  // Destruir (Unsubscribe) el Observable al salir
  // ==========================================
  ngOnDestroy(): void {
    this.Subscripcion.unsubscribe();
  }

  // ==========================================
  // Filtrar búsqueda en la tabla
  // ==========================================
  filterBuscarRendicion($event) {
    const val = $event.target.value.toLowerCase();
    this.temp = this.Datos.filter((d: any) => {
      for (const key in d) {
        if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
}
