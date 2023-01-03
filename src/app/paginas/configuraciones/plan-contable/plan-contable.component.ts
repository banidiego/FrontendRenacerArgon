import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { PlanContableService } from '../../../services/plan-contable.service';
import { PlanContableModel } from '../../../models/PlanContable.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-plan-contable',
  templateUrl: './plan-contable.component.html',
  styleUrls: ['./plan-contable.component.scss'],
})
export class PlanContableComponent implements OnInit {
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
  Datos: PlanContableModel[] = [];
  Id_PlanContable: number;
  Ano: number;
  modalFormPlanProyecto: BsModalRef;
  modalFormPrespuesto: BsModalRef;
  VariablesSistema = new VariablesSistemaModel();

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaPlanContable: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private planContableService: PlanContableService,
    private modalService: BsModalService
  ) {
    this.Ano = new Date().getFullYear();
    this.VariablesSistema = variablesGlobalesService.VariablesSistema;
    this.crearFormulariosReactivos();

    this.CargarTabla(this.Ano);
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
  // Función que Lee los Parámetros enviados por URL
  // ==========================================
  // CargarInformacionURL() {
  //   // tslint:disable-next-line: deprecation
  //   this.router.params.subscribe((params) => {
  //     // cargando en Variables Locales TipoOrigen
  //     this.Id_Proyecto = params['Id_Proyecto'];

  //     this.CargarProyecto(this.Id_Proyecto);
  //     this.CargarTabla(this.Ano, this.Id_Proyecto);
  //   });
  // }

  crearFormulariosReactivos() {
    // Formulario SR
    this.formaPlanContable = new FormGroup({
      Id_PlanContable: new FormControl(0),
      Codigo_PlanCuenta: new FormControl(''),
      Nombre_PlanCuenta: new FormControl(''),
      DebeApertura: new FormControl(0),
      HaberApertura: new FormControl(0),
      DebeMovimientoAnual: new FormControl(0),
      HaberMovimientoAnual: new FormControl(0),
      DeudorSaldos: new FormControl(0),
      AcreedorSaldos: new FormControl(0),
      DeudorSaldosAjustados: new FormControl(0),
      AcreedorSaldosAjustados: new FormControl(0),
      ActivoBG: new FormControl(0),
      PasivoBG: new FormControl(0),
      PerdidaFuncion: new FormControl(0),
      GananciaFuncion: new FormControl(0),
      PerdidaNaturaleza: new FormControl(0),
      GananciaNaturaleza: new FormControl(0),
      Movimiento: new FormControl(0),
      CuentaActiva: new FormControl(0),
      Id_Proyecto: new FormControl(0),
      Ano: new FormControl(0),
    });
  }

  // ==========================================
  // Función para Cargar Tabla - Desde Origen
  // ==========================================
  // tslint:disable-next-line: variable-name
  CargarTabla(Ano: number) {
    this.planContableService
      .ListaPlanContableTodo(Ano)
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

  // ==========================================
  // Modal - Nuevo Proyecto
  // ==========================================
  AbrirModalPlanContable(modalForm: TemplateRef<any>) {
    // this.LimpiarFormaDetalleSR();
    this.modalFormPlanProyecto = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  AbrirModalPresupuesto(modalForm: TemplateRef<any>) {
    // this.LimpiarFormaDetalleSR();
    this.modalFormPrespuesto = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  // ==========================================
  // Limpiar Forma Nuevo PlanProyecto
  // ==========================================
  LimpiarFormaPlanContable() {
    this.Id_PlanContable = 0;
    this.formaPlanContable.patchValue({
      Id_PlanContable: 0,
      Codigo_PlanCuenta: '',
      Nombre_PlanCuenta: '',
      DebeApertura: 0,
      HaberApertura: 0,
      DebeMovimientoAnual: 0,
      HaberMovimientoAnual: 0,
      DeudorSaldos: 0,
      AcreedorSaldos: 0,
      DeudorSaldosAjustados: 0,
      AcreedorSaldosAjustados: 0,
      ActivoBG: 0,
      PasivoBG: 0,
      PerdidaFuncion: 0,
      GananciaFuncion: 0,
      PerdidaNaturaleza: 0,
      GananciaNaturaleza: 0,
      Movimiento: 0,
      CuentaActiva: 0,
      Id_Proyecto: this.VariablesSistema.Id_Proyecto,
      Ano: this.Ano,
    });
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

  // ==========================================
  // Función para Cambiar Ano y Actualizar en el LocalStorage
  // ==========================================
  async CambiarAno() {
    const { value: Ano } = await Swal.fire({
      title: 'Escriba el Año',
      icon: 'info',
      input: 'text',
      // inputLabel: 'Your IP address',
      inputValue: this.VariablesSistema.Ano.toString(),
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });

    if (Ano) {
      this.Ano = Ano;

      this.CargarTabla(this.Ano);
    }
  }

  // ==========================================
  // Cargar Datos de Plan Proyecto
  // ==========================================
  CargarPlanContable(Id_PlanContable: number) {
    this.planContableService
      .FiltrarPlanContablePorId(Id_PlanContable)
      .subscribe((datos) => {
        this.formaPlanContable.setValue(datos);
      });
  }

  // ==========================================
  // Cerrar modal
  // ==========================================
  CerrarModal() {
    this.modalFormPlanProyecto.hide();
  }

  // ==========================================
  // Función Guardar Plan Contable
  // ==========================================
  GuardarPlanContable() {
    // Primero validamos si estan ingresados los campos obligatorios
    if (
      this.formaPlanContable.controls['Codigo_PlanCuenta'].value === '' ||
      this.formaPlanContable.controls['Nombre_PlanCuenta'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Plan de Proyecto y Descripción esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaPlanContable.controls['Id_PlanContable'].value > 0) {
        // Actualizamos la Información de SR

        this.planContableService
          .ActualizarCuenta(this.formaPlanContable.value)
          .subscribe((info) => {
            this.CargarTabla(this.Ano);
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.modalFormPlanProyecto.hide();
          });
      } else {
        // Guardamos el SR
        this.planContableService
          .GuardarCuenta(this.formaPlanContable.value)
          .subscribe((respuesta) => {
            this.CargarTabla(this.Ano);
            swal.fire(
              'Sistema Renacer',
              'Proyecto creado Correctamente',
              'success'
            );
            this.modalFormPlanProyecto.hide();
          });
      }
    }
  }

  // ==========================================
  // Eliminar PlanProyecto
  // ==========================================
  async EliminarPlanContable(Id_PlanContable: number) {
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
        this.planContableService
          .eliminarPlanContable(Id_PlanContable)
          .subscribe((dato) => {
            this.CargarTabla(this.Ano);
            this.LimpiarFormaPlanContable();
          });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }
}
