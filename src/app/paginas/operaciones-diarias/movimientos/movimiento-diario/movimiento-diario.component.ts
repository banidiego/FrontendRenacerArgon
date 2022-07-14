import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { OrigenService } from '../../../../services/origen.service';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { Router } from '@angular/router';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-movimiento-diario',
  templateUrl: './movimiento-diario.component.html',
  styleUrls: ['./movimiento-diario.component.scss'],
})
export class MovimientoDiarioComponent implements OnInit, OnDestroy {
  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Subscripcion: Subscription;
  Datos: any[] = [];
  // Definiendo el Objeto que obtendra todas las variables de Sesión
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
    private origenService: OrigenService,
    private variablesGlobalesService: VariablesGlobalesService,
    private route: Router
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
              this.VariablesSistema.Indice
            );
          }
        },
        (error) => console.log(error)
      );

    this.CargarTabla(this.VariablesSistema.Ano, this.VariablesSistema.Indice);
  }

  // Funciones de Tabla
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    const val = $event.target.value;
    this.temp = this.Datos.filter((d: any) => {
      for (const key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  // Fin de funciones de tabla

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
  // Cargar Tabla de Registro de Gastos
  // ==========================================
  CargarTabla(Ano: number, Indice: string) {
    this.origenService
      .MovimientoDiarioAnoIndice(Ano, Indice)
      .subscribe((datos) => {
        this.Datos = datos;

        this.temp = this.Datos.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      });
  }

  // tslint:disable-next-line: variable-name
  AbrirAsientosMes(Codigo_Origen: string) {
    this.route.navigate([
      '/Administrador/OperacionesDiarias/MovimientoDiario/',
      Codigo_Origen,
    ]);
  }

  // ==========================================
  // Función que Desubscribe del Observable
  // ==========================================
  ngOnDestroy(): void {
    this.Subscripcion.unsubscribe();
  }
}
