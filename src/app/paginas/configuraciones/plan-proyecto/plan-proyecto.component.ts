import { Component, OnInit, TemplateRef } from '@angular/core';
import { PlanProyectoService } from '../../../services/plan-proyecto.service';
import { PlanProyectoModel } from '../../../models/PlanProyecto.model';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ProyectoService } from '../../../services/proyecto.service';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-plan-proyecto',
  templateUrl: './plan-proyecto.component.html',
  styleUrls: ['./plan-proyecto.component.scss'],
})
export class PlanProyectoComponent implements OnInit {
  // Tablas
  entries = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  columns = [
    { name: 'Codigo_PlanProyecto', prop: 'Codigo_PlanProyecto' },
    { name: 'Nombre_PlanProyecto', prop: 'Nombre_PlanProyecto' },
    { name: 'Actions', prop: 'actions' },
  ];

  SelectionType = SelectionType;

  // ==========================================
  // Declaración de Variables Generales
  // ==========================================
  Id_Proyecto: number;
  Id_PlanProyecto: number;
  Nombre_proyecto: string;
  Datos: PlanProyectoModel[] = [];
  VariablesSistema = new VariablesSistemaModel();
  modalFormPlanProyecto: BsModalRef;
  modalFormPrespuesto: BsModalRef;
  Ano: number;

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaPlanProyecto: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private planProyectoService: PlanProyectoService,
    private router: ActivatedRoute,
    private proyectoService: ProyectoService,
    private modalService: BsModalService
  ) {
    this.Ano = new Date().getFullYear();

    this.CargarInformacionURL();
    this.crearFormulariosReactivos();
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
  CargarInformacionURL() {
    // tslint:disable-next-line: deprecation
    this.router.params.subscribe((params) => {
      // cargando en Variables Locales TipoOrigen
      this.Id_Proyecto = params['Id_Proyecto'];

      this.CargarProyecto(this.Id_Proyecto);
      this.CargarTabla(this.Ano, this.Id_Proyecto);
    });
  }

  crearFormulariosReactivos() {
    // Formulario SR
    this.formaPlanProyecto = new FormGroup({
      Id_PlanProyecto: new FormControl(0),
      Codigo_PlanProyecto: new FormControl(''),
      Nombre_PlanProyecto: new FormControl(''),
      EneroSolesP: new FormControl(0),
      FebreroSolesP: new FormControl(0),
      MarzoSolesP: new FormControl(0),
      AbrilSolesP: new FormControl(0),
      MayoSolesP: new FormControl(0),
      JunioSolesP: new FormControl(0),
      JulioSolesP: new FormControl(0),
      AgostoSolesP: new FormControl(0),
      SeptiembreSolesP: new FormControl(0),
      OctubreSolesP: new FormControl(0),
      NoviembreSolesP: new FormControl(0),
      DiciembreSolesP: new FormControl(0),
      EneroDolaresP: new FormControl(0),
      FebreroDolaresP: new FormControl(0),
      MarzoDolaresP: new FormControl(0),
      AbrilDolaresP: new FormControl(0),
      MayoDolaresP: new FormControl(0),
      JunioDolaresP: new FormControl(0),
      JulioDolaresP: new FormControl(0),
      AgostoDolaresP: new FormControl(0),
      SeptiembreDolaresP: new FormControl(0),
      OctubreDolaresP: new FormControl(0),
      NoviembreDolaresP: new FormControl(0),
      DiciembreDolaresP: new FormControl(0),
      EneroSolesG: new FormControl(0),
      FebreroSolesG: new FormControl(0),
      MarzoSolesG: new FormControl(0),
      AbrilSolesG: new FormControl(0),
      MayoSolesG: new FormControl(0),
      JunioSolesG: new FormControl(0),
      JulioSolesG: new FormControl(0),
      AgostoSolesG: new FormControl(0),
      SeptiembreSolesG: new FormControl(0),
      OctubreSolesG: new FormControl(0),
      NoviembreSolesG: new FormControl(0),
      DiciembreSolesG: new FormControl(0),
      EneroDolaresG: new FormControl(0),
      FebreroDolaresG: new FormControl(0),
      MarzoDolaresG: new FormControl(0),
      AbrilDolaresG: new FormControl(0),
      MayoDolaresG: new FormControl(0),
      JunioDolaresG: new FormControl(0),
      JulioDolaresG: new FormControl(0),
      AgostoDolaresG: new FormControl(0),
      SeptiembreDolaresG: new FormControl(0),
      OctubreDolaresG: new FormControl(0),
      NoviembreDolaresG: new FormControl(0),
      DiciembreDolaresG: new FormControl(0),
      Id_Proyecto: new FormControl(0),
      Ano: new FormControl(0),
      Movimiento: new FormControl(0),
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
      });
  }

  // ==========================================
  // Función para Cargar Tabla - Desde Origen
  // ==========================================
  // tslint:disable-next-line: variable-name
  CargarTabla(Ano: number, Id_Proyecto: number) {
    this.planProyectoService
      .ListaPlanProyectosTodo(Ano, Id_Proyecto)
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

      this.CargarTabla(this.Ano, this.Id_Proyecto);
    }
  }

  // ==========================================
  // Modal - Nuevo Proyecto
  // ==========================================
  AbrirModalPlanProyecto(modalForm: TemplateRef<any>) {
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
  // Cargar Datos de Plan Proyecto
  // ==========================================
  CargarPlanProyecto(Id_PlanProyecto: number) {
    this.planProyectoService
      .CargarPlanProyectoIdProyecto(Id_PlanProyecto)
      .subscribe((datos) => {
        this.formaPlanProyecto.setValue(datos);
      });
  }

  // ==========================================
  // Función Guardar Solicitud / Actualizar
  // ==========================================
  GuardarProyecto() {
    // Primero validamos si estan ingresados los campos obligatorios
    if (
      this.formaPlanProyecto.controls['Codigo_PlanProyecto'].value === '' ||
      this.formaPlanProyecto.controls['Nombre_PlanProyecto'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Plan de Proyecto y Descripción esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaPlanProyecto.controls['Id_PlanProyecto'].value > 0) {
        // Actualizamos la Información de SR

        this.planProyectoService
          .ActualizarPlanProyecto(this.formaPlanProyecto.value)
          .subscribe((info) => {
            this.CargarTabla(this.Ano, this.Id_Proyecto);
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.modalFormPlanProyecto.hide();
          });
      } else {
        // Guardamos el SR
        this.planProyectoService
          .GuardarPlanProyecto(this.formaPlanProyecto.value)
          .subscribe((respuesta) => {
            this.CargarTabla(this.Ano, this.Id_Proyecto);
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
  // Cerrar modal
  // ==========================================
  CerrarModal() {
    this.modalFormPlanProyecto.hide();
  }

  // ==========================================
  // Limpiar Forma Nuevo PlanProyecto
  // ==========================================
  LimpiarFormaPlanProyecto() {
    this.Id_PlanProyecto = 0;
    this.formaPlanProyecto.patchValue({
      Id_PlanProyecto: this.Id_PlanProyecto,
      Codigo_PlanProyecto: '',
      Nombre_PlanProyecto: '',
      EneroSolesP: 0,
      FebreroSolesP: 0,
      MarzoSolesP: 0,
      AbrilSolesP: 0,
      MayoSolesP: 0,
      JunioSolesP: 0,
      JulioSolesP: 0,
      AgostoSolesP: 0,
      SeptiembreSolesP: 0,
      OctubreSolesP: 0,
      NoviembreSolesP: 0,
      DiciembreSolesP: 0,
      EneroDolaresP: 0,
      FebreroDolaresP: 0,
      MarzoDolaresP: 0,
      AbrilDolaresP: 0,
      MayoDolaresP: 0,
      JunioDolaresP: 0,
      JulioDolaresP: 0,
      AgostoDolaresP: 0,
      SeptiembreDolaresP: 0,
      OctubreDolaresP: 0,
      NoviembreDolaresP: 0,
      DiciembreDolaresP: 0,
      EneroSolesG: 0,
      FebreroSolesG: 0,
      MarzoSolesG: 0,
      AbrilSolesG: 0,
      MayoSolesG: 0,
      JunioSolesG: 0,
      JulioSolesG: 0,
      AgostoSolesG: 0,
      SeptiembreSolesG: 0,
      OctubreSolesG: 0,
      NoviembreSolesG: 0,
      DiciembreSolesG: 0,
      EneroDolaresG: 0,
      FebreroDolaresG: 0,
      MarzoDolaresG: 0,
      AbrilDolaresG: 0,
      MayoDolaresG: 0,
      JunioDolaresG: 0,
      JulioDolaresG: 0,
      AgostoDolaresG: 0,
      SeptiembreDolaresG: 0,
      OctubreDolaresG: 0,
      NoviembreDolaresG: 0,
      DiciembreDolaresG: 0,
      Id_Proyecto: this.Id_Proyecto,
      Ano: this.VariablesSistema.Ano,
      Movimiento: 0,
    });
  }

  // ==========================================
  // Eliminar PlanProyecto
  // ==========================================
  async EliminarPlanProyecto(Id_PlanProyecto: number) {
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
        this.planProyectoService
          .EliminarPlanProyecto(Id_PlanProyecto)
          .subscribe((dato) => {
            this.CargarTabla(this.VariablesSistema.Ano, this.Id_Proyecto);
            this.LimpiarFormaPlanProyecto();
          });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }
}
