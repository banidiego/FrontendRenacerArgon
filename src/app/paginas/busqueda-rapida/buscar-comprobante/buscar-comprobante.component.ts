import { Component, OnInit } from '@angular/core';
import { OperacionModel } from '../../../models/Operacion.model';
import { OperacionService } from '../../../services/operacion.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-buscar-comprobante',
  templateUrl: './buscar-comprobante.component.html',
  styleUrls: ['./buscar-comprobante.component.scss'],
})
export class BuscarComprobanteComponent implements OnInit {
  // Tablas
  entries = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  columns = [
    { name: 'Codigo_PlanCuenta', prop: 'Codigo_PlanCuenta' },
    { name: 'Nombre_PlanCuenta', prop: 'Nombre_PlanCuenta' },
    { name: 'Actions', prop: 'actions' },
  ];

  SelectionType = SelectionType;

  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Datos: OperacionModel[] = [];

  constructor(private operacionService: OperacionService) {
    this.CargarTabla();
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

  CargarTabla() {
    this.operacionService.ListaOperacionesTodo().subscribe((datos: any) => {
      this.Datos = datos;

      this.temp = this.Datos.map((prop, key) => {
        return {
          ...prop,
          id: key,
        };
      });
    });
  }

  // ==========================================
  // Filtrar búsqueda en la tabla
  // ==========================================
  filterBusqueda($event) {
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
