import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuxiliarModel } from '../../../../models/Auxiliar.model';
import { OrigenModel } from '../../../../models/Origen.model';
import { PlanProyectoModel } from '../../../../models/PlanProyecto.model';
import { Observable, Subscription } from 'rxjs';
import { DetalleSRModel } from '../../../../models/DetalleSR.model';
import { OperacionModel } from '../../../../models/Operacion.model';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { OrigenService } from '../../../../services/origen.service';
import { AuxiliarService } from '../../../../services/auxiliar.service';
import { ProyectoService } from '../../../../services/proyecto.service';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { SrService } from '../../../../services/sr.service';
import { OperacionPrincipalService } from '../../../../services/operacion-principal.service';
import { OperacionService } from '../../../../services/operacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanProyectoService } from '../../../../services/plan-proyecto.service';
import { DetalleSrService } from '../../../../services/detalle-sr.service';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlanContableService } from '../../../../services/plan-contable.service';
import { PlanContableModel } from '../../../../models/PlanContable.model';
import { formatDate } from '@angular/common';
import { TipoDocumentoService } from '../../../../services/tipo-documento.service';
import { TipoDocumentoIdentidadService } from '../../../../services/tipo-documento-identidad.service';
import Swal from 'sweetalert2';

declare const $: any;
export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-registro-solicitud',
  templateUrl: './registro-solicitud.component.html',
  styleUrls: ['./registro-solicitud.component.scss'],
})
export class RegistroSolicitudComponent implements OnInit {
  // ==========================================
  // Modales
  // ==========================================
  SelectionType = SelectionType;
  enableSummary = false;
  form = {
    keyboard: true,
    class: 'modal-dialog-centered modal-sm',
  };
  entries = 10;
  selected: any[] = [];

  activeRow: any;
  // --
  formModalPlanContable: BsModalRef;
  tablaPlanContable = [];
  planContable: PlanContableModel[] = [];
  // --
  formModalBuscarAuxiliares: BsModalRef;
  tablaAuxiliar = [];
  auxiliares: AuxiliarModel[] = [];
  // --
  formModalSUNAT: BsModalRef;
  // --
  formModalDetalleSR: BsModalRef;
  // --
  formModalPlanProyecto: BsModalRef;
  tablaPlanProyecto = [];
  planProyecto: PlanProyectoModel[] = [];

  // ==========================================
  // Declaración de Array de Mes
  // ==========================================
  MesArray = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // ==========================================
  // Declaración de Variables para Filtro de "Girado" (Autocomplete - Angular Material)
  // ==========================================

  origenes: OrigenModel[] = [];

  auxiliaresFiltradosResponsableGiro: Observable<AuxiliarModel[]>;
  auxiliaresFiltradosResponsable: Observable<AuxiliarModel[]>;
  PlanProyectoFiltrados: Observable<PlanProyectoModel[]>;

  // ==========================================
  // Declaración de variables de Sesion
  // ==========================================
  TipoOrigen = '';
  Origen: string; // Codigo de Proyecto
  Ano: number;
  Mes: string;
  Subscripcion: Subscription;
  TipoDocumentos: any;
  TipoDocumentoIdentidad: any;

  // ==========================================
  // Declaración de variables de SR (Para Titulo)
  // ==========================================
  // tslint:disable-next-line: variable-name
  Id_SR: number;
  Serie: string;
  NumeroSolicitud: number;
  NumeroTexto: string;
  // tslint:disable-next-line: variable-name
  Id_TipoDocumentoIdentidad: number; // Para Responsable de la Solicitud

  // ==========================================
  // Declaración de variables de DetalleSR
  // ==========================================
  Id_DetalleSR: number;

  // ==========================================
  // Declaración de variables Generales
  // ==========================================
  Datos: DetalleSRModel[] = [];
  DatosOperacion: OperacionModel[] = [];
  TotalPresupuesto: number;
  CodigoOperacion: string;
  NumeroOperacionPrincipal: number;
  NumeroMes: number;
  PrimerDia: Date;
  UltimoDia: Date;

  // Definiendo el Objeto que obtendra todas las variables de Sesión
  VariablesSistema = new VariablesSistemaModel();

  // ==========================================
  // Declaración de variables de OperacionPrincipal y Operacion
  // ==========================================
  // -- OperacionPrincipal
  Id_OperacionPrincipal: number;
  // -- Operacion
  Id_Operacion: number;

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaSR: FormGroup;
  formaDetalleSR: FormGroup;
  formaOperacionPrincipal: FormGroup;
  formaOperacion: FormGroup;
  formaAuxiliar: FormGroup;

  constructor(
    private origenService: OrigenService,
    private auxiliarService: AuxiliarService,
    private proyectoService: ProyectoService,
    private variablesGlobalesService: VariablesGlobalesService,
    private srService: SrService,
    private operacionPrincipalService: OperacionPrincipalService,
    private operacionService: OperacionService,
    private router: ActivatedRoute,
    private planProyectoService: PlanProyectoService,
    private detalleSRService: DetalleSrService,
    private route: Router,
    private modalService: BsModalService,
    private planContableService: PlanContableService,
    private tipoDocumentoService: TipoDocumentoService,
    private tipoDocumentoIdentidadService: TipoDocumentoIdentidadService
  ) {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;
    this.MinMaxFecha();
    this.crearFormulariosReactivos();
    this.cargarPlanProyecto(
      this.VariablesSistema.Ano,
      this.VariablesSistema.Id_Proyecto
    );
    // this.ObservableAutocompletePlanProyecto();

    this.CargarOrigen(
      this.VariablesSistema.Ano,
      this.VariablesSistema.Id_Proyecto
    );
    this.CargarProyecto(this.VariablesSistema.Id_Proyecto);
    this.CargarInformacionURL();
    this.cargarPlanContable(this.VariablesSistema.Ano);
    this.cargarAuxiliares();
    this.CargarTipoDocumento();
    this.CargarTipoDocumentoIdentidad();
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
  // Obterner Min y Max para Validar Fecha
  // ==========================================
  MinMaxFecha() {
    switch (this.VariablesSistema.Mes) {
      case 'Enero': {
        this.NumeroMes = 0;
        break;
      }
      case 'Febrero': {
        this.NumeroMes = 1;
        break;
      }
      case 'Marzo': {
        this.NumeroMes = 2;
        break;
      }
      case 'Abril': {
        this.NumeroMes = 3;
        break;
      }
      case 'Mayo': {
        this.NumeroMes = 4;
        break;
      }
      case 'Junio': {
        this.NumeroMes = 5;
        break;
      }
      case 'Julio': {
        this.NumeroMes = 6;
        break;
      }
      case 'Agosto': {
        this.NumeroMes = 7;
        break;
      }
      case 'Septiembre': {
        this.NumeroMes = 8;
        break;
      }
      case 'Octubre': {
        this.NumeroMes = 9;
        break;
      }
      case 'Noviembre': {
        this.NumeroMes = 10;
        break;
      }
      case 'Diciembre': {
        this.NumeroMes = 11;
        break;
      }
    }

    this.PrimerDia = new Date(this.VariablesSistema.Ano, this.NumeroMes, 1);
    this.UltimoDia = new Date(this.VariablesSistema.Ano, this.NumeroMes + 1, 0);
  }

  crearFormulariosReactivos() {
    // Formulario SR
    this.formaSR = new FormGroup({
      Id_SR: new FormControl(0),
      Numero: new FormControl(''),
      Serie: new FormControl(''),
      Responsable: new FormControl(''),
      RUCResponsable: new FormControl(''),
      FechaSolicitud: new FormControl(this.PrimerDia),
      EntidadCooperante: new FormControl({ value: '', readonly: true }),
      Cheque: new FormControl(''),
      MonedaCheque: new FormControl(''),
      ImporteCheque: new FormControl(0),
      TCCheque: new FormControl(0),
      Descripcion: new FormControl(''),
      FechaRendicion: new FormControl(new Date()),
      Observaciones: new FormControl(''),
      Presupuesto: new FormControl(0),
      NRI: new FormControl(''),
      MontoRI: new FormControl(0),
      NCC: new FormControl(''),
      MontoCC: new FormControl(0),
      TotalGasto: new FormControl(0),
      Id_Verificacion: new FormControl(0),
      Tipo: new FormControl(0),
      Bloqueado: new FormControl(false),
      Rendido: new FormControl(false),
      Rubro: new FormControl(''),
      Mes: new FormControl(this.VariablesSistema.Mes),
      Ano: new FormControl(this.VariablesSistema.Ano),
      Id_Proyecto: new FormControl(this.VariablesSistema.Id_Proyecto),
      Cerrado: new FormControl(0),
    });

    // Formulario DetalleSR
    this.formaDetalleSR = new FormGroup({
      Id_DetalleSR: new FormControl(0),
      Id_SR: new FormControl(0),
      Codigo_PlanProyecto: new FormControl(''),
      Presupuesto: new FormControl(0),
      Gasto: new FormControl(0),
      Actividad: new FormControl(''),
    });

    // Formulario Operación Principal
    this.formaOperacionPrincipal = new FormGroup({
      Id_OperacionPrincipal: new FormControl(0),
      DescripcionOperacion: new FormControl(''),
      FechaOperacion: new FormControl(new Date()),
      ResponsableGiro: new FormControl(''),
      CodigoOperacion: new FormControl(''),
      Numero: new FormControl(0),
      Ano: new FormControl(this.VariablesSistema.Ano),
      Mes: new FormControl(this.VariablesSistema.Mes),
      Id_Proyecto: new FormControl(this.VariablesSistema.Id_Proyecto),
      C01: new FormControl(0),
      C02: new FormControl(0),
      C03: new FormControl(0),
      C04: new FormControl(0),
      C06: new FormControl(0),
      C07: new FormControl(0),
      C08: new FormControl(0),
      C09: new FormControl(0),
      C10: new FormControl(0),
      C11: new FormControl(0),
      C12: new FormControl(0),
      C13: new FormControl(0),
      C14: new FormControl(0),
      C16: new FormControl(0),
      C17: new FormControl(0),
      C18: new FormControl(0),
      C19: new FormControl(0),
      C20: new FormControl(0),
      C21: new FormControl(0),
      C22: new FormControl(0),
      C23: new FormControl(0),
      C24: new FormControl(0),
      C25: new FormControl(0),
      C26: new FormControl(0),
      C27: new FormControl(0),
      C28: new FormControl(0),
      C29: new FormControl(0),
      C30: new FormControl(0),
      C31: new FormControl(0),
      C32: new FormControl(0),
      C33: new FormControl(0),
      C34: new FormControl(0),
      C35: new FormControl(0),
      C36: new FormControl(0),
      C37: new FormControl(0),
      C38: new FormControl(0),
      C39: new FormControl(0),
      C40: new FormControl(0),
      C41: new FormControl(0),
      C42: new FormControl(0),
      C43: new FormControl(0),
      C44: new FormControl(0),
      C45: new FormControl(0),
      C46: new FormControl(0),
      C47: new FormControl(0),
      C48: new FormControl(0),
      C49: new FormControl(0),
      C50: new FormControl(0),
      C51: new FormControl(0),
      C52: new FormControl(0),
      C56: new FormControl(0),
      C57: new FormControl(0),
      C58: new FormControl(0),
      C59: new FormControl(0),
      C60: new FormControl(0),
      C61: new FormControl(0),
      C62: new FormControl(0),
      C63: new FormControl(0),
      C64: new FormControl(0),
      C65: new FormControl(0),
      C66: new FormControl(0),
      C67: new FormControl(0),
      C68: new FormControl(0),
      C69: new FormControl(0),
      C70: new FormControl(0),
      C71: new FormControl(0),
      C72: new FormControl(0),
      C73: new FormControl(0),
      C74: new FormControl(0),
      C75: new FormControl(0),
      C76: new FormControl(0),
      C77: new FormControl(0),
      C78: new FormControl(0),
      C79: new FormControl(0),
      C80: new FormControl(0),
      C81: new FormControl(0),
      C82: new FormControl(0),
      C83: new FormControl(0),
      C84: new FormControl(0),
      C85: new FormControl(0),
      C87: new FormControl(0),
      C88: new FormControl(0),
      C89: new FormControl(0),
      C91: new FormControl(0),
      C92: new FormControl(0),
      C93: new FormControl(0),
      C94: new FormControl(0),
      C95: new FormControl(0),
      C96: new FormControl(0),
      TipoOrigen: new FormControl(''),
      Solicitud: new FormControl(0),
      AutorizacionDolares: new FormControl(0),
      AutorizacionSoles: new FormControl(0),
      Diferencia: new FormControl(0),
      Cuadrado: new FormControl(false),
      Cerrado: new FormControl(0),
    });

    // Formulario Operación
    this.formaOperacion = new FormGroup({
      Id_Operacion: new FormControl(0),
      Id_OperacionPrincipal: new FormControl(0),
      TipoOrigen: new FormControl(''),
      CodigoOperacion: new FormControl(''),
      DescripcionOperacion: new FormControl(''),
      FechaOperacion: new FormControl(new Date()),
      ResponsableGiro: new FormControl(''),
      RUCResponsableGiro: new FormControl(''),
      Solicitud: new FormControl(0),
      TipoSR: new FormControl(0),
      Id_SR: new FormControl(0),
      Id_DetalleSR: new FormControl(0),
      DescripcionDetalle: new FormControl(''),
      TC: new FormControl(3.45),
      Codigo_MedioPago: new FormControl('009'),
      ChequeSoles: new FormControl(''),
      ChequeDolares: new FormControl(''),
      Codigo_TipoDocumento: new FormControl('00'),
      Codigo_TipoRegistro: new FormControl('000'),
      SerieComprobante: new FormControl(''),
      NumeroComprobante: new FormControl(''),
      FechaComprobante: new FormControl(new Date()),
      RUCAuxiliar: new FormControl(''),
      RazonSocial: new FormControl(''),
      Codigo_TipoDocumentoIdentidad: new FormControl(''),
      Codigo_PlanProyecto: new FormControl(''),
      Codigo_PlanCuenta: new FormControl(''),
      Nombre_PlanCuenta: new FormControl(''),
      MontoSoles: new FormControl(0),
      MontoDolares: new FormControl(0),
      DebeSoles: new FormControl(0),
      HaberSoles: new FormControl(0),
      DebeDolares: new FormControl(0),
      HaberDolares: new FormControl(0),
      C1: new FormControl(0),
      C2: new FormControl(0),
      C3: new FormControl(0),
      C4: new FormControl(0),
      C5: new FormControl(0),
      C6: new FormControl(0),
      C7: new FormControl(0),
      C8: new FormControl(0),
      C9: new FormControl(0),
      C10: new FormControl(0),
      V1: new FormControl(0),
      V2: new FormControl(0),
      V3: new FormControl(0),
      V4: new FormControl(0),
      V5: new FormControl(0),
      V6: new FormControl(0),
      V7: new FormControl(0),
      Mes: new FormControl(this.VariablesSistema.Mes),
      Ano: new FormControl(this.VariablesSistema.Ano),
      Id_Proyecto: new FormControl(this.VariablesSistema.Id_Proyecto),
      Anulado: new FormControl(0),
      Saldo: new FormControl(0),
      CuentaPendiente: new FormControl(0),
      TipoSaldo: new FormControl(0),
      Cerrado: new FormControl(0),
    });

    this.formaAuxiliar = new FormGroup({
      Id_Auxiliar: new FormControl(0),
      RUC: new FormControl(''),
      ApellidoPaterno: new FormControl(''),
      ApellidoMaterno: new FormControl(''),
      Nombres: new FormControl(''),
      RazonSocial: new FormControl(''),
      Direccion: new FormControl(''),
      Codigo_TipoDocumentoIdentidad: new FormControl('0'),
    });
  }

  /** Gets the total cost of all transactions. */
  // ==========================================
  // Suma de Totales
  // ==========================================
  SumaTotalPresupuesto() {
    return (this.TotalPresupuesto = this.Datos.map((t) => t.Presupuesto).reduce(
      (acc, value) => acc + value,
      0
    ));
  }

  // ==========================================
  // Carga Auxiliares para alimentar Select
  // ==========================================
  FiltrarAuxiliarRUC(RUC: string) {
    this.auxiliarService.FiltrarAuxiliarRUC(RUC).subscribe((datos) => {
      this.formaOperacion.patchValue({
        RazonSocial: datos.RazonSocial,
        Codigo_TipoDocumentoIdentidad: datos.Id_TipoDocumentoIdentidad,
      });
    });
  }

  // ==========================================
  // Función Observable que Filtra Autocomplete
  // ==========================================
  // ObservableAutocompletePlanProyecto() {
  //   this.PlanProyectoFiltrados = this.formaDetalleSR
  //     .get('Codigo_PlanProyecto')
  //     .valueChanges.pipe(
  //       startWith(''),
  //       map((resp) =>
  //         resp ? this._filtrarPlanProyecto(resp) : this.planProyecto.slice()
  //       )
  //     );
  // }

  // ==========================================
  // Función que filtra datos
  // ==========================================
  private _filtrarPlanProyecto(value: string): PlanProyectoModel[] {
    const filterValue = value.toString();

    return this.planProyecto.filter(
      (resp) => resp.Codigo_PlanProyecto.toString().indexOf(filterValue) === 0
    );
  }

  // ==========================================
  // Cargar Datos de Tabla Proyecto (Serie, Cooperante, etc)
  // ==========================================
  CargarProyecto(Id_Proyecto: number) {
    this.proyectoService
      .CargarProyectoIdProyecto(Id_Proyecto)
      .subscribe((datos) => {
        this.Serie = datos.Serie;
        this.formaSR.patchValue({
          Serie: datos.Serie,
          EntidadCooperante: datos.Cooperante,
          Mes: this.VariablesSistema.Mes,
          Ano: this.VariablesSistema.Ano,
          Id_Proyecto: datos.Id_Proyecto,
        });
        // this.formaOperacionPrincipal.patchValue({
        //   Ano: this.Ano,
        //   Mes: this.Mes,
        //   Codigo_Proyecto: this.Origen,
        // });
        // this.formaOperacion.patchValue({
        //   Ano: this.Ano,
        //   Mes: this.Mes,
        //   Codigo_Proyecto: this.Origen,
        // });
      });
  }

  // ==========================================
  // Función que Lee los Parámetros enviados por URL
  // ==========================================
  CargarInformacionURL() {
    // tslint:disable-next-line: deprecation
    this.router.params.subscribe((params) => {
      // cargando en Variables Locales TipoOrigen
      this.Id_SR = params['Id_SR'];

      // Confirmamos si Es un Nuevo Asiento o uno ya existente
      if (params['Id_SR'] === 'Nuevo') {
        // Asignamos el Id_Operacion = 0
        this.Id_SR = 0;
        this.Id_OperacionPrincipal = 0;
        this.Id_Operacion = 0;

        this.formaOperacion.controls['TipoOrigen'].enable();
        this.formaOperacion.controls['Nombre_PlanCuenta'].enable();

        const Fecha = new Date(
          this.VariablesSistema.Ano,
          this.MesArray.indexOf(this.VariablesSistema.Mes),
          1
        );

        const FechaFormateada = new Date(
          Date.UTC(
            this.PrimerDia.getFullYear(),
            this.PrimerDia.getMonth(),
            this.PrimerDia.getDate()
          )
        );

        // Creamos una nueva Fecha UTC
        // const FechaUTC = moment(FechaFormateada).utcOffset(0);

        // Actualizamos las variables en el Formulario, también se asigna la correcta Fecha UTC
        this.formaOperacionPrincipal.patchValue({
          Id_OperacionPrincipal: this.Id_OperacionPrincipal,
          FechaOperacion: formatDate(
            new Date(
              this.VariablesSistema.Ano,
              this.MesArray.indexOf(this.VariablesSistema.Mes),
              1
            ),
            'yyyy-MM-dd',
            'en-GB',
            '+0500'
          ),
          TipoOrigen: this.TipoOrigen,
        });

        this.formaOperacion.patchValue({
          TipoSR: 1,
        });

        this.CargarNumeroSolicitud(
          this.VariablesSistema.Ano,
          this.VariablesSistema.Id_Proyecto
        );
      } else {
        this.Id_SR = params['Id_SR'];
        this.CargarSR(this.Id_SR);

        // this.formaOperacion.controls['TipoOrigen'].;
        // this.formaOperacion.controls['Nombre_PlanCuenta'].disable();
      }
    });

    // this.router.params.subscribe((params) => {
    //   if (params['Id_SR'] !== 'Nuevo') {
    //     this.Id_SR = params['Id_SR'];
    //     this.CargarSR(this.Id_SR);
    //   } else {
    //     this.Id_SR = 0;
    //   }

    //   // Actualizamos las Varibales de Sesión
    //   this.ActualizarInfoVariablesSesion();
    //   // Cargamos el Codigo de Operación

    //   // Cargamos los Select
    //   this.cargarPlanProyecto(this.Ano, this.Origen);

    //   // this.CargarProyecto(this.Origen);
    //   this.CargarNumeroSolicitud(this.VariablesSistema.Ano, this.Origen);
    // });
  }

  // ==========================================
  // Función que Actualiza las Variables Cargadas por el Observable en las Formas
  // ==========================================
  ActualizarInfoVariablesSesion() {
    this.formaOperacionPrincipal.patchValue({
      Ano: this.VariablesSistema.Ano,
      Mes: this.VariablesSistema.Mes,
      Id_Proyecto: this.VariablesSistema.Id_Proyecto,
      TipoOrigen: this.TipoOrigen,
    });

    this.formaOperacion.patchValue({
      Ano: this.VariablesSistema.Ano,
      Mes: this.VariablesSistema.Mes,
      Id_Proyecto: this.VariablesSistema.Id_Proyecto,
      TipoOrigen: this.TipoOrigen,
    });
  }

  // ==========================================
  // Cargar o Generar Numero de Socilitud
  // ==========================================
  CargarNumeroSolicitud(Ano: number, Id_Proyecto: number) {
    this.NumeroSolicitud = 0;
    if (this.Id_SR > 0) {
      this.NumeroSolicitud = this.formaSR.controls['Numero'].value;

      if (this.NumeroSolicitud <= 9) {
        this.NumeroTexto = ' 000' + this.NumeroSolicitud;
      } else if (this.NumeroSolicitud <= 99) {
        this.NumeroTexto = ' 00' + this.NumeroSolicitud;
      } else if (this.NumeroSolicitud <= 999) {
        this.NumeroTexto = ' 0' + this.NumeroSolicitud;
      }

      this.formaSR.patchValue({
        Numero: this.NumeroSolicitud,
      });
      this.formaOperacion.patchValue({
        Solicitud: this.NumeroSolicitud,
      });
      this.formaOperacionPrincipal.patchValue({
        Solicitud: this.NumeroSolicitud,
      });
    } else {
      this.srService
        .MaximoNumeroSolicitud(Ano, Id_Proyecto)
        .subscribe((datos) => {
          this.NumeroSolicitud = datos;

          if (this.NumeroSolicitud <= 9) {
            this.NumeroTexto = ' 000' + this.NumeroSolicitud;
          } else if (this.NumeroSolicitud <= 99) {
            this.NumeroTexto = ' 00' + this.NumeroSolicitud;
          } else if (this.NumeroSolicitud <= 999) {
            this.NumeroTexto = ' 0' + this.NumeroSolicitud;
          }

          this.formaSR.patchValue({
            Numero: this.NumeroSolicitud,
          });
          this.formaOperacion.patchValue({
            Solicitud: this.NumeroSolicitud,
          });
          this.formaOperacionPrincipal.patchValue({
            Solicitud: this.NumeroSolicitud,
          });
        });
    }
  }

  // ==========================================
  // Carga Origenes para alimentar Select
  // ==========================================
  CargarOrigen(Ano: number, Id_Proyecto: number) {
    // tslint:disable-next-line: deprecation
    this.origenService
      .ListadoOrigenIdProyecto(Ano, Id_Proyecto)
      .subscribe((datos: any) => {
        this.origenes = datos;
      });
  }

  // ==========================================
  // Carga PlanProyecto para alimentar el Autocomplete
  // ==========================================
  cargarPlanProyecto(Ano: number, Id_Proyecto: number) {
    this.planProyectoService
      .ListaPlanProyectos(Ano, Id_Proyecto)
      .subscribe((datos: any) => {
        this.planProyecto = datos;

        this.tablaPlanProyecto = this.planProyecto.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      });
  }

  // ==========================================
  // Carga Auxiliares por RazonSocial
  // ==========================================
  FiltrarAuxiliarRazonSocial(RazonSocial: string) {
    this.auxiliarService
      .FiltrarAuxiliarRazonSocial(RazonSocial)
      .subscribe((datos) => {
        this.Id_TipoDocumentoIdentidad = datos.Id_TipoDocumentoIdentidad;
        this.formaSR.patchValue({
          RUCResponsable: datos.RUC,
        });
      });
  }

  // ==========================================
  // Función que Actualiza las Información de la Nueva Solicitud
  // ==========================================
  ActualizarOperacionSR() {
    this.formaOperacion.patchValue({
      MontoSoles: this.TotalPresupuesto,
      MontoDolares: this.TotalPresupuesto,
      HaberSoles: this.TotalPresupuesto,
      HaberDolares: this.TotalPresupuesto,
    });

    this.formaSR.patchValue({
      Presupuesto: this.TotalPresupuesto,
    });
  }

  // ==========================================
  // Función Guardar Solicitud / Actualizar
  // ==========================================
  GuardarSolicitud() {
    // Primero validamos si estan ingresados los campos obligatorios
    if (
      this.formaOperacionPrincipal.controls['TipoOrigen'].value === '' ||
      this.formaOperacion.controls['Nombre_PlanCuenta'].value === '' ||
      this.formaOperacionPrincipal.controls['ResponsableGiro'].value === '' ||
      this.formaSR.controls['Descripcion'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Origen, Cuenta, Girado a la Orden y la Actividad esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaSR.controls['Id_SR'].value > 0) {
        // Actualizamos la Información de SR
        this.ActualizarOperacionSR();
        this.srService.ActualizarSR(this.formaSR.value).subscribe((info) => {
          // Actualizamos la Información de Operación
          this.operacionService
            .ActualizarOperacion(this.formaOperacion.value)
            .subscribe((resp) => {
              // Actualizamos la Información de Operación Principal
              // this.ActualizarLibroDiarioSimplificado();
            });
        });
      } else {
        // Actualizamos la Fechade Rendicion como la Fecha de Solicitud
        this.formaSR.patchValue({
          FechaRendicion: this.formaSR.controls['FechaSolicitud'].value,
        });
        // Guardamos el SR
        this.srService.GuardarSR(this.formaSR.value).subscribe((respuesta) => {
          this.formaSR.setValue(respuesta);

          // Asignamos al formulario DetalleSR el valor de Id_SR
          this.formaDetalleSR.patchValue({
            Id_SR: respuesta.Id_SR,
          });

          // Asignamos el valor a la Variable Id_SR
          this.Id_SR = respuesta.Id_SR;

          // Ahora evaluamos si existe una Id_OperacionPrincipal sólo actualiza, sino creamos un nuevo Id_OperacionPrincipal (Registro)
          if (
            this.formaOperacionPrincipal.controls['Id_OperacionPrincipal']
              .value > 0
          ) {
            // Si Existe un Id_OperacionPrincipal, actualizamos la información
            this.operacionPrincipalService
              .ActualizarOperacionPrincipal(this.formaOperacionPrincipal.value)
              .subscribe((resp) => {});
          } else {
            // Si no existe, Creamos una nueva OperaciónPrincipal
            this.operacionPrincipalService
              .GuardarOperacionPrincipal(this.formaOperacionPrincipal.value)
              .subscribe((resp) => {
                // Asignamos los valores creados (respuesta) al formulario OperacionPrincipal
                this.formaOperacionPrincipal.setValue(resp);

                // Asignamos el valor del Id_OperacionPrincipal a la Variable del Componente
                this.Id_OperacionPrincipal = resp.Id_OperacionPrincipal;

                // Agregamos Valores de la Respuesta (OperacionPrincipal) a el Formulario Operacion e Id_SR asi como el tipo de SR
                this.formaOperacion.patchValue({
                  Id_OperacionPrincipal: resp.Id_OperacionPrincipal,
                  TipoOrigen: resp.TipoOrigen,
                  Id_SR: this.Id_SR,
                  TipoSR: 1,
                  DescripcionDetalle:
                    this.formaOperacionPrincipal.controls[
                      'DescripcionOperacion'
                    ].value,
                });

                // Evaluamos si Existe un Id_operacion de tipo SR=1
                if (this.formaOperacion.controls['Id_Operacion'].value > 0) {
                  // Si existe, entonces actualizamos
                  this.operacionService
                    .ActualizarOperacion(this.formaOperacion.value)
                    .subscribe((dato) => {});
                } else {
                  // Si no existe creamos uno nuevo
                  this.operacionService
                    .GuardarOperacion(this.formaOperacion.value)
                    .subscribe((dato: any) => {
                      // Asignamos el resultado al formulario Operacion
                      this.formaOperacion.setValue(dato);
                      // Actualizamos la variable Id_Operacion con la respuesta
                      this.Id_Operacion = dato.Id_Operacion;
                    });
                }
              });
          }

          this.route.navigate([
            '/Administrador/OperacionesDiarias/Solicitud/',
            this.formaSR.controls['Id_SR'].value,
          ]);
        });
      }
    }
  }

  AsignarValoresFormularios() {
    this.formaOperacionPrincipal.patchValue({
      DescripcionOperacion: this.formaSR.controls['Descripcion'].value,
      ResponsableGiro: this.formaSR.controls['Responsable'].value,
      FechaOperacion: this.formaSR.controls['FechaSolicitud'].value,
    });

    this.formaOperacion.patchValue({
      DescripcionOperacion: this.formaSR.controls['Descripcion'].value,
      FechaOperacion: this.formaSR.controls['FechaSolicitud'].value,
      TipoSR: 1,
      ResponsableGiro: this.formaSR.controls['Responsable'].value,
      RUCResponsableGiro: this.formaSR.controls['RUCResponsable'].value,
      FechaComprobante: this.formaSR.controls['FechaSolicitud'].value,
      RUCAuxiliar: this.formaSR.controls['RUCResponsable'].value,
      RazonSocial: this.formaSR.controls['Responsable'].value,
      Codigo_TipoDocumentoIdentidad: this.Id_TipoDocumentoIdentidad,
    });
  }

  // ==========================================
  // Boton Solicitar
  // ==========================================
  Solicitar() {
    this.ActualizarLibroDiarioSimplificado();
  }

  // ==========================================
  // Función para cargar Tabla
  // ==========================================
  CargarTabla() {
    this.detalleSRService
      .ListaDetalleSRIdSR(this.Id_SR)
      .subscribe((datos: any) => {
        this.Datos = datos;

        // this.dataSource = new MatTableDataSource<Titulos>(this.Datos);
        // this.dataSource.paginator = this.paginator;

        this.SumaTotalPresupuesto();

        // Siempre al cargar la Tabla actualiza la suma en el Total del Presupuesto
        this.formaSR.patchValue({
          Presupuesto: this.TotalPresupuesto,
        });

        this.formaOperacion.patchValue({
          MontoSoles: this.TotalPresupuesto,
          MontoDolares:
            this.TotalPresupuesto * this.formaOperacion.controls['TC'].value,
          HaberSoles: this.TotalPresupuesto,
          HaberDolares:
            this.TotalPresupuesto * this.formaOperacion.controls['TC'].value,
        });
      });
  }

  // ==========================================
  // Cargar SR
  // ==========================================
  CargarSR(Id_SR: number) {
    this.srService.getSR(Id_SR).subscribe((datos) => {
      this.formaSR.patchValue({
        Id_SR: datos.Id_SR,
        Numero: datos.Numero,
        Serie: datos.Serie,
        Responsable: datos.Responsable,
        RUCResponsable: datos.RUCResponsable,
        FechaSolicitud: formatDate(
          new Date(datos.FechaSolicitud),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
        EntidadCooperante: datos.EntidadCooperante,
        Cheque: datos.Cheque,
        MonedaCheque: datos.MonedaCheque,
        ImporteCheque: datos.ImporteCheque,
        TCCheque: datos.TCCheque,
        Descripcion: datos.Descripcion,
        FechaRendicion: formatDate(
          new Date(datos.FechaRendicion),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
        Observaciones: datos.Observaciones,
        Presupuesto: datos.Presupuesto,
        NRI: datos.NRI,
        MontoRI: datos.MontoRI,
        NCC: datos.NCC,
        MontoCC: datos.MontoCC,
        TotalGasto: datos.TotalGasto,
        Id_Verificacion: datos.Id_Verificacion,
        Tipo: datos.Tipo,
        Bloqueado: datos.Bloqueado,
        Rendido: datos.Rendido,
        Rubro: datos.Rubro,
        Mes: datos.Mes,
        Ano: datos.Ano,
        Codigo_Proyecto: datos.Codigo_Proyecto,
      });

      // cargar Numero de Solicitud
      this.CargarNumeroSolicitud(
        this.VariablesSistema.Ano,
        this.VariablesSistema.Id_Proyecto
      );

      this.CargarOperacionSolicitudHaber(datos.Id_SR); // Después Carga también la OperacionPrincipal
    });
  }

  // ==========================================
  // Cargar Operación Principal
  // ==========================================
  CargarOperacionPrincipal(Id_OperacionPrincipal: number) {
    this.operacionPrincipalService
      .getOperacionPrincipal(Id_OperacionPrincipal)
      .subscribe((datos) => {
        this.formaOperacionPrincipal.patchValue({
          Id_OperacionPrincipal: datos.Id_OperacionPrincipal,
          DescripcionOperacion: datos.DescripcionOperacion,
          FechaOperacion: formatDate(
            new Date(datos.FechaOperacion),
            'yyyy-MM-dd',
            'en-GB',
            '+0500'
          ),
          ResponsableGiro: datos.ResponsableGiro,
          CodigoOperacion: datos.CodigoOperacion,
          Numero: datos.Numero,
          Ano: datos.Ano,
          Mes: datos.Mes,
          Codigo_Proyecto: datos.Codigo_Proyecto,
          C01: datos.C01,
          C02: datos.C02,
          C03: datos.C03,
          C04: datos.C04,
          C06: datos.C06,
          C07: datos.C07,
          C08: datos.C08,
          C09: datos.C09,
          C10: datos.C10,
          C11: datos.C11,
          C12: datos.C12,
          C13: datos.C13,
          C14: datos.C14,
          C16: datos.C16,
          C17: datos.C17,
          C18: datos.C18,
          C19: datos.C19,
          C20: datos.C20,
          C21: datos.C21,
          C22: datos.C22,
          C23: datos.C23,
          C24: datos.C24,
          C25: datos.C25,
          C26: datos.C26,
          C27: datos.C27,
          C28: datos.C28,
          C29: datos.C29,
          C30: datos.C30,
          C31: datos.C31,
          C32: datos.C32,
          C33: datos.C33,
          C34: datos.C34,
          C35: datos.C35,
          C36: datos.C36,
          C37: datos.C37,
          C38: datos.C38,
          C39: datos.C39,
          C40: datos.C40,
          C41: datos.C41,
          C42: datos.C42,
          C43: datos.C43,
          C44: datos.C44,
          C45: datos.C45,
          C46: datos.C46,
          C47: datos.C47,
          C48: datos.C48,
          C49: datos.C49,
          C50: datos.C50,
          C51: datos.C51,
          C52: datos.C52,
          C56: datos.C56,
          C57: datos.C57,
          C58: datos.C58,
          C59: datos.C59,
          C60: datos.C60,
          C61: datos.C61,
          C62: datos.C62,
          C63: datos.C63,
          C64: datos.C64,
          C65: datos.C65,
          C66: datos.C66,
          C67: datos.C67,
          C68: datos.C68,
          C69: datos.C69,
          C70: datos.C70,
          C71: datos.C71,
          C72: datos.C72,
          C73: datos.C73,
          C74: datos.C74,
          C75: datos.C75,
          C76: datos.C76,
          C77: datos.C77,
          C78: datos.C78,
          C79: datos.C79,
          C80: datos.C80,
          C81: datos.C81,
          C82: datos.C82,
          C83: datos.C83,
          C84: datos.C84,
          C85: datos.C85,
          C87: datos.C87,
          C88: datos.C88,
          C89: datos.C89,
          C91: datos.C91,
          C92: datos.C92,
          C93: datos.C93,
          C94: datos.C94,
          C95: datos.C95,
          C96: datos.C96,
          TipoOrigen: datos.TipoOrigen,
          Solicitud: datos.Solicitud,
          AutorizacionDolares: datos.AutorizacionDolares,
          AutorizacionSoles: datos.AutorizacionSoles,
          Diferencia: datos.Diferencia,
          Cuadrado: datos.Cuadrado,
        });

        this.CargarTabla();
      });
  }

  // ==========================================
  // Cargar Operación Principal por Número de Solicitud
  // ==========================================
  CargarOperacionSolicitudHaber(Id_SR: number) {
    this.operacionService.ListaOperacionesIdSR(Id_SR).subscribe((operacion) => {
      if (operacion) {
        if (operacion.Id_Operacion) {
          this.Id_Operacion = operacion.Id_Operacion;
          this.Id_OperacionPrincipal = operacion.Id_OperacionPrincipal;

          this.DatosOperacion = operacion;

          this.formaOperacion.patchValue({
            Id_Operacion: operacion.Id_Operacion,
            Id_OperacionPrincipal: operacion.Id_OperacionPrincipal,
            TipoOrigen: operacion.TipoOrigen,
            CodigoOperacion: operacion.CodigoOperacion,
            DescripcionOperacion: operacion.DescripcionOperacion,
            FechaOperacion: formatDate(
              new Date(operacion.FechaOperacion),
              'yyyy-MM-dd',
              'en-GB',
              '+0500'
            ),
            ResponsableGiro: operacion.ResponsableGiro,
            RUCResponsableGiro: operacion.RUCResponsableGiro,
            Solicitud: operacion.Solicitud,
            TipoSR: operacion.TipoSR,
            Id_SR: operacion.Id_SR,
            Id_DetalleSR: operacion.Id_DetalleSR,
            DescripcionDetalle: operacion.DescripcionDetalle,
            TC: operacion.TC,
            Codigo_MedioPago: operacion.Codigo_MedioPago,
            Cheque: operacion.Cheque,
            ChequeSoles: operacion.ChequeSoles,
            ChequeDolares: operacion.ChequeDolares,
            Codigo_TipoDocumento: operacion.Codigo_TipoDocumento,
            Codigo_TipoRegistro: operacion.Codigo_TipoRegistro,
            SerieComprobante: operacion.SerieComprobante,
            NumeroComprobante: operacion.NumeroComprobante,
            FechaComprobante: formatDate(
              new Date(operacion.FechaComprobante),
              'yyyy-MM-dd',
              'en-GB',
              '+0500'
            ),
            RUCAuxiliar: operacion.RUCAuxiliar,
            RazonSocial: operacion.RazonSocial,
            Codigo_TipoDocumentoIdentidad:
              operacion.Codigo_TipoDocumentoIdentidad,
            Codigo_PlanProyecto: operacion.Codigo_PlanProyecto,
            Codigo_PlanCuenta: operacion.Codigo_PlanCuenta,
            Nombre_PlanCuenta: operacion.Nombre_PlanCuenta,
            MontoSoles: operacion.MontoSoles,
            MontoDolares: operacion.MontoDolares,
            DebeSoles: operacion.DebeSoles,
            HaberSoles: operacion.HaberSoles,
            DebeDolares: operacion.DebeDolares,
            HaberDolares: operacion.HaberDolares,
            C1: operacion.C1,
            C2: operacion.C2,
            C3: operacion.C3,
            C4: operacion.C4,
            C5: operacion.C5,
            C6: operacion.C6,
            C7: operacion.C7,
            C8: operacion.C8,
            C9: operacion.C9,
            C10: operacion.C10,
            V1: operacion.V1,
            V2: operacion.V2,
            V3: operacion.V3,
            V4: operacion.V4,
            V5: operacion.V5,
            V6: operacion.V6,
            V7: operacion.V7,
            Mes: operacion.Mes,
            Ano: operacion.Ano,
            Codigo_Proyecto: operacion.Codigo_Proyecto,
            Anulado: operacion.Anulado,
            Saldo: operacion.Saldo,
            CuentaPendiente: operacion.CuentaPendiente,
            TipoSaldo: operacion.TipoSaldo,
          });

          this.CargarOperacionPrincipal(this.Id_OperacionPrincipal);
        }
      } else {
        this.CargarOperacionSolicitudHaber(Id_SR);
      }
    });
  }

  // ==========================================
  // Guarda DetalleSR
  // ==========================================
  GuardarDetalleSR() {
    if (this.Id_DetalleSR === 0) {
      this.detalleSRService
        .GuardarDetalleSR(this.formaDetalleSR.value)
        .subscribe((datos) => {
          this.CargarTabla();
          this.LimpiarFormaDetalleSR();
          this.formModalDetalleSR.hide();
        });
    } else {
      this.detalleSRService
        .ActualizarDetalleSR(this.formaDetalleSR.value)
        .subscribe((datos) => {
          this.CargarTabla();
          this.LimpiarFormaDetalleSR();
          this.formModalDetalleSR.hide();
        });
    }
  }

  // ==========================================
  // Limpiar Forma DetalleSR
  // ==========================================
  LimpiarFormaDetalleSR() {
    this.Id_DetalleSR = 0;
    this.formaDetalleSR.patchValue({
      Id_DetalleSR: 0,
      Id_SR: this.Id_SR,
      Codigo_PlanProyecto: '',
      Presupuesto: 0,
      Gasto: 0,
      Actividad: '',
    });
  }

  // ==========================================
  // Cargar Forma DetalleSR al hacer Click Editar
  // ==========================================
  CargarFormaDetalleSR(detalleSR: any) {
    this.Id_DetalleSR = detalleSR.Id_DetalleSR;
    this.formaDetalleSR.patchValue({
      Id_DetalleSR: this.Id_DetalleSR,
      Id_SR: detalleSR.Id_SR,
      Codigo_PlanProyecto: detalleSR.Codigo_PlanProyecto,
      Presupuesto: detalleSR.Presupuesto,
      Gasto: detalleSR.Gasto,
      Actividad: detalleSR.Actividad,
    });
  }

  // ==========================================
  // Eliminar DetalleSR al hacer Click Delete
  // ==========================================
  async EliminarDetalleSR(Id_DetalleSR: number) {
    await swal
      .fire({
        title: 'Eliminar Registro?',
        icon: 'question',
        text: 'Está seguro de eliminar este Registro?',
        confirmButtonText: 'Eliminar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.detalleSRService
            .EliminarDetalleSR(Id_DetalleSR)
            .subscribe((datos) => {
              this.CargarTabla();
              this.LimpiarFormaDetalleSR();
            });
        } else {
          swal.fire(
            'Operacion Cancelada!',
            'El registro no se eliminó',
            'error'
          );
        }
      });
  }

  ActualizarInfoCuenta(TipoOrigen: any) {
    this.TipoOrigen = TipoOrigen;
    this.CargarCodigoOperacion(
      this.VariablesSistema.Ano,
      this.VariablesSistema.Mes,
      TipoOrigen,
      this.VariablesSistema.Id_Proyecto
    );
    this.formaOperacionPrincipal.patchValue({
      TipoOrigen: TipoOrigen,
    });
  }

  // ==========================================
  // Modal - Plan Contable
  // ==========================================

  cargarPlanContable(Ano: number) {
    // tslint:disable-next-line: deprecation
    this.planContableService.ListaPlanContable(Ano).subscribe((datos: any) => {
      this.planContable = datos;

      this.tablaPlanContable = this.planContable.map((prop, key) => {
        return {
          ...prop,
          id: key,
        };
      });
    });
  }
  BuscarPlanContable(modalForm: TemplateRef<any>) {
    this.formModalPlanContable = this.modalService.show(modalForm, {
      class: 'modal-lg',
    });
  }
  onSelectBuscarPlanContable({ selected }) {
    this.formaOperacion.patchValue({
      Codigo_PlanCuenta: selected[0].Codigo_PlanCuenta,
      Nombre_PlanCuenta: selected[0].Nombre_PlanCuenta,
    });

    this.formModalPlanContable.hide();
  }
  filterBuscarPlanContable($event) {
    const val = $event.target.value.toLowerCase();
    this.tablaPlanContable = this.planContable.filter((d: any) => {
      for (const key in d) {
        if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  // ==========================================
  // Modal - Buscar Auxiliar
  // ==========================================
  cargarAuxiliares() {
    // tslint:disable-next-line: deprecation
    this.auxiliarService.getAuxiliares().subscribe((datos) => {
      this.auxiliares = datos;

      this.tablaAuxiliar = this.auxiliares.map((prop, key) => {
        return {
          ...prop,
          id: key,
        };
      });
    });
  }

  BuscarAuxiliar(modalForm: TemplateRef<any>) {
    this.cargarAuxiliares();
    this.formModalBuscarAuxiliares = this.modalService.show(modalForm, {
      class: 'modal-lg',
    });
  }

  onSelectBuscarAuxiliar({ selected }) {
    this.formaOperacion.patchValue({
      ResponsableGiro: selected[0].RazonSocial,
      RUCResponsableGiro: selected[0].RUC,
      RUCAuxiliar: selected[0].RUC,
      RazonSocial: selected[0].RazonSocial,
      Codigo_TipoDocumentoIdentidad: selected[0].Codigo_TipoDocumentoIdentidad,
    });

    this.formaOperacionPrincipal.patchValue({
      ResponsableGiro: selected[0].RazonSocial,
    });

    this.formaSR.patchValue({
      Responsable: selected[0].RazonSocial,
      RUCResponsable: selected[0].RUC,
    });

    this.formModalBuscarAuxiliares.hide();
  }

  filterBuscarAuxiliar($event) {
    const val = $event.target.value.toLowerCase();
    this.tablaAuxiliar = this.auxiliares.filter((d: any) => {
      for (const key in d) {
        if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  // ==========================================
  // Modal - SUNAT
  // ==========================================
  // ==========================================
  // Limpiar Formulario
  // ============================================
  Limpiar() {
    this.formaAuxiliar.patchValue({
      Id_Auxiliar: 0,
      RUC: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      Nombres: '',
      RazonSocial: '',
      Direccion: '',
      Codigo_TipoDocumentoIdentidad: '0',
    });
  }
  AbrirModalSunat(modalForm: TemplateRef<any>) {
    this.Limpiar();
    this.formModalSUNAT = this.modalService.show(modalForm, {
      class: 'modal-sm',
    });
  }

  // ==========================================
  // Buscar Auxiliar SUNAT
  // ==========================================
  BuscarAuxiliarSUNAT() {
    const RUC: string = this.formaAuxiliar.controls['RUC'].value;

    if (RUC.length === 8 || RUC.length === 11) {
      this.auxiliarService.BuscarAuxiliarSUNAT(RUC).subscribe((datos) => {
        if (datos.RUC) {
          if (!datos.Direccion) {
            datos.Direccion = '';
          }
          this.formaAuxiliar.patchValue({
            Codigo_TipoDocumentoIdentidad:
              datos.Codigo_TipoDocumentoIdentidad.toString(),
            ApellidoPaterno: datos.ApellidoPaterno,
            ApellidoMaterno: datos.ApellidoMaterno,
            Nombres: datos.Nombres,
            Direccion: datos.Direccion,
            RazonSocial: datos.RazonSocial,
          });
        } else {
          swal.fire(
            'Auxiliar no Encontrado',
            'El Auxiliar no existe en la Base de Datos de la SUNAT',
            'error'
          );
        }
      });
    } else {
      swal.fire(
        'Número Incorrecto',
        'El Número de Caracteres debe ser DNI=8 o RUC=11',
        'error'
      );
    }
  }

  // ==========================================
  // Cargar Select TipoDocumento
  // ==========================================
  CargarTipoDocumento() {
    // tslint:disable-next-line: deprecation
    this.tipoDocumentoService.getTipoDocumentos().subscribe((datos) => {
      this.TipoDocumentos = datos;
    });
  }

  // ==========================================
  // Cargar Select TipoDocumentoIdentidad
  // ==========================================
  CargarTipoDocumentoIdentidad() {
    // tslint:disable-next-line: deprecation
    this.tipoDocumentoIdentidadService
      .getTipoDocumentoIdentidades()
      .subscribe((datos: any) => {
        this.TipoDocumentoIdentidad = datos.TipoDocumentoIdentidad;
      });
  }

  // ==========================================
  // Buscar Auxiliar en BD Local para ver si existe
  // ============================================
  BuscarAuxiliarLocal() {
    const RUC = this.formaAuxiliar.controls['RUC'].value;
    this.auxiliarService.FiltrarAuxiliarRUC(RUC).subscribe((datos) => {
      if (datos) {
        this.formaAuxiliar.patchValue({
          Id_Auxiliar: datos.Id_Auxiliar,
        });

        Swal.fire({
          title: 'Actualizar Registro',
          icon: 'question',
          text: 'El Auxiliar esite en la Base de Datos Local, Desea Actualizar el Registro?',
          confirmButtonText: 'Actualizar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.ActualizarAuxiliar();
            this.formModalSUNAT.hide();
          }
        });
      } else {
        this.GuardarAuxiliar();
        this.formModalSUNAT.hide();
      }
    });
  }

  // ==========================================
  // Guardar Auxiliar
  // ==========================================
  GuardarAuxiliar() {
    this.auxiliarService
      .crearAuxiliar(this.formaAuxiliar.value)
      .subscribe((datos) => {
        swal.fire(
          'Registro Guardado',
          'El Registro se guardó correctamente',
          'success'
        );
        this.CargarTabla();
        this.cargarAuxiliares();
      });
  }

  // ==========================================
  // Actualizar Auxiliar
  // ==========================================
  ActualizarAuxiliar() {
    this.auxiliarService
      .actualizarAuxiliar(this.formaAuxiliar.value)
      .subscribe((datos) => {
        swal.fire(
          'Registro Actualizado',
          'El Registro se actualizó correctamente',
          'success'
        );
        this.CargarTabla();
        this.cargarAuxiliares();
      });
  }

  // ==========================================
  // Modal - DetalleSR
  // ==========================================
  AbrirModalDetalleSR(modalForm: TemplateRef<any>) {
    // this.LimpiarFormaDetalleSR();
    this.formModalDetalleSR = this.modalService.show(modalForm, {
      class: 'modal-lg',
    });
  }

  // Plan de Proyecto - Modal
  BuscarPlanproyectoModal(modalForm: TemplateRef<any>) {
    this.formModalPlanProyecto = this.modalService.show(modalForm, {
      class: 'modal-lg',
    });
  }

  onSelectBuscarPlanProyecto({ selected }) {
    this.formaDetalleSR.patchValue({
      Codigo_PlanProyecto: selected[0].Codigo_PlanProyecto,
    });

    this.formModalPlanProyecto.hide();
  }
  filterBuscarPlanProyecto($event) {
    const val = $event.target.value.toLowerCase();
    this.tablaPlanProyecto = this.planProyecto.filter((d: any) => {
      for (const key in d) {
        if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  BuscarPlanProyecto() {
    // const dialogRef = this.dialog.open(BuscarPlanProyectoComponent, {
    //   width: '90%',
    //   minHeight: 'calc(100vh - 1500px)',
    //   height: 'auto',
    //   autoFocus: true,
    // });
    // dialogRef.afterClosed().subscribe((result: PlanProyectoModel) => {
    //   if (result) {
    //     this.formaDetalleSR.patchValue({
    //       Codigo_PlanProyecto: result.Codigo_PlanProyecto,
    //     });
    //   }
    // });
  }

  // ==========================================
  // Cargar Número de Operación y Generar Código de Operación
  // ==========================================
  CargarCodigoOperacion(
    Ano: number,
    Mes: string,
    TipoOrigen: string,
    Id_Proyecto: number
  ) {
    if (this.Id_OperacionPrincipal > 0) {
      const numero_operacion =
        this.formaOperacionPrincipal.controls['Numero'].value;
      if (numero_operacion) {
        if (numero_operacion <= 9) {
          this.CodigoOperacion =
            this.VariablesSistema.Indice +
            this.TipoOrigen +
            ' 00' +
            numero_operacion;
          this.NumeroOperacionPrincipal = numero_operacion;
        } else if (numero_operacion <= 99) {
          this.CodigoOperacion =
            this.VariablesSistema.Indice +
            this.TipoOrigen +
            ' 0' +
            numero_operacion;
          this.NumeroOperacionPrincipal = numero_operacion;
        } else if (numero_operacion <= 999) {
          this.CodigoOperacion =
            this.VariablesSistema.Indice +
            this.TipoOrigen +
            ' ' +
            numero_operacion;
          this.NumeroOperacionPrincipal = numero_operacion;
        }
      } else {
        this.CodigoOperacion =
          this.VariablesSistema.Indice + this.TipoOrigen + ' 001';
        this.NumeroOperacionPrincipal = 1;
      }
      this.formaOperacion.patchValue({
        CodigoOperacion: this.CodigoOperacion,
      });

      this.formaOperacionPrincipal.patchValue({
        CodigoOperacion: this.CodigoOperacion,
        Numero: this.NumeroOperacionPrincipal,
      });
    } else {
      this.operacionPrincipalService
        .getMaximoNumero(Ano, Mes, TipoOrigen, Id_Proyecto)
        // tslint:disable-next-line: deprecation
        .subscribe((numero_operacion) => {
          if (numero_operacion > 0) {
            if (numero_operacion <= 9) {
              this.CodigoOperacion =
                this.VariablesSistema.Indice +
                this.TipoOrigen +
                ' 00' +
                numero_operacion;
              this.NumeroOperacionPrincipal = numero_operacion;
            } else if (numero_operacion <= 99) {
              this.CodigoOperacion =
                this.VariablesSistema.Indice +
                this.TipoOrigen +
                ' 0' +
                numero_operacion;
              this.NumeroOperacionPrincipal = numero_operacion;
            } else if (numero_operacion <= 999) {
              this.CodigoOperacion =
                this.VariablesSistema.Indice +
                this.TipoOrigen +
                ' ' +
                numero_operacion;
              this.NumeroOperacionPrincipal = numero_operacion;
            }
          } else {
            this.CodigoOperacion =
              this.VariablesSistema.Indice + this.TipoOrigen + ' 001';
            this.NumeroOperacionPrincipal = 1;
          }

          this.formaOperacion.patchValue({
            CodigoOperacion: this.CodigoOperacion,
          });

          this.formaOperacionPrincipal.patchValue({
            CodigoOperacion: this.CodigoOperacion,
            Numero: this.NumeroOperacionPrincipal,
          });
        });
    }
  }

  RellenarDescripcion() {
    let Descripcion = this.formaSR.controls['Descripcion'].value;
    this.formaOperacion.patchValue({
      DescripcionOperacion: Descripcion,
    });

    this.formaOperacionPrincipal.patchValue({
      DescripcionOperacion: Descripcion,
    });
  }

  ActualizarLibroDiarioSimplificado() {
    // Poner los valores en 0 para volverlos allenar

    this.formaOperacionPrincipal.patchValue({
      C01: 0,
      C02: 0,
      C03: 0,
      C04: 0,
      C06: 0,
      C07: 0,
      C08: 0,
      C09: 0,
      C10: 0,
      C11: 0,
      C12: 0,
      C13: 0,
      C14: 0,
      C16: 0,
      C17: 0,
      C18: 0,
      C19: 0,
      C20: 0,
      C21: 0,
      C22: 0,
      C23: 0,
      C24: 0,
      C25: 0,
      C26: 0,
      C27: 0,
      C28: 0,
      C29: 0,
      C30: 0,
      C31: 0,
      C32: 0,
      C33: 0,
      C34: 0,
      C35: 0,
      C36: 0,
      C37: 0,
      C38: 0,
      C39: 0,
      C40: 0,
      C41: 0,
      C42: 0,
      C43: 0,
      C44: 0,
      C45: 0,
      C46: 0,
      C47: 0,
      C48: 0,
      C49: 0,
      C50: 0,
      C51: 0,
      C52: 0,
      C56: 0,
      C57: 0,
      C58: 0,
      C59: 0,
      C60: 0,
      C61: 0,
      C62: 0,
      C63: 0,
      C64: 0,
      C65: 0,
      C66: 0,
      C67: 0,
      C68: 0,
      C69: 0,
      C70: 0,
      C71: 0,
      C72: 0,
      C73: 0,
      C74: 0,
      C75: 0,
      C76: 0,
      C77: 0,
      C78: 0,
      C79: 0,
      C80: 0,
      C81: 0,
      C82: 0,
      C83: 0,
      C84: 0,
      C85: 0,
      C87: 0,
      C88: 0,
      C89: 0,
      C91: 0,
      C92: 0,
      C93: 0,
      C94: 0,
      C95: 0,
      C96: 0,
    });

    const CuentaHaber = this.formaOperacion.controls[
      'Codigo_PlanCuenta'
    ].value.slice(0, 2);
    const Monto = this.formaOperacion.controls['MontoSoles'].value;

    switch (CuentaHaber) {
      case '01':
        this.formaOperacionPrincipal.patchValue({
          C01: Monto,
        });
        break;
      case '02':
        this.formaOperacionPrincipal.patchValue({
          C02: Monto,
        });
        break;
      case '03':
        this.formaOperacionPrincipal.patchValue({
          C03: Monto,
        });
        break;
      case '04':
        this.formaOperacionPrincipal.patchValue({
          C04: Monto,
        });
        break;
      case '05':
        this.formaOperacionPrincipal.patchValue({
          C05: Monto,
        });
        break;
      case '06':
        this.formaOperacionPrincipal.patchValue({
          C06: Monto,
        });
        break;
      case '07':
        this.formaOperacionPrincipal.patchValue({
          C07: Monto,
        });
        break;
      case '08':
        this.formaOperacionPrincipal.patchValue({
          C08: Monto,
        });
        break;
      case '09':
        this.formaOperacionPrincipal.patchValue({
          C09: Monto,
        });
        break;
      case '10':
        this.formaOperacionPrincipal.patchValue({
          C10: Monto,
        });
        break;

      case '11':
        this.formaOperacionPrincipal.patchValue({
          C11: Monto,
        });
        break;
      case '12':
        this.formaOperacionPrincipal.patchValue({
          C12: Monto,
        });
        break;
      case '13':
        this.formaOperacionPrincipal.patchValue({
          C13: Monto,
        });
        break;
      case '14':
        this.formaOperacionPrincipal.patchValue({
          C14: Monto,
        });
        break;
      case '15':
        this.formaOperacionPrincipal.patchValue({
          C15: Monto,
        });
        break;
      case '16':
        this.formaOperacionPrincipal.patchValue({
          C16: Monto,
        });
        break;
      case '17':
        this.formaOperacionPrincipal.patchValue({
          C17: Monto,
        });
        break;
      case '18':
        this.formaOperacionPrincipal.patchValue({
          C18: Monto,
        });
        break;
      case '19':
        this.formaOperacionPrincipal.patchValue({
          C19: Monto,
        });
        break;
      case '20':
        this.formaOperacionPrincipal.patchValue({
          C20: Monto,
        });
        break;

      case '21':
        this.formaOperacionPrincipal.patchValue({
          C21: Monto,
        });
        break;
      case '22':
        this.formaOperacionPrincipal.patchValue({
          C22: Monto,
        });
        break;
      case '23':
        this.formaOperacionPrincipal.patchValue({
          C23: Monto,
        });
        break;
      case '24':
        this.formaOperacionPrincipal.patchValue({
          C14: Monto,
        });
        break;
      case '25':
        this.formaOperacionPrincipal.patchValue({
          C25: Monto,
        });
        break;
      case '26':
        this.formaOperacionPrincipal.patchValue({
          C26: Monto,
        });
        break;
      case '27':
        this.formaOperacionPrincipal.patchValue({
          C27: Monto,
        });
        break;
      case '28':
        this.formaOperacionPrincipal.patchValue({
          C28: Monto,
        });
        break;
      case '29':
        this.formaOperacionPrincipal.patchValue({
          C29: Monto,
        });
        break;
      case '30':
        this.formaOperacionPrincipal.patchValue({
          C30: Monto,
        });
        break;

      case '31':
        this.formaOperacionPrincipal.patchValue({
          C31: Monto,
        });
        break;
      case '32':
        this.formaOperacionPrincipal.patchValue({
          C32: Monto,
        });
        break;
      case '33':
        this.formaOperacionPrincipal.patchValue({
          C33: Monto,
        });
        break;
      case '34':
        this.formaOperacionPrincipal.patchValue({
          C34: Monto,
        });
        break;
      case '35':
        this.formaOperacionPrincipal.patchValue({
          C35: Monto,
        });
        break;
      case '36':
        this.formaOperacionPrincipal.patchValue({
          C36: Monto,
        });
        break;
      case '37':
        this.formaOperacionPrincipal.patchValue({
          C37: Monto,
        });
        break;
      case '38':
        this.formaOperacionPrincipal.patchValue({
          C38: Monto,
        });
        break;
      case '39':
        this.formaOperacionPrincipal.patchValue({
          C39: Monto,
        });
        break;
      case '40':
        this.formaOperacionPrincipal.patchValue({
          C40: Monto,
        });
        break;

      case '41':
        this.formaOperacionPrincipal.patchValue({
          C41: Monto,
        });
        break;
      case '42':
        this.formaOperacionPrincipal.patchValue({
          C42: Monto,
        });
        break;
      case '43':
        this.formaOperacionPrincipal.patchValue({
          C43: Monto,
        });
        break;
      case '44':
        this.formaOperacionPrincipal.patchValue({
          C44: Monto,
        });
        break;
      case '45':
        this.formaOperacionPrincipal.patchValue({
          C45: Monto,
        });
        break;
      case '46':
        this.formaOperacionPrincipal.patchValue({
          C46: Monto,
        });
        break;
      case '47':
        this.formaOperacionPrincipal.patchValue({
          C47: Monto,
        });
        break;
      case '48':
        this.formaOperacionPrincipal.patchValue({
          C48: Monto,
        });
        break;
      case '49':
        this.formaOperacionPrincipal.patchValue({
          C49: Monto,
        });
        break;
      case '50':
        this.formaOperacionPrincipal.patchValue({
          C50: Monto,
        });
        break;

      case '51':
        this.formaOperacionPrincipal.patchValue({
          C51: Monto,
        });
        break;
      case '52':
        this.formaOperacionPrincipal.patchValue({
          C52: Monto,
        });
        break;
      case '53':
        this.formaOperacionPrincipal.patchValue({
          C53: Monto,
        });
        break;
      case '54':
        this.formaOperacionPrincipal.patchValue({
          C54: Monto,
        });
        break;
      case '55':
        this.formaOperacionPrincipal.patchValue({
          C55: Monto,
        });
        break;
      case '56':
        this.formaOperacionPrincipal.patchValue({
          C56: Monto,
        });
        break;
      case '57':
        this.formaOperacionPrincipal.patchValue({
          C57: Monto,
        });
        break;
      case '58':
        this.formaOperacionPrincipal.patchValue({
          C58: Monto,
        });
        break;
      case '59':
        this.formaOperacionPrincipal.patchValue({
          C59: Monto,
        });
        break;
      case '60':
        this.formaOperacionPrincipal.patchValue({
          C60: Monto,
        });
        break;

      case '61':
        this.formaOperacionPrincipal.patchValue({
          C61: Monto,
        });
        break;
      case '62':
        this.formaOperacionPrincipal.patchValue({
          C62: Monto,
        });
        break;
      case '63':
        this.formaOperacionPrincipal.patchValue({
          C63: Monto,
        });
        break;
      case '64':
        this.formaOperacionPrincipal.patchValue({
          C64: Monto,
        });
        break;
      case '65':
        this.formaOperacionPrincipal.patchValue({
          C65: Monto,
        });
        break;
      case '66':
        this.formaOperacionPrincipal.patchValue({
          C66: Monto,
        });
        break;
      case '67':
        this.formaOperacionPrincipal.patchValue({
          C67: Monto,
        });
        break;
      case '68':
        this.formaOperacionPrincipal.patchValue({
          C68: Monto,
        });
        break;
      case '69':
        this.formaOperacionPrincipal.patchValue({
          C69: Monto,
        });
        break;
      case '70':
        this.formaOperacionPrincipal.patchValue({
          C70: Monto,
        });
        break;

      case '71':
        this.formaOperacionPrincipal.patchValue({
          C71: Monto,
        });
        break;
      case '72':
        this.formaOperacionPrincipal.patchValue({
          C72: Monto,
        });
        break;
      case '73':
        this.formaOperacionPrincipal.patchValue({
          C73: Monto,
        });
        break;
      case '74':
        this.formaOperacionPrincipal.patchValue({
          C74: Monto,
        });
        break;
      case '75':
        this.formaOperacionPrincipal.patchValue({
          C75: Monto,
        });
        break;
      case '76':
        this.formaOperacionPrincipal.patchValue({
          C76: Monto,
        });
        break;
      case '77':
        this.formaOperacionPrincipal.patchValue({
          C77: Monto,
        });
        break;
      case '78':
        this.formaOperacionPrincipal.patchValue({
          C78: Monto,
        });
        break;
      case '79':
        this.formaOperacionPrincipal.patchValue({
          C79: Monto,
        });
        break;
      case '80':
        this.formaOperacionPrincipal.patchValue({
          C80: Monto,
        });
        break;

      case '81':
        this.formaOperacionPrincipal.patchValue({
          C81: Monto,
        });
        break;
      case '82':
        this.formaOperacionPrincipal.patchValue({
          C82: Monto,
        });
        break;
      case '83':
        this.formaOperacionPrincipal.patchValue({
          C83: Monto,
        });
        break;
      case '84':
        this.formaOperacionPrincipal.patchValue({
          C84: Monto,
        });
        break;
      case '85':
        this.formaOperacionPrincipal.patchValue({
          C85: Monto,
        });
        break;
      case '86':
        this.formaOperacionPrincipal.patchValue({
          C86: Monto,
        });
        break;
      case '87':
        this.formaOperacionPrincipal.patchValue({
          C87: Monto,
        });
        break;
      case '88':
        this.formaOperacionPrincipal.patchValue({
          C88: Monto,
        });
        break;
      case '89':
        this.formaOperacionPrincipal.patchValue({
          C89: Monto,
        });
        break;
      case '90':
        this.formaOperacionPrincipal.patchValue({
          C90: Monto,
        });
        break;

      case '91':
        this.formaOperacionPrincipal.patchValue({
          C91: Monto,
        });
        break;
      case '92':
        this.formaOperacionPrincipal.patchValue({
          C92: Monto,
        });
        break;
      case '93':
        this.formaOperacionPrincipal.patchValue({
          C93: Monto,
        });
        break;
      case '94':
        this.formaOperacionPrincipal.patchValue({
          C94: Monto,
        });
        break;
      case '95':
        this.formaOperacionPrincipal.patchValue({
          C95: Monto,
        });
        break;
      case '96':
        this.formaOperacionPrincipal.patchValue({
          C96: Monto,
        });
        break;

      default:
        // console.log('Sin Actualizar');
        break;
    }

    this.operacionPrincipalService
      .ActualizarOperacionPrincipal(this.formaOperacionPrincipal.value)
      .subscribe((resp) => {
        this.GuardarSolicitud();
        swal.fire(
          'Solicitud Hecha!',
          'La Solicitud está lista para Rendición',
          'success'
        );
        this.route.navigate([
          '/Administrador/OperacionesDiarias/SolicitudesMes',
        ]);
      });
  }

  CambiarFecha() {
    this.formaOperacionPrincipal.patchValue({
      FechaOperacion: this.formaSR.controls['FechaSolicitud'].value,
    });

    this.formaOperacion.patchValue({
      FechaOperacion: this.formaSR.controls['FechaSolicitud'].value,
      FechaComprobante: this.formaSR.controls['FechaSolicitud'].value,
    });

    this.formaSR.patchValue({
      FechaRendicion: this.formaSR.controls['FechaSolicitud'].value,
    });
  }

  ActualizarTC(TC: any) {
    this.formaOperacion.patchValue({
      TC: TC,
    });
  }
}
