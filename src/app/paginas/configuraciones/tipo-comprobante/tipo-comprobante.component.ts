import { Component, OnInit, TemplateRef } from '@angular/core';
import { TipoDocumentoModel } from '../../../models/TipoDocumento.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import { FormGroup, FormControl } from '@angular/forms';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { TipoRegistroService } from '../../../services/tipo-registro.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-tipo-comprobante',
  templateUrl: './tipo-comprobante.component.html',
  styleUrls: ['./tipo-comprobante.component.scss'],
})
export class TipoComprobanteComponent implements OnInit {
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
  Datos: TipoDocumentoModel[] = [];
  Id_TipoDocumento: number;
  Ano: number;
  modalFormComprobante: BsModalRef;
  TipoRegistros: any;

  VariablesSistema = new VariablesSistemaModel();

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaTipoComprobante: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private tipoDocumentoService: TipoDocumentoService,
    private tipoRegistroService: TipoRegistroService,
    private modalService: BsModalService
  ) {
    this.crearFormulariosReactivos();
    this.CargarTabla();
    this.CargarTipoRegistro();
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
    this.formaTipoComprobante = new FormGroup({
      Id_TipoDocumento: new FormControl(0),
      Codigo_TipoDocumento: new FormControl(''),
      Descripcion: new FormControl(''),
      Codigo_TipoRegistro: new FormControl(''),
      Activo: new FormControl(1),
    });
  }

  CargarTabla() {
    this.tipoDocumentoService.getTipoDocumentos().subscribe((datos: any) => {
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
    this.modalFormComprobante = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  CerrarModal() {
    this.modalFormComprobante.hide();
  }

  LimpiarForma() {
    this.Id_TipoDocumento = 0;
    this.formaTipoComprobante.patchValue({
      Id_TipoDocumento: 0,
      Codigo_TipoDocumento: '',
      Descripcion: '',
      Codigo_TipoRegistro: '000',
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
      this.formaTipoComprobante.controls['Codigo_TipoDocumento'].value === '' ||
      this.formaTipoComprobante.controls['Descripcion'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Plan de Proyecto y Descripción esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaTipoComprobante.controls['Id_TipoDocumento'].value > 0) {
        // Actualizamos la Información de SR

        this.tipoDocumentoService
          .actualizarTipoDocumento(this.formaTipoComprobante.value)
          .subscribe((info) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.modalFormComprobante.hide();
          });
      } else {
        // Guardamos el SR
        this.tipoDocumentoService
          .crearTipoDocumento(this.formaTipoComprobante.value)
          .subscribe((respuesta) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto creado Correctamente',
              'success'
            );
            this.modalFormComprobante.hide();
          });
      }
    }
  }

  Cargar(Id_TipoDocumento: number) {
    this.tipoDocumentoService
      .getTipoDocumento(Id_TipoDocumento)
      .subscribe((datos) => {
        this.formaTipoComprobante.setValue(datos);
      });
  }

  // ==========================================
  // Eliminar PlanProyecto
  // ==========================================
  async Eliminar(Id_TipoDocumento: number) {
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
        this.tipoDocumentoService
          .eliminarTipoDocumento(Id_TipoDocumento)
          .subscribe((dato) => {
            this.CargarTabla();
            this.LimpiarForma();
          });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }

  // ==========================================
  // Cargar Select TipoRegistro
  // ==========================================
  CargarTipoRegistro() {
    // tslint:disable-next-line: deprecation
    this.tipoRegistroService.getTipoRegistros().subscribe((datos) => {
      this.TipoRegistros = datos;
    });
  }
}
