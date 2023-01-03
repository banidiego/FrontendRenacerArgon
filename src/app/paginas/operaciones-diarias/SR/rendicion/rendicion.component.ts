import { Component, OnInit, TemplateRef } from '@angular/core';
// PDF Make
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake';
import { AuxiliarModel } from '../../../../models/Auxiliar.model';
import { OrigenModel } from '../../../../models/Origen.model';
import { PlanProyectoModel } from '../../../../models/PlanProyecto.model';
import { PlanContableModel } from '../../../../models/PlanContable.model';
import { Observable, Subscription } from 'rxjs';
import { DetalleSRModel } from '../../../../models/DetalleSR.model';
import { OperacionModel } from '../../../../models/Operacion.model';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { FormGroup, FormControl } from '@angular/forms';
import {
  DatePipe,
  DecimalPipe,
  formatDate,
  TitleCasePipe,
} from '@angular/common';
import { OrigenService } from '../../../../services/origen.service';

import { ProyectoService } from '../../../../services/proyecto.service';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { SrService } from '../../../../services/sr.service';
import { OperacionPrincipalService } from '../../../../services/operacion-principal.service';
import { OperacionService } from '../../../../services/operacion.service';
import { ActivatedRoute, Router } from '@angular/router';

import { PlanContableService } from '../../../../services/plan-contable.service';
import { DetalleSrService } from '../../../../services/detalle-sr.service';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlanProyectoService } from '../../../../services/plan-proyecto.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

declare const $: any;
export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-rendicion',
  templateUrl: './rendicion.component.html',
  styleUrls: ['./rendicion.component.scss'],
})
export class RendicionComponent implements OnInit {
  // ==========================================
  // Modales
  // ==========================================
  formModalSaldo: BsModalRef;
  formModalPlanContable: BsModalRef;
  tablaPlanContable = [];
  // ==========================================
  // Tabla
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
  auxiliares: AuxiliarModel[] = [];
  origenes: OrigenModel[] = [];
  planProyecto: PlanProyectoModel[] = [];
  planContable: PlanContableModel[] = [];
  auxiliaresFiltradosResponsableGiro: Observable<AuxiliarModel[]>;
  auxiliaresFiltradosResponsable: Observable<AuxiliarModel[]>;
  PlanProyectoFiltrados: Observable<PlanProyectoModel[]>;
  PlanContableFiltrados: Observable<PlanContableModel[]>;

  // ==========================================
  // Declaración de variables de Sesion
  // ==========================================
  TipoOrigen = '';
  Origen: string; // Codigo de Proyecto
  Ano: number;
  Mes: string;
  Subscripcion: Subscription;

  // ==========================================
  // Declaración de variables de SR (Para Titulo)
  // ==========================================
  Id_SR: number;
  Serie: string;
  NumeroSolicitud: number;
  NumeroTexto: string;
  Id_TipoDocumentoIdentidad: number; // Para Responsable de la Solicitud
  FechaSolicitud: Date; // Para valor del Input Fecha Solicitud

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
  TotalGasto: number;
  TotalSaldo: number;
  CodigoOperacion: string;
  NumeroOperacionPrincipal: number;
  NumeroMes: number;
  PrimerDia: Date;
  UltimoDia: Date;
  MensajeSaldo: string;
  TipoSaldo: number;
  NumeroDocumentoSaldo: string;
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
  formaOperacionSaldo: FormGroup;

  constructor(
    public datepipe: DatePipe,
    private titlecasePipe: TitleCasePipe,
    private decimalPipe: DecimalPipe,
    private origenService: OrigenService,
    private modalService: BsModalService,
    private proyectoService: ProyectoService,
    private variablesGlobalesService: VariablesGlobalesService,
    private srService: SrService,
    private operacionPrincipalService: OperacionPrincipalService,
    private operacionService: OperacionService,
    private router: ActivatedRoute,
    private planProyectoService: PlanProyectoService,
    private planContableService: PlanContableService,
    private detalleSRService: DetalleSrService,
    private route: Router
  ) {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;
    this.MinMaxFecha();
    this.crearFormulariosReactivos();
    this.ObservableAutocompletePlanContable();
    this.cargarPlanContable(this.VariablesSistema.Ano);
    // this.cargarPlanProyecto(
    //   this.VariablesSistema.Ano,
    //   this.VariablesSistema.Id_Proyecto
    // );

    this.CargarOrigen(
      this.VariablesSistema.Ano,
      this.VariablesSistema.Id_Proyecto
    );
    this.CargarProyecto(this.VariablesSistema.Id_Proyecto);
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
      Responsable: new FormControl({ value: '' }),
      RUCResponsable: new FormControl(''),
      FechaSolicitud: new FormControl({ value: new Date() }),
      EntidadCooperante: new FormControl({ value: '' }),
      Cheque: new FormControl(''),
      MonedaCheque: new FormControl(''),
      ImporteCheque: new FormControl(0),
      TCCheque: new FormControl(0),
      Descripcion: new FormControl({ value: '' }),
      FechaRendicion: new FormControl({ value: new Date() }),
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
      DescripcionOperacion: new FormControl(0),
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
      TC: new FormControl(1),
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

    // Formulario Operación Saldo (Tipo SR 3)
    this.formaOperacionSaldo = new FormGroup({
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
      TC: new FormControl(1),
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
  }

  /** Gets the total cost of all transactions. */
  // ==========================================
  // Suma de Totales
  // ==========================================
  SumaTotalPresupuesto() {
    this.TotalPresupuesto = this.Datos.map((t) => t.Presupuesto).reduce(
      (acc, value) => acc + value,
      0
    );

    this.TotalSaldo = this.TotalPresupuesto - this.TotalGasto;
    return this.TotalPresupuesto;
  }

  SumaTotalGasto() {
    this.TotalGasto = this.Datos.map((t) => t.Gasto).reduce(
      (acc, value) => acc + value,
      0
    );

    this.TotalSaldo = this.TotalPresupuesto - this.TotalGasto;
    return this.TotalGasto;
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
      this.CargarSR(this.Id_SR);
    });
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

  GuardarSolicitud() {
    // this.AsignarValoresFormularios();
    // Primero Evaluamos si se Actualiza o Guarda el SR
    if (this.formaSR.controls['Id_SR'].value > 0) {
      this.ActualizarOperacionSR();
      // Actualizamos la Información de SR
      this.srService.ActualizarSR(this.formaSR.value).subscribe((info) => {
        // Actualizamos la Información de Operación
        this.operacionService
          .ActualizarOperacion(this.formaOperacion.value)
          .subscribe((resp) => {
            // Actualizamos la Información de Operación Principal
          });
      });
    } else {
      this.srService.GuardarSR(this.formaSR.value).subscribe((respuesta) => {
        this.formaSR.setValue(respuesta);

        this.formaDetalleSR.patchValue({
          Id_SR: this.formaSR.controls['Id_SR'].value,
        });
        this.Id_SR = this.formaSR.controls['Id_SR'].value;

        // Ahora Guardamos La Operación Principal
        if (
          this.formaOperacionPrincipal.controls['Id_OperacionPrincipal'].value >
          0
        ) {
          this.operacionPrincipalService
            .ActualizarOperacionPrincipal(this.formaOperacionPrincipal.value)
            .subscribe((resp) => {});
        } else {
          this.operacionPrincipalService
            .GuardarOperacionPrincipal(this.formaOperacionPrincipal.value)
            .subscribe((resp) => {
              this.formaOperacionPrincipal.setValue(resp);
              this.Id_OperacionPrincipal =
                this.formaOperacionPrincipal.controls[
                  'Id_OperacionPrincipal'
                ].value;
              this.formaOperacion.patchValue({
                Id_OperacionPrincipal:
                  this.formaOperacionPrincipal.controls['Id_OperacionPrincipal']
                    .value,
                Id_SR: this.Id_SR,
                TipoSR: 1,
              });

              // Ahora Guardamos la Operación
              if (this.formaOperacion.controls['Id_Operacion'].value > 0) {
                this.operacionService
                  .ActualizarOperacion(this.formaOperacion.value)
                  .subscribe((dato) => {});
              } else {
                this.operacionService
                  .GuardarOperacion(this.formaOperacion.value)
                  .subscribe((dato: any) => {
                    this.formaOperacion.setValue(dato);
                    this.Id_Operacion = dato.Id_Operacion;
                  });
              }
            });
        }

        this.route.navigate([
          'Administracion/Solicitud/',
          this.formaSR.controls['Id_SR'].value,
        ]);
      });
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
  // Función para cargar Tabla
  // ==========================================
  CargarTabla() {
    this.detalleSRService
      .ListaDetalleSRIdSR(this.Id_SR)
      .subscribe((datos: any) => {
        this.Datos = datos;

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
          'en-US',
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

      this.CargarNumeroSolicitud(
        this.VariablesSistema.Ano,
        this.VariablesSistema.Id_Proyecto
      );

      this.CargarOperacionSolicitudHaber(datos.Id_SR); // DEspués Carga también la OperacionPrincipal
      this.CargarOperacionSRTipo3(datos.Id_SR);

      // this.CargarTabla();

      // this.cargarCodigoOperacion(
      //   this.Ano,
      //   this.Mes,
      //   this.TipoOrigen,
      //   this.Origen
      // );
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
            'en-US',
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
            'en-US',
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
            'en-US',
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
    });
  }

  // ==========================================
  // Cargar Operación Principal por Número de Solicitud
  // ==========================================
  CargarOperacionSRTipo3(Id_SR: number) {
    this.operacionService.SRTipo3(Id_SR).subscribe((operacion) => {
      if (operacion !== undefined) {
        // console.log('No es indefinido');
        this.formaOperacionSaldo.setValue(operacion);

        if (
          this.formaSR.controls['MontoCC'].value > 0 ||
          this.formaSR.controls['NCC'].value !== ''
        ) {
          this.MensajeSaldo = ' Comprobante de Caja:';
          this.NumeroDocumentoSaldo = this.formaSR.controls['NCC'].value;
          this.TipoSaldo = this.formaSR.controls['MontoCC'].value.toFixed(2);
        }

        if (
          this.formaSR.controls['MontoRI'].value > 0 ||
          this.formaSR.controls['NRI'].value !== ''
        ) {
          this.MensajeSaldo = ' Recibo de Ingreso';
          this.NumeroDocumentoSaldo = this.formaSR.controls['NRI'].value;
          this.TipoSaldo = this.formaSR.controls['MontoRI'].value.toFixed(2);
        }
      } else {
        // console.log('Es indefinido');
        this.formaOperacionSaldo.patchValue({
          Id_Operacion: 0,
          Id_OperacionPrincipal:
            this.formaOperacion.controls['Id_OperacionPrincipal'].value,
          TipoOrigen: this.formaOperacion.controls['TipoOrigen'].value,
          CodigoOperacion:
            this.formaOperacion.controls['CodigoOperacion'].value,
          DescripcionOperacion:
            this.formaOperacion.controls['DescripcionOperacion'].value,
          FechaOperacion: this.formaSR.controls['FechaRendicion'].value,
          ResponsableGiro:
            this.formaOperacion.controls['ResponsableGiro'].value,
          RUCResponsableGiro:
            this.formaOperacion.controls['RUCResponsableGiro'].value,
          Solicitud: this.formaOperacion.controls['Solicitud'].value,
          TipoSR: 3,
          Id_SR: this.formaOperacion.controls['Id_SR'].value,
          Id_DetalleSR: this.formaOperacion.controls['Id_DetalleSR'].value,
          DescripcionDetalle:
            this.formaOperacion.controls['DescripcionDetalle'].value,
          TC: this.formaOperacion.controls['TC'].value,
          Codigo_MedioPago: '000',
          ChequeSoles: this.formaOperacion.controls['ChequeSoles'].value,
          ChequeDolares: this.formaOperacion.controls['ChequeDolares'].value,
          Codigo_TipoDocumento:
            this.formaOperacion.controls['Codigo_TipoDocumento'].value,
          Codigo_TipoRegistro:
            this.formaOperacion.controls['Codigo_TipoRegistro'].value,
          SerieComprobante:
            this.formaOperacion.controls['SerieComprobante'].value,
          NumeroComprobante:
            this.formaOperacion.controls['NumeroComprobante'].value,
          FechaComprobante: this.formaSR.controls['FechaRendicion'].value,
          RUCAuxiliar: this.formaOperacion.controls['RUCAuxiliar'].value,
          RazonSocial: this.formaOperacion.controls['RazonSocial'].value,
          Codigo_TipoDocumentoIdentidad:
            this.formaOperacion.controls['Codigo_TipoDocumentoIdentidad'].value,
          Codigo_PlanProyecto:
            this.formaOperacion.controls['Codigo_PlanProyecto'].value,
          Codigo_PlanCuenta: '',
          Nombre_PlanCuenta: '',
          MontoSoles: 0,
          MontoDolares: 0,
          DebeSoles: 0,
          HaberSoles: 0,
          DebeDolares: 0,
          HaberDolares: 0,
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          C6: 0,
          C7: 0,
          C8: 0,
          C9: 0,
          C10: 0,
          V1: 0,
          V2: 0,
          V3: 0,
          V4: 0,
          V5: 0,
          V6: 0,
          V7: 0,
          Mes: this.formaOperacion.controls['Mes'].value,
          Ano: this.formaOperacion.controls['Ano'].value,
          Id_Proyecto: this.formaOperacion.controls['Id_Proyecto'].value,
          Anulado: this.formaOperacion.controls['Anulado'].value,
          Saldo: this.formaOperacion.controls['Saldo'].value,
          CuentaPendiente:
            this.formaOperacion.controls['CuentaPendiente'].value,
          TipoSaldo: this.formaOperacion.controls['TipoSaldo'].value,
          Cerrado: this.formaOperacion.controls['Cerrado'].value,
        });
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
        });
    } else {
      this.detalleSRService
        .ActualizarDetalleSR(this.formaDetalleSR.value)
        .subscribe((datos) => {
          this.CargarTabla();
          this.LimpiarFormaDetalleSR();
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

  BuscarPlanContable() {
    // const dialogRef = this.dialog.open(BuscarPlanContableComponent, {
    //   width: '90%',
    //   minHeight: 'calc(100vh - 1500px)',
    //   height: 'auto',
    //   autoFocus: true,
    // });
    // dialogRef.afterClosed().subscribe((result: PlanContableModel) => {
    //   if (result) {
    //     this.formaOperacion.patchValue({
    //       Codigo_PlanCuenta: result.Codigo_PlanCuenta,
    //       Nombre_PlanCuenta: result.Nombre_PlanCuenta,
    //     });
    //   }
    // });
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

  BuscarAuxiliar() {
    // const dialogRef = this.dialog.open(BuscarAuxiliarComponent, {
    //   width: '90%',
    //   minHeight: 'calc(100vh - 1500px)',
    //   height: 'auto',
    // });
    // dialogRef.afterClosed().subscribe((result: AuxiliarModel) => {
    //   if (result) {
    //     this.formaOperacion.patchValue({
    //       ResponsableGiro: result.RUC,
    //       RUCResponsableGiro: result.RazonSocial,
    //       RUCAuxiliar: result.RUC,
    //       RazonSocial: result.RazonSocial,
    //       Codigo_TipoDocumentoIdentidad: result.Codigo_TipoDocumentoIdentidad,
    //     });
    //     this.formaOperacionPrincipal.patchValue({
    //       ResponsableGiro: result.RazonSocial,
    //     });
    //     this.formaSR.patchValue({
    //       Responsable: result.RazonSocial,
    //       RUCResponsable: result.RUC,
    //     });
    //   }
    // });
  }

  RellenarDescripcion(Descripcion: string) {
    this.formaOperacion.patchValue({
      DescripcionOperacion: Descripcion,
    });

    this.formaOperacionPrincipal.patchValue({
      DescripcionOperacion: Descripcion,
    });
  }

  AbrirRegistroGasto(Id_DetalleSR: number) {
    this.route.navigate([
      '/Administrador/OperacionesDiarias/Rendicion/',
      this.Id_SR,
      'RegistroGasto',
      Id_DetalleSR,
    ]);
  }

  // ==========================================
  // Al abrir Modal ejecuta esta funcion
  // ==========================================
  AbrirRegistroSaldo() {
    // Rellenar la formaOperacionSaldo, primero con los valores del TipoSR 1, despues corregir los valores necesarios
    if (this.formaOperacionSaldo.controls['Id_Operacion'].value === 0) {
      this.formaOperacionSaldo.patchValue({
        Id_OperacionPrincipal:
          this.formaOperacion.controls['Id_OperacionPrincipal'].value,
        TipoOrigen: this.formaOperacion.controls['TipoOrigen'].value,
        CodigoOperacion: this.formaOperacion.controls['CodigoOperacion'].value,
        DescripcionOperacion:
          this.formaOperacion.controls['DescripcionOperacion'].value,
        FechaOperacion: this.formaSR.controls['FechaRendicion'].value,
        ResponsableGiro: this.formaOperacion.controls['ResponsableGiro'].value,
        RUCResponsableGiro:
          this.formaOperacion.controls['RUCResponsableGiro'].value,
        Solicitud: this.formaOperacion.controls['Solicitud'].value,
        TipoSR: 3,
        Id_SR: this.formaOperacion.controls['Id_SR'].value,
        Id_DetalleSR: this.formaOperacion.controls['Id_DetalleSR'].value,
        DescripcionDetalle:
          this.formaOperacion.controls['DescripcionDetalle'].value,
        TC: this.formaOperacion.controls['TC'].value,
        Codigo_MedioPago: '000',
        ChequeSoles: this.formaOperacion.controls['ChequeSoles'].value,
        ChequeDolares: this.formaOperacion.controls['ChequeDolares'].value,
        Codigo_TipoDocumento:
          this.formaOperacion.controls['Codigo_TipoDocumento'].value,
        Codigo_TipoRegistro:
          this.formaOperacion.controls['Codigo_TipoRegistro'].value,
        SerieComprobante:
          this.formaOperacion.controls['SerieComprobante'].value,
        NumeroComprobante:
          this.formaOperacion.controls['NumeroComprobante'].value,
        FechaComprobante: this.formaSR.controls['FechaRendicion'].value,
        RUCAuxiliar: this.formaOperacion.controls['RUCAuxiliar'].value,
        RazonSocial: this.formaOperacion.controls['RazonSocial'].value,
        Codigo_TipoDocumentoIdentidad:
          this.formaOperacion.controls['Codigo_TipoDocumentoIdentidad'].value,
        Codigo_PlanProyecto:
          this.formaOperacion.controls['Codigo_PlanProyecto'].value,
        Codigo_PlanCuenta: '',
        Nombre_PlanCuenta: '',
        MontoSoles: 0,
        MontoDolares: 0,
        DebeSoles: 0,
        HaberSoles: 0,
        DebeDolares: 0,
        HaberDolares: 0,
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 0,
        C6: 0,
        C7: 0,
        C8: 0,
        C9: 0,
        C10: 0,
        V1: 0,
        V2: 0,
        V3: 0,
        V4: 0,
        V5: 0,
        V6: 0,
        V7: 0,
        Mes: this.formaOperacion.controls['Mes'].value,
        Ano: this.formaOperacion.controls['Ano'].value,
        Id_Proyecto: this.formaOperacion.controls['Id_Proyecto'].value,
        Anulado: this.formaOperacion.controls['Anulado'].value,
        Saldo: this.formaOperacion.controls['Saldo'].value,
        CuentaPendiente: this.formaOperacion.controls['CuentaPendiente'].value,
        TipoSaldo: this.formaOperacion.controls['TipoSaldo'].value,
        Cerrado: this.formaOperacion.controls['Cerrado'].value,
      });
    }
  }

  // ==========================================
  // Registrar Saldo
  // ==========================================
  RegistrarSaldo() {
    if (this.TotalSaldo > 0) {
      // console.log('Recibo de Ingreso');
      const Monto = this.formaSR.controls['MontoRI'].value;
      this.formaOperacionSaldo.patchValue({
        Codigo_TipoDocumento: 'RI',
        NumeroComprobante: this.formaSR.controls['NRI'].value,
        MontoSoles: Monto,
        MontoDolares: Monto / this.formaOperacionSaldo.controls['TC'].value,
        DebeSoles: Monto,
        HaberSoles: 0,
        DebeDolares: Monto / this.formaOperacionSaldo.controls['TC'].value,
        HaberDolares: 0,
        C1: Monto,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 0,
        C6: 0,
        C7: 0,
        C8: 0,
        C9: 0,
        C10: 0,
        V1: 0,
        V2: 0,
        V3: 0,
        V4: 0,
        V5: 0,
        V6: 0,
        V7: 0,
      });

      this.formaSR.patchValue({
        TotalGasto:
          this.TotalSaldo +
          this.formaSR.controls['MontoRI'].value -
          this.formaSR.controls['MontoCC'].value,
        NCC: '',
        MontoCC: 0,
        FechaSolicitud: formatDate(
          new Date(this.formaSR.controls['FechaSolicitud'].value),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
      });

      if (this.formaOperacionSaldo.controls['Id_Operacion'].value === 0) {
        this.operacionService
          .GuardarOperacion(this.formaOperacionSaldo.value)
          .subscribe((resp) => {
            this.srService
              .ActualizarSR(this.formaSR.value)
              .subscribe((dato) => {
                // console.log('SR Actualizada');
                this.CargarOperacionSRTipo3(
                  this.formaSR.controls['Id_SR'].value
                );
              });
          });
      } else {
        this.operacionService
          .ActualizarOperacion(this.formaOperacionSaldo.value)
          .subscribe((resp) => {
            // console.log('Operacion Actualizada');
            this.srService
              .ActualizarSR(this.formaSR.value)
              .subscribe((dato) => {
                // console.log('SR Actualizada');
                this.CargarOperacionSRTipo3(
                  this.formaSR.controls['Id_SR'].value
                );
              });
          });
      }
      this.formModalSaldo.hide();
    } else {
      // console.log('Comprobante de Caja');

      const Monto = this.formaSR.controls['MontoCC'].value;
      this.formaOperacionSaldo.patchValue({
        Codigo_TipoDocumento: 'CC',
        NumeroComprobante: this.formaSR.controls['NCC'].value,
        MontoSoles: Monto,
        MontoDolares: Monto / this.formaOperacionSaldo.controls['TC'].value,
        DebeSoles: 0,
        HaberSoles: Monto,
        DebeDolares: 0,
        HaberDolares: Monto / this.formaOperacionSaldo.controls['TC'].value,
        C1: Monto,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 0,
        C6: 0,
        C7: 0,
        C8: 0,
        C9: 0,
        C10: 0,
        V1: 0,
        V2: 0,
        V3: 0,
        V4: 0,
        V5: 0,
        V6: 0,
        V7: 0,
      });

      this.formaSR.patchValue({
        TotalGasto:
          this.SumaTotalGasto() +
          this.formaSR.controls['MontoRI'].value -
          this.formaSR.controls['MontoCC'].value,
        FechaSolicitud: formatDate(
          new Date(this.formaSR.controls['FechaSolicitud'].value),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
        NRI: '',
        MontoRI: 0,
      });

      if (this.formaOperacionSaldo.controls['Id_Operacion'].value === 0) {
        this.operacionService
          .GuardarOperacion(this.formaOperacionSaldo.value)
          .subscribe((resp) => {
            this.srService
              .ActualizarSR(this.formaSR.value)
              .subscribe((dato) => {
                // console.log('SR Actualizada');
                this.CargarOperacionSRTipo3(
                  this.formaSR.controls['Id_SR'].value
                );
              });
          });
      } else {
        this.operacionService
          .ActualizarOperacion(this.formaOperacionSaldo.value)
          .subscribe((resp) => {
            // console.log('Operacion Actualizada');
            this.srService
              .ActualizarSR(this.formaSR.value)
              .subscribe((dato) => {
                // console.log('SR Actualizada');
                this.CargarOperacionSRTipo3(
                  this.formaSR.controls['Id_SR'].value
                );
              });
          });
      }
      this.formModalSaldo.hide();
    }
  }

  // ==========================================
  // Eliminar Operacion Saldo Tipo SR 3
  // ==========================================
  EliminarOperacionTipoSR3() {
    this.formaSR.patchValue({
      TotalGasto: this.SumaTotalGasto(),
      NRI: '',
      MontoRI: 0,
      NCC: '',
      MontoCC: 0,
    });

    this.operacionService
      .EliminarOperacion(
        this.formaOperacionSaldo.controls['Id_Operacion'].value
      )
      .subscribe((resp) => {
        this.operacionService
          .ActualizarOperacion(this.formaOperacionSaldo.value)
          // tslint:disable-next-line: no-shadowed-variable
          .subscribe((resp: any) => {
            this.srService
              .ActualizarSR(this.formaSR.value)
              .subscribe((dato) => {
                // console.log('SR Actualizada');
                this.CargarOperacionSRTipo3(
                  this.formaSR.controls['Id_SR'].value
                );
              });
          });
      });
  }

  // ==========================================
  // Función Observable que Filtra Autocomplete
  // ==========================================
  ObservableAutocompletePlanContable() {
    // this.PlanContableFiltrados = this.formaOperacionSaldo
    //   .get('Codigo_PlanCuenta')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map((resp) =>
    //       resp ? this._filtrarPlanContable(resp) : this.planContable.slice()
    //     )
    //   );
  }

  // ==========================================
  // Función que filtra datos
  // ==========================================
  private _filtrarPlanContable(value: string): PlanContableModel[] {
    const filterValue = value.toString();

    return this.planContable.filter(
      (resp) => resp.Codigo_PlanCuenta.toString().indexOf(filterValue) === 0
    );
  }

  // ==========================================
  // Carga PlanContable para alimentar el Autocomplete
  // ==========================================
  cargarPlanContable(Ano: number) {
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

  onSelectBuscarPlanContable({ selected }) {
    this.formaOperacionSaldo.patchValue({
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
  // Actualiza el Nombre_PlanCuenta en el formOperacionSaldo
  // ==========================================
  CargarNombrePlanCuenta(Nombre_PlanCuenta: any) {
    this.formaOperacionSaldo.patchValue({
      Nombre_PlanCuenta: Nombre_PlanCuenta,
    });
  }

  // ==========================================
  // Actualizar LibroDiarioSimplificado por Id_OperacionPrincipal
  // ==========================================
  ActualizarLibroDiarioSimplificado() {
    const SaldoSolicitud = (
      this.formaSR.controls['Presupuesto'].value -
      (this.SumaTotalGasto() +
        this.formaSR.controls['MontoRI'].value -
        this.formaSR.controls['MontoCC'].value)
    ).toFixed(2);

    if (Number(SaldoSolicitud) === 0) {
      this.formaSR.patchValue({
        Rendido: 1,
        TotalGasto: this.SumaTotalGasto(),
        FechaSolicitud: formatDate(
          new Date(this.formaSR.controls['FechaSolicitud'].value),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
      });
    } else {
      this.formaSR.patchValue({
        Rendido: 0,
        TotalGasto: this.SumaTotalGasto(),
        FechaSolicitud: formatDate(
          new Date(this.formaSR.controls['FechaSolicitud'].value),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
      });
    }

    this.srService.ActualizarSR(this.formaSR.value).subscribe((resp) => {
      this.operacionPrincipalService
        .ActualizarLibroDiarioSimplificado(this.Id_OperacionPrincipal)
        .subscribe((datos) => {
          if (
            this.formaSR.controls['Presupuesto'].value -
              this.formaSR.controls['TotalGasto'].value -
              this.formaSR.controls['MontoRI'].value +
              this.formaSR.controls['MontoCC'].value ===
            0
          ) {
            swal.fire(
              'Rendición Finalizada',
              'La Solicitud ha sido Rendida',
              'success'
            );
            this.route.navigate([
              '/Administrador/OperacionesDiarias/SolicitudesMes',
            ]);
          } else {
            swal.fire(
              'Rendición no Finalizada',
              'La Solicitud tiene un Saldo de S/ ' +
                `${SaldoSolicitud}` +
                ' por Cuadrar',
              'success'
            );
            this.route.navigate([
              '/Administrador/OperacionesDiarias/SolicitudesMes',
            ]);
          }
        });
    });

    this.ActualizarValoresPlanProyecto();
    this.ActualizarValoresPlanContable();
  }

  AbrirModalSaldo(modalForm: TemplateRef<any>) {
    this.formModalSaldo = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  AbrirModalPlanContable(modalForm: TemplateRef<any>) {
    this.formModalPlanContable = this.modalService.show(modalForm, {
      class: 'modal-lg',
    });
  }

  CrearPDF() {
    // Actualizar primero la Forma SR antes de mostrar Datos (para Saldo correcto)
    this.formaSR.patchValue({
      TotalGasto: this.SumaTotalGasto(),
      FechaSolicitud: formatDate(
        new Date(this.formaSR.controls['FechaSolicitud'].value),
        'yyyy-MM-dd',
        'en-GB',
        '+0500'
      ),
    });

    this.srService.ActualizarSR(this.formaSR.value).subscribe((datos) => {
      // Asignacion de variables
      const Serie = this.formaSR.controls['Serie'].value;
      const Numero = this.formaSR.controls['Numero'].value;
      const Responsable = this.titlecasePipe.transform(
        this.formaSR.controls['Responsable'].value
      );
      const Descripcion = this.formaSR.controls['Descripcion'].value;
      const FechaSolicitud = this.datepipe.transform(
        this.formaSR.controls['FechaSolicitud'].value,
        'dd/MM/yyyy'
      );
      const FechaRendicion = this.datepipe.transform(
        this.formaSR.controls['FechaRendicion'].value,
        'dd/MM/yyyy'
      );
      const EntidadCooperante = this.titlecasePipe.transform(
        this.formaSR.controls['EntidadCooperante'].value
      );
      const TotalPresupuesto = this.decimalPipe.transform(
        this.formaSR.controls['Presupuesto'].value,
        '1.2-2'
      );
      const TotalGasto = this.decimalPipe.transform(
        this.formaSR.controls['TotalGasto'].value,
        '1.2-2'
      );
      const Saldo = this.decimalPipe.transform(
        this.formaSR.controls['Presupuesto'].value -
          this.formaSR.controls['TotalGasto'].value,
        '1.2-2'
      );
      const Observaciones = this.formaSR.controls['Observaciones'].value;

      // Construcción del Documento
      const documentDefinition: TDocumentDefinitions = {
        pageOrientation: 'portrait',
        // margin: [left, top, right, bottom]
        pageMargins: [60, 221, 15, 250],
        content: [
          {
            columns: [
              {
                style: 'tableExample',
                margin: [0, 0, 0, 0],
                table: {
                  headerRows: 0,
                  widths: [210, 77, 77, 77],
                  body: this.Datos.map(function (resp) {
                    return [
                      {
                        text: resp.Actividad,
                        style: 'subtitulo',
                        alignment: 'left',
                        margin: [0, 3, 0, 3],
                      },
                      {
                        text: resp.Codigo_PlanProyecto,
                        style: 'subtitulo',
                        alignment: 'center',
                        margin: [0, 3, 0, 3],
                      },
                      {
                        text: resp.Presupuesto.toFixed(2),
                        style: 'subtitulo',
                        alignment: 'right',
                        margin: [0, 3, 0, 3],
                      },
                      {
                        text: resp.Gasto.toFixed(2),
                        style: 'subtitulo',
                        alignment: 'right',
                        margin: [0, 3, 0, 3],
                      },
                    ];
                  }),
                },
                layout: {
                  hLineColor: function (i, node) {
                    return i === 0 || i === node.table.body.length
                      ? '#d9d9d9'
                      : '#d9d9d9';
                  },
                  vLineColor: function (i, node: any) {
                    return i === 0 || i === node.table.widths.length
                      ? '#d9d9d9'
                      : '#d9d9d9';
                  },
                  // hLineColor: function (i) {
                  //   return i === 1 ? '#d9d9d9' : '#d9d9d9';
                  // },
                },
              },
            ],
          },
          {
            columns: [
              {
                style: 'tableExample',
                margin: [293, 10, 0, 0],
                table: {
                  widths: [90, 77],
                  body: [
                    [
                      {
                        text: 'PRESUPUESTO TOTAL',
                        style: 'subtituloNegrita',
                        alignment: 'right',
                        border: [false, false, false, false],
                        margin: [0, 3, 0, 3],
                      },
                      {
                        text: TotalPresupuesto,
                        style: 'subtituloNegrita',
                        alignment: 'right',
                        border: [false, true, false, true],
                        margin: [0, 3, 0, 3],
                      },
                    ],
                    [
                      {
                        text: 'GASTO TOTAL',
                        style: 'subtituloNegrita',
                        alignment: 'right',
                        border: [false, false, false, false],
                        margin: [0, 3, 0, 3],
                      },
                      {
                        text: TotalGasto,
                        style: 'subtituloNegrita',
                        alignment: 'right',
                        border: [false, false, false, true],
                        margin: [0, 3, 0, 3],
                      },
                    ],
                    [
                      {
                        text: 'SALDO',
                        style: 'subtituloNegrita',
                        alignment: 'right',
                        border: [false, false, false, false],
                        margin: [0, 3, 0, 3],
                      },
                      {
                        text: Saldo,
                        style: 'subtituloNegrita',
                        alignment: 'right',
                        border: [false, false, false, true],
                        margin: [0, 3, 0, 3],
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],

        header: function (currentPage, pageCount, pageSize) {
          // you can apply any logic and return any valid pdfmake element

          return [
            {
              margin: [60, 45, 0, 0],
              columns: [
                {
                  width: 370,

                  text: [
                    {
                      text: 'RENDICIÓN DE GASTO PRESUPUESTADO',
                      style: 'header',
                    },
                    {
                      text: '\n\nSerie N°' + Serie,
                      style: 'subtitulo',
                    },
                    { text: '\nDocumento N°' + Numero, style: 'subtitulo' },
                    { text: '\nOficina - Huánuco', style: 'subtitulo' },
                  ],
                },
                {
                  image:
                    'data:image/jpeg;base64,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pMt0cdRPeyW23/2uApf4qbaRvRxUbAW0UrXJzKgCgpjhcETHZtwRO9XSdGvNcr/zKukaMr3FtcvBea5ovMtRrDpNAZst2lkjUOXGcMrZNkLyWVF5VehvOrsaE3H2zLANbnIR3NI/Ht3+vyNyy+OLX9fj0HeSkqN+kVu+ikbt98O3fxNN+CnzVpTKnKZSnL9c0cz8Y6qW6y21t4hZabBoE96ACnYririririririririririririririririririririririririririririririririririrTjSLSOFFkwWmAhqcqKzI3vHYjSJM042tA8jrgvNDiGCqTTfarTK2/wBC7VZLLZmDatqttMk/kKLIcZkm6jIExObVkXSNtw9p4K4eCkcXTu52SJe9JL6TXsc1NEFFoJWcorLKm27qA3q2UuQ42CvOY5MyBlQZ+mAaI2izXXShIzBC1Eim7vhZ2898R39Q24OZplyQBCIGo8Jcy8NdB5dw0Wtt6vzUGPvJg48Vg3prsVt2bOlyljPn0POuUjbeLWOplHHhhdvuw3jRqBLvek9wKRZrQYNFGt7Mg1YgRWCJjVtqTTJS5swIwuEiqIAi7Cvumy6I2az3i/xUt5K3FjOkrqTSgtyY7ysAYEoE4YGKC4hIOYiVsSqzWoRVVuN0gQtiY4DJlNNGfeACIy7grjWhOiNptcKG0DMBqWMGKxG1gXK4ILgO6gAU1YhRNYKljlR5cvKWtCrBFs9rZt1ltRXG4sR4MVpl7IkmS2MpttoQfbzNwWxBxCRNafYJcbloZZND7Q4rrct2/XlY0ZMJUVhoVhR46RlDe7PAYewNsVfz9DJzO4X3Q9IbhCjlotolPk70tytoUJZQtrJk5mOQceGAHqo6ooETraYYN5VvE2foJZoDGi3RrbLKPFkKsWQ3JBWngWKAC6LDWsUE1jIKSZOE2hrcZYNA0EqfMkg0yAg02L8hx0W2mwRBBsELKACiIIoiCmFWl7RzRWy6Q6aXMWnbncL65GSJawebR0wDXuA6rbWYY4BEwJwkcfdXDK2X3PINzCyQb1MnsjpWNnJtmNvcmgwakuN5cEempveO49lkKwR8JMEVJUe3/c80Un6BHb0iNSWojavw332tWL8pBFdVkfJCaPe5g5gOaUDpotWu+aR6PQLvIkyVnsR340ffE+Y9KdWAw5JNo3Ejg22J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Lkmozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfvaozfe1bYOx9AEGoMgyIoIzOyIVRl2LWXiGIv8A8Y9nFCjAAXfVFCLA74GYuDabZRNAAAQAABoAQAYKEUGUUekazi9rxcT/AA04YXSUAkCVbE3/ADHDEERSwSoNaWTiGwJVKIF1mIvQFxlwGyFkdkUc/wDGdfAKRHG6G4gjo3aMNeQkV1bElrAgmLEv+GhF7rJuo1jlbAtF2BUS4pckknpkYtUcvj1RzmMEFgC0wLKzY21pNVIxFGZYJkAlmpcwxvUQoAECwxqNqMcMc3dEIkIK6JJEalDZBz0OSQgkJIZaEDOWe3AXFi7IiIopzGeXQkRENxWU3sJpFRgoWkABgLXOtBkpTkLIIMILuxFHlYOwSNMCB2CRmy+EyaT2BEsRKAApS9CWlKEIWJo1S061HL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VHL49VJnx6o8a8EBasHVW3KWUTKQEAwiNxHU/4IaUQjNvrohoIusheoUKyQSlyRPQg0lSz8+6ln591JC2yRoGQgRMusIRMrnNDRIyL2ARuJFD0gIKagMWUalIJFwZ+OcBMuyvhMLzDWrAB6A4RFXCdSzdslNUHHOzBGXBAiwXCMFb4lsIBBlggWO8e6QiFAojJ1OsuhR8iUD50CUkQkQLpRtpAAkkBaaCdbSTYmQaaSlHIywZ20OgsQ+BBxouGrKGbibEs/PupZ+fdSz8+6ln591LPz7qWfn3Us/PupZ+fdSz8+6ln591LPz7qWfn3Us/PupZ+fdSz8+6ln591LPz7qWfn3Us/PupZ+fdKBVgXV0DLek4vBwGIhLC8ws2oACzYgZBLYFNyC1J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MLGkGNdHZiCQ6CN4kFhlS4vwKSpAS2SWBz9aAwuMCBPGz/FP3i3Cx5gBKTgwVKlPFPnEsPFez/ce7f40gFQVcETO6ISPiKf0eAarEM99Sn8ID/cjUnI3YwY1rcdSwZ0XlGrKHzCUI1oIIKXjHOlabmvQqgokhEXg9r0E5GwS6uJNOAdp/Q/EmVnuowHejihwzAWcWrtvF+omqBaHAsXYdlFNrR0vZDYWYZBwzBVGYBARDkh/apiWz6AQ2fAi6NYOAgAAUKAMMiYGaQAFUoox1bHrArA/wiAIlCx44wJwi95QZmbt2PGGtchESgi+WVi5xHWQLKAQQoUqAGioqw3akrSoPnBQ3xqQ6OzoK99AidpZWG1um0oXuP8AQmCCbgnKcWBwlHWCyDrC6D+hAMAzcHABQBuDMeE4AI3EoGXmbAQErgH9FLaledTGQ5b+hNElCAyYQCiswIQMvMWAnhv8gJQRp/RSrKb1qbyn+fjUDiG7yLw7+Tw7+Tw7+TZ+BwnmH8nmH8nmH8nmH8nmH8nmH8nmH8nmH8nmH8nmH8nmH8nmH8nmH8i+fnaTw7+Tw7+RfNOLfz8alM1N2DyqeR/yYOgNlxxxX4lr5o69ueG/z8faLAMrSpc05uwOPna/nK4vzjlG1VnWbXd6zCi1F2qTiy3K1Jc8uqr1UvlFsFzcyK5pxflbqLrQc1dZtsWwbS7wxvdl2aQLFQc1ReLjY3LcW3jX1Yxb4DAOF9GTumDplqOSxZiG93bVwqi5Afyg4RgAGwINRUbBoGzZpjtCADABgWGF1hVmECsD/Z1Has8cspnrd9X9uc1DiL+cZ6r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveeq956r3nqveIWcGocs88bv4lHXrKgc4DIB/n//Z',
                  width: 110,
                },
              ],
            },
            {
              // [left, top, right, bottom]

              columns: [
                {
                  style: 'tableExample',
                  margin: [60, 10, 0, 0],
                  table: {
                    widths: [210],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: 'RESPONSABLE',
                          style: 'subtituloNegrita',
                          margin: [-4, 0, 0, 0],
                        },
                      ],
                      [
                        {
                          text: Responsable,
                          style: 'subtitulo',
                          margin: [-4, 0, 0, 0],
                        },
                      ],
                    ],
                  },

                  layout: {
                    hLineWidth: function (i, node) {
                      return i === 1 ? 1 : 0;
                    },
                    vLineWidth: function (i, node) {
                      return 0;
                    },
                  },
                },

                {
                  style: 'tableExample',
                  margin: [50, 10, 0, 0],
                  table: {
                    widths: [110, 70],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: 'FECHA SOLICITUD:',
                          style: 'subtituloNegrita',
                          alignment: 'right',
                        },
                        {
                          text: FechaSolicitud,
                          style: 'subtitulo',
                          alignment: 'right',
                        },
                      ],
                      [
                        {
                          text: 'FECHA RENDICIÓN:',
                          style: 'subtituloNegrita',
                          alignment: 'right',
                        },
                        {
                          text: FechaRendicion,
                          style: 'subtitulo',
                          alignment: 'right',
                        },
                      ],
                      [
                        {
                          text: 'COOPERANTE:',
                          style: 'subtituloNegrita',
                          alignment: 'right',
                        },
                        {
                          text: EntidadCooperante,
                          style: 'subtitulo',
                          alignment: 'right',
                        },
                      ],
                    ],
                  },

                  layout: 'noBorders',
                },
              ],
            },
            {
              columns: [
                {
                  style: 'tableExample',
                  margin: [60, 5, 0, 0],
                  table: {
                    widths: [470],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: 'ACTIVIDAD',
                          style: 'subtituloNegrita',
                          margin: [-4, 0, 0, 0],
                        },
                      ],
                      [
                        {
                          text: Descripcion,
                          style: 'subtitulo',
                          margin: [-4, 0, 0, 0],
                        },
                      ],
                    ],
                  },

                  layout: {
                    hLineWidth: function (i, node) {
                      return i === 1 ? 1 : 0;
                    },
                    vLineWidth: function (i, node) {
                      return 0;
                    },
                  },
                },
              ],
            },
            {
              columns: [
                {
                  style: 'tableExample',
                  margin: [60, 10, 0, 0],
                  table: {
                    headerRows: 1,
                    widths: [210, 77, 77, 77],
                    body: [
                      [
                        {
                          text: 'Descripción',
                          style: 'subtituloNegrita',
                          color: 'white',
                          fillColor: '#a5a5a5',
                          alignment: 'center',
                        },
                        {
                          text: 'Código Presupuestal',
                          style: 'subtituloNegrita',
                          color: 'white',
                          fillColor: '#a5a5a5',
                          alignment: 'center',
                        },
                        {
                          text: 'Presupuesto',
                          style: 'subtituloNegrita',
                          color: 'white',
                          fillColor: '#a5a5a5',
                          alignment: 'center',
                        },
                        {
                          text: 'Gastos',
                          style: 'subtituloNegrita',
                          color: 'white',
                          fillColor: '#a5a5a5',
                          alignment: 'center',
                        },
                      ],
                    ],
                  },
                  layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex % 2 === 0 ? '#CCCCCC' : null;
                    },
                    hLineColor: function (i, node) {
                      return i === 0 || i === node.table.body.length
                        ? '#d9d9d9'
                        : '#d9d9d9';
                    },
                    vLineColor: function (i, node: any) {
                      return i === 0 || i === node.table.widths.length
                        ? '#d9d9d9'
                        : '#d9d9d9';
                    },
                  },
                },
              ],
            },
          ];
        },

        footer: (currentPage: number, pageCount: number) => {
          return [
            {
              margin: [60, 0, 0, 0],
              columns: [
                {
                  style: 'tableExample',

                  table: {
                    widths: [210],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: 'OBSERVACIONES',
                          style: 'subtituloNegrita',
                          margin: [-4, 0, 0, 0],
                        },
                      ],
                      [
                        {
                          text: Observaciones,
                          style: 'subtitulo',
                          margin: [-4, 0, 0, 0],
                        },
                      ],
                    ],
                  },

                  layout: {
                    hLineWidth: function (i, node) {
                      return i === 1 ? 1 : 0;
                    },
                    vLineWidth: function (i, node) {
                      return 0;
                    },
                  },
                },
              ],
            },
            {
              margin: [60, 10, 0, 0],
              columns: [
                {
                  style: 'tableExample',
                  margin: [0, 0, 0, 0],
                  table: {
                    headerRows: 0,
                    widths: [200, 113, 135],
                    body: [
                      [
                        {
                          text: 'Firma del Responsable',
                          style: 'subtituloNegrita',
                          alignment: 'center',
                          margin: [0, 3, 0, 70],
                        },
                        {
                          text: 'V° B° Administración',
                          style: 'subtituloNegrita',
                          alignment: 'center',
                          margin: [0, 3, 0, 3],
                        },
                        {
                          text: 'SELLO RECEPCIÓN\nRendición',
                          style: 'subtituloNegrita',
                          alignment: 'center',
                          margin: [0, 3, 0, 3],
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineColor: function (i, node) {
                      return i === 0 || i === node.table.body.length
                        ? '#d9d9d9'
                        : '#d9d9d9';
                    },
                    vLineColor: function (i, node: any) {
                      return i === 0 || i === node.table.widths.length
                        ? '#d9d9d9'
                        : '#d9d9d9';
                    },
                    // hLineColor: function (i) {
                    //   return i === 1 ? '#d9d9d9' : '#d9d9d9';
                    // },
                  },
                },
              ],
            },
            {
              margin: [60, 10, 0, 0],
              columns: [
                { qr: window.location.href, fit: 70 },
                {
                  style: 'tableExample',
                  margin: [-200, 15, 0, 0],
                  table: {
                    widths: [400],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text:
                            'Página ' +
                            currentPage.toString() +
                            ' de ' +
                            pageCount +
                            '\n ',
                          style: 'pie',
                          margin: [-4, 0, 0, 0],
                          alignment: 'right',
                        },
                      ],
                      [
                        {
                          text: 'Asociación Yapey Yurijcuna - Renacer',
                          style: 'pie',
                          margin: [-4, 0, 0, 0],
                          alignment: 'right',
                        },
                      ],
                    ],
                  },

                  layout: {
                    hLineWidth: function (i, node) {
                      return i === 1 ? 1 : 0;
                    },
                    vLineWidth: function (i, node) {
                      return 0;
                    },
                  },
                },
              ],
            },
          ];
        },

        styles: {
          header: {
            fontSize: 12,
            bold: true,
          },
          subtitulo: {
            fontSize: 9,
            bold: false,
          },
          subtituloNegrita: {
            fontSize: 8,
            bold: true,
          },
          anotherStyle: {
            italics: true,
            alignment: 'right',
          },
          pie: {
            fontSize: 8,
            bold: false,
          },
        },
      };

      pdfMake.createPdf(documentDefinition).open();
    });
  }

  ActualizarValoresPlanProyecto() {
    this.planProyectoService
      .ActualizarValoresPlanProyecto(
        this.VariablesSistema.Id_Proyecto,
        this.VariablesSistema.Ano
      )
      .subscribe((resp) => {});
  }

  ActualizarValoresPlanContable() {
    this.planContableService
      .ActualizarValoresPlanContable(this.VariablesSistema.Ano)
      .subscribe((resp) => {});
  }
}
