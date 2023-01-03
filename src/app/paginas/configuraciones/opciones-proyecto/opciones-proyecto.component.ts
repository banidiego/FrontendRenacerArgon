import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProyectoService } from '../../../services/proyecto.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-opciones-proyecto',
  templateUrl: './opciones-proyecto.component.html',
  styleUrls: ['./opciones-proyecto.component.scss'],
})
export class OpcionesProyectoComponent implements OnInit {
  // ==========================================
  // Declaración de variables Generales
  // ==========================================
  Id_Proyecto: number;
  Nombre_proyecto: string;
  formModalProyecto: BsModalRef;

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaProyecto: FormGroup;
  formaConfiguracionTablas: FormGroup;

  constructor(
    private router: ActivatedRoute,
    private proyectoService: ProyectoService,
    private modalService: BsModalService
  ) {
    this.crearFormulariosReactivos();
    this.CargarInformacionURL();
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
  // Función que Lee los Parámetros enviados por URL
  // ==========================================
  CargarInformacionURL() {
    // tslint:disable-next-line: deprecation
    this.router.params.subscribe((params) => {
      // cargando en Variables Locales TipoOrigen
      this.Id_Proyecto = params['Id_Proyecto'];

      this.CargarProyecto(this.Id_Proyecto);
    });
  }

  // ==========================================
  // Cargar Datos de Tabla Proyecto (Serie, Cooperante, etc)
  // ==========================================
  CargarProyecto(Id_Proyecto: number) {
    this.proyectoService
      .CargarProyectoIdProyecto(Id_Proyecto)
      .subscribe((datos) => {
        this.Nombre_proyecto = datos.Nombre_Proyecto;
        this.formaProyecto.setValue(datos);
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

  // ==========================================
  // Modal - Nuevo Proyecto
  // ==========================================
  AbrirModalNuevoProyecto(modalForm: TemplateRef<any>) {
    // this.LimpiarFormaDetalleSR();
    this.formModalProyecto = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }
}
