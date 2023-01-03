import { Component, OnInit, TemplateRef } from '@angular/core';
import { TipoDocumentoIdentidadModel } from '../../../models/TipoDocumentoIdentidad.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import { FormGroup, FormControl } from '@angular/forms';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { TipoDocumentoIdentidadService } from '../../../services/tipo-documento-identidad.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-documentos-identidad',
  templateUrl: './documentos-identidad.component.html',
  styleUrls: ['./documentos-identidad.component.scss'],
})
export class DocumentosIdentidadComponent implements OnInit {
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
  Datos: TipoDocumentoIdentidadModel[] = [];
  Id_TipoDocumentoIdentidad: number;
  Ano: number;
  modalFormTipoIdentidad: BsModalRef;

  VariablesSistema = new VariablesSistemaModel();

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaDocumentoIdentidad: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private tipoDocumentoIdentidadService: TipoDocumentoIdentidadService,
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
    this.formaDocumentoIdentidad = new FormGroup({
      Id_TipoDocumentoIdentidad: new FormControl(0),
      Codigo_TipoDocumentoIdentidad: new FormControl(''),
      Descripcion: new FormControl(''),
      Activo: new FormControl(1),
    });
  }

  CargarTabla() {
    this.tipoDocumentoIdentidadService
      .getTipoDocumentoIdentidades()
      .subscribe((datos: any) => {
        this.Datos = datos;

        this.temp = this.Datos.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      });
  }

  AbrirModal(modalForm: TemplateRef<any>) {
    // this.LimpiarFormaDetalleSR();
    this.modalFormTipoIdentidad = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  CerrarModal() {
    this.modalFormTipoIdentidad.hide();
  }

  LimpiarForma() {
    this.Id_TipoDocumentoIdentidad = 0;
    this.formaDocumentoIdentidad.patchValue({
      Id_TipoDocumentoIdentidad: 0,
      Codigo_TipoDocumentoIdentidad: '',
      Descripcion: '',
      Activo: 1,
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

  // ==========================================
  // Función Guardar Plan Contable
  // ==========================================
  Guardar() {
    // Primero validamos si estan ingresados los campos obligatorios
    if (
      this.formaDocumentoIdentidad.controls['Codigo_TipoDocumentoIdentidad']
        .value === '' ||
      this.formaDocumentoIdentidad.controls['Descripcion'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Plan de Proyecto y Descripción esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (
        this.formaDocumentoIdentidad.controls['Id_TipoDocumentoIdentidad']
          .value > 0
      ) {
        // Actualizamos la Información de SR

        this.tipoDocumentoIdentidadService
          .actualizarTipoDocumentoIdentidad(this.formaDocumentoIdentidad.value)
          .subscribe((info) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.modalFormTipoIdentidad.hide();
          });
      } else {
        // Guardamos el SR
        this.tipoDocumentoIdentidadService
          .crearTipoDocumentoIdentidad(this.formaDocumentoIdentidad.value)
          .subscribe((respuesta) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto creado Correctamente',
              'success'
            );
            this.modalFormTipoIdentidad.hide();
          });
      }
    }
  }

  Cargar(Id_TipoDocumentoIdentidad: number) {
    this.tipoDocumentoIdentidadService
      .getTipoDocumentoIdentidad(Id_TipoDocumentoIdentidad)
      .subscribe((datos) => {
        this.formaDocumentoIdentidad.setValue(datos);
      });
  }

  // ==========================================
  // Eliminar PlanProyecto
  // ==========================================
  async Eliminar(Id_TipoDocumentoIdentidad: number) {
    await Swal.fire({
      title: 'Eliminar Registro?',
      icon: 'question',
      text: 'Está seguro de eliminar este Registro?',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoDocumentoIdentidadService
          .eliminarTipoDocumentoIdentidad(Id_TipoDocumentoIdentidad)
          .subscribe((dato) => {
            this.CargarTabla();
            this.LimpiarForma();
          });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }
}
