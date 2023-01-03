import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProyectoModel } from '../../../models/Proyecto.model';
import { ProyectoService } from '../../../services/proyecto.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl } from '@angular/forms';
import swal from 'sweetalert2';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}
@Component({
  selector: 'app-lista-proyectos',
  templateUrl: './lista-proyectos.component.html',
  styleUrls: ['./lista-proyectos.component.scss'],
})
export class ListaProyectosComponent implements OnInit {
  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Datos: ProyectoModel[] = [];
  dataSource: any;
  formModalProyecto: BsModalRef;
  // tslint:disable-next-line: variable-name
  Id_Proyecto: number;

  // Tablas
  entries = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  columns = [
    { name: 'Codigo_Proyecto', prop: 'Codigo_Proyecto' },
    { name: 'Nombre_Proyecto', prop: 'Nombre_Proyecto' },
    { name: 'Serie', prop: 'Serie' },
    { name: 'Origen', prop: 'Origen' },
    { name: 'Cooperante', prop: 'Cooperante' },
    { name: 'Actions', prop: 'actions' },
  ];

  SelectionType = SelectionType;

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaProyecto: FormGroup;

  constructor(
    private proyectoService: ProyectoService,
    private modalService: BsModalService
  ) {
    this.crearFormulariosReactivos();
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

  crearFormulariosReactivos() {
    // Formulario SR
    this.formaProyecto = new FormGroup({
      Id_Proyecto: new FormControl(0),
      Codigo_Proyecto: new FormControl(''),
      Nombre_Proyecto: new FormControl(''),
      Cooperante: new FormControl(''),
      Estado: new FormControl(''),
      Origen: new FormControl(''),
      Serie: new FormControl(''),
    });
  }

  // ==========================================
  // Función para Cargar Tabla - Desde Origen
  // ==========================================
  // tslint:disable-next-line: variable-name
  CargarTabla() {
    this.proyectoService.ListaProyectos().subscribe((datos: any) => {
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
  // Modal - Nuevo Proyecto
  // ==========================================
  AbrirModalNuevoProyecto(modalForm: TemplateRef<any>) {
    // this.LimpiarFormaDetalleSR();
    this.formModalProyecto = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  // ==========================================
  // Limpiar Forma Nuevo Proyecto
  // ==========================================
  LimpiarFormaProyecto() {
    this.Id_Proyecto = 0;
    this.formaProyecto.patchValue({
      Id_Proyecto: 0,
      Codigo_Proyecto: '',
      Nombre_Proyecto: '',
      Cooperante: '',
      Estado: 1,
      Origen: '',
      Serie: '',
    });
  }

  // ==========================================
  // Función Guardar Solicitud / Actualizar
  // ==========================================
  GuardarProyecto() {
    // Primero validamos si estan ingresados los campos obligatorios
    if (
      this.formaProyecto.controls['Codigo_Proyecto'].value === '' ||
      this.formaProyecto.controls['Nombre_Proyecto'].value === '' ||
      this.formaProyecto.controls['Cooperante'].value === '' ||
      this.formaProyecto.controls['Origen'].value === '' ||
      this.formaProyecto.controls['Serie'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Proyecto, Nombre del Proyecto, Cooperante, Origen o Serie esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaProyecto.controls['Id_Proyecto'].value > 0) {
        // Actualizamos la Información de SR

        this.proyectoService
          .ActualizarProyecto(this.formaProyecto.value)
          .subscribe((info) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.formModalProyecto.hide();
          });
      } else {
        // Guardamos el SR
        this.proyectoService
          .GuardarProyecto(this.formaProyecto.value)
          .subscribe((respuesta) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto creado Correctamente',
              'success'
            );
            this.formModalProyecto.hide();
          });
      }
    }
  }
}
