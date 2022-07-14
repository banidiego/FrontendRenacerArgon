import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { OrigenService } from '../../../../services/origen.service';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperacionPrincipalService } from '../../../../services/operacion-principal.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-movimiento-mes',
  templateUrl: './movimiento-mes.component.html',
  styleUrls: ['./movimiento-mes.component.scss'],
})
export class MovimientoMesComponent implements OnInit, OnDestroy {
  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Subscripcion: Subscription;
  Datos: any[] = [];
  Titulo: string;
  TipoOrigen: string;
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
    private operacionPrincipalService: OperacionPrincipalService,
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;

    this.Subscripcion = this.variablesGlobalesService
      .VariablesSistemaObservable()
      .pipe()
      // tslint:disable-next-line: deprecation
      .subscribe(
        (salida) => {
          if (this.variablesGlobalesService.VariablesSistema) {
            // Si los Datos Existen
            this.VariablesSistema =
              this.variablesGlobalesService.VariablesSistema;
            this.CargarInformacionURL();
          }
        },
        (error) => console.log(error)
      );

    this.CargarInformacionURL();
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
  // Función para cargar Tabla
  // ==========================================
  CargarTabla(
    Ano: number,
    Mes: string,
    TipoOrigen: string,
    // tslint:disable-next-line: variable-name
    Id_Proyecto: number
  ) {
    this.operacionPrincipalService
      .ListaOperacionesPrincipalesMes(Ano, Mes, TipoOrigen, Id_Proyecto)
      // tslint:disable-next-line: deprecation
      .subscribe((datos: any) => {
        this.Datos = datos.OperacionPrincipal;

        this.temp = this.Datos.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      });
  }

  // ==========================================
  // Cargar TipoOrigen desde URL
  // ==========================================
  CargarInformacionURL() {
    // tslint:disable-next-line: deprecation
    this.router.params.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      this.TipoOrigen = params['TipoOrigen'];

      this.CargarNombreTitulo(
        this.TipoOrigen,
        this.VariablesSistema.Origen,
        this.VariablesSistema.Ano
      );
      this.CargarTabla(
        this.VariablesSistema.Ano,
        this.VariablesSistema.Mes,
        this.TipoOrigen,
        this.VariablesSistema.Id_Proyecto
      );
    });
  }

  // ==========================================
  // Función que Busca Nombre de Origen para Agregar el Título
  // ==========================================
  CargarNombreTitulo(TipoOrigen: string, Origen: string, Ano: number) {
    this.origenService
      .NombreOrigen(TipoOrigen, Origen, Ano)
      // tslint:disable-next-line: deprecation
      .subscribe((datos: any) => {
        this.Titulo = datos.Origen[0].Descripcion;
      });
  }

  // ==========================================
  // Función que Abre el Registro de Asiento con la información del Operación Principal
  // ==========================================
  // tslint:disable-next-line: variable-name
  AbrirAsiento(Id_OperacionPrincipal: any) {
    this.route.navigate([
      '/Administrador/OperacionesDiarias/MovimientoDiario/',
      this.TipoOrigen,
      Id_OperacionPrincipal,
    ]);
  }

  // ==========================================
  // Función que Desubscribe del Observable
  // ==========================================
  ngOnDestroy(): void {
    this.Subscripcion.unsubscribe();
  }
}
