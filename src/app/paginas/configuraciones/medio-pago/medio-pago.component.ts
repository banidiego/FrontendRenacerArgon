import { Component, OnInit, TemplateRef } from '@angular/core';
import { MedioPagoModel } from '../../../models/MedioPago.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import { FormGroup, FormControl } from '@angular/forms';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { MedioPagoService } from '../../../services/medio-pago.service';
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
  selector: 'app-medio-pago',
  templateUrl: './medio-pago.component.html',
  styleUrls: ['./medio-pago.component.scss'],
})
export class MedioPagoComponent implements OnInit {
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
  Datos: MedioPagoModel[] = [];
  Id_MedioPago: number;
  Ano: number;
  modalMedioPago: BsModalRef;

  VariablesSistema = new VariablesSistemaModel();

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaMedioPago: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private medioPagoService: MedioPagoService,
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
    this.formaMedioPago = new FormGroup({
      Id_MedioPago: new FormControl(0),
      Codigo_MedioPago: new FormControl(''),
      Descripcion: new FormControl(''),
      Activo: new FormControl(1),
    });
  }

  CargarTabla() {
    this.medioPagoService.getMedioPagos().subscribe((datos: any) => {
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
    this.modalMedioPago = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  CerrarModal() {
    this.modalMedioPago.hide();
  }

  LimpiarForma() {
    this.Id_MedioPago = 0;
    this.formaMedioPago.patchValue({
      Id_MedioPago: 0,
      Codigo_MedioPago: '',
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
  GuardarMedioPago() {
    // Primero validamos si estan ingresados los campos obligatorios
    if (
      this.formaMedioPago.controls['Codigo_MedioPago'].value === '' ||
      this.formaMedioPago.controls['Descripcion'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Plan de Proyecto y Descripción esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaMedioPago.controls['Id_MedioPago'].value > 0) {
        // Actualizamos la Información de SR

        this.medioPagoService
          .actualizarMedioPago(this.formaMedioPago.value)
          .subscribe((info) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.modalMedioPago.hide();
          });
      } else {
        // Guardamos el SR
        this.medioPagoService
          .crearMedioPago(this.formaMedioPago.value)
          .subscribe((respuesta) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto creado Correctamente',
              'success'
            );
            this.modalMedioPago.hide();
          });
      }
    }
  }

  CargarMedioPago(Id_MedioPago: number) {
    this.medioPagoService.getMedioPago(Id_MedioPago).subscribe((datos) => {
      this.formaMedioPago.setValue(datos);
    });
  }

  // ==========================================
  // Eliminar PlanProyecto
  // ==========================================
  async EliminarMedioPago(id_MedioPago: number) {
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
        this.medioPagoService
          .eliminarMedioPago(id_MedioPago)
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
