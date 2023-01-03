import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuxiliarModel } from '../../../../models/Auxiliar.model';
import { PlanProyectoModel } from '../../../../models/PlanProyecto.model';
import { PlanContableModel } from '../../../../models/PlanContable.model';
import { Subscription } from 'rxjs';
import { OperacionModel } from '../../../../models/Operacion.model';
import { VariablesSistemaModel } from '../../../../models/VariablesSistema.model';
import { FormGroup, FormControl } from '@angular/forms';
import { VariablesGlobalesService } from '../../../../services/variables-globales.service';
import { OperacionPrincipalService } from '../../../../services/operacion-principal.service';
import { OperacionService } from '../../../../services/operacion.service';
import { AuxiliarService } from '../../../../services/auxiliar.service';
import { PlanProyectoService } from '../../../../services/plan-proyecto.service';
import { PlanContableService } from '../../../../services/plan-contable.service';
import { TipoDocumentoService } from '../../../../services/tipo-documento.service';
import { TipoRegistroService } from '../../../../services/tipo-registro.service';
import { MedioPagoService } from '../../../../services/medio-pago.service';
import { SrService } from '../../../../services/sr.service';
import { DetalleSrService } from '../../../../services/detalle-sr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
// import { jsPDF } from 'jspdf';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TipoDocumentoIdentidadService } from '../../../../services/tipo-documento-identidad.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-registro-gasto',
  templateUrl: './registro-gasto.component.html',
  styleUrls: ['./registro-gasto.component.scss'],
})
export class RegistroGastoComponent implements OnInit {
  formModalBuscarAuxiliares: BsModalRef;
  formModalSUNAT: BsModalRef;
  formModalPlanContable: BsModalRef;

  entries = 10;
  selected: any[] = [];

  SelectionType = SelectionType;

  activeRow: any;
  tablaResponsableGiro = [];
  tablaAuxiliar = [];
  tablaPlanProyecto = [];
  tablaPlanContable = [];
  tabla = [];
  // ==========================================
  // Declaración de Variables para Filtro de "Girado" (Autocomplete - Angular Material)
  // ==========================================
  auxiliares: AuxiliarModel[] = [];
  planProyecto: PlanProyectoModel[] = [];
  planContable: PlanContableModel[] = [];
  // auxiliaresFiltradosResponsableGiro: Observable<AuxiliarModel[]>;
  // auxiliaresFiltradosRuc: Observable<AuxiliarModel[]>;
  // PlanProyectoFiltrados: Observable<PlanProyectoModel[]>;
  // PlanContableFiltrados: Observable<PlanContableModel[]>;

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
  // Declaración de Variables Generales
  // ==========================================
  TipoOrigen: string;
  Id_OperacionPrincipal: number;
  Id_DetalleSR: number;
  Id_SR: number;
  NumeroOperacionPrincipal: number;
  CodigoOperacion: string;
  MedioPagos: any;
  TipoDocumentos: any;
  TipoRegistros: any;
  Subscripcion: Subscription;
  Id_Operacion: number;
  PrimerDia: string;
  UltimoDia: string;
  NumeroMes: number;
  Datos: OperacionModel[] = [];
  Presupuesto = 0;
  Saldo = 0;
  TipoDocumentoIdentidad: any;

  // Definiendo el Objeto que obtendra todas las variables de Sesión
  VariablesSistema = new VariablesSistemaModel();
  NumeroSolicitud = 0;
  TituloRegistro: string;

  // -- Declaración de Variables que Tomarán el valor de las Sumas Totales
  TotalOperacion = 0;

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaSR: FormGroup;
  formaDetalleSR: FormGroup;
  formaOperacionPrincipal: FormGroup;
  formaOperacion: FormGroup;
  formaAuxiliar: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private operacionPrincipalService: OperacionPrincipalService,
    private operacionService: OperacionService,
    private auxiliarService: AuxiliarService,
    private planProyectoService: PlanProyectoService,
    private planContableService: PlanContableService,
    private tipoDocumentoService: TipoDocumentoService,
    private tipoRegistroService: TipoRegistroService,
    private medioPagoService: MedioPagoService,
    private srService: SrService,
    private detalleSRService: DetalleSrService,
    private router: ActivatedRoute,
    private route: Router,
    private modalService: BsModalService,
    private tipoDocumentoIdentidadService: TipoDocumentoIdentidadService
  ) {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;
    this.MinMaxFecha();
    this.cargarAuxiliares();
    this.CargarMedioPago();
    this.CargarTipoDocumento();
    this.CargarTipoRegistro();
    this.cargarPlanProyecto(
      this.VariablesSistema.Ano,
      this.VariablesSistema.Id_Proyecto
    );
    this.cargarPlanContable(this.VariablesSistema.Ano);
    this.crearFormulariosReactivos();
    this.CargarTipoDocumentoIdentidad();
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
  // Función que Lee los Parámetros enviados por URL
  // ==========================================
  CargarInformacionURL() {
    // tslint:disable-next-line: deprecation
    this.router.params.subscribe((params) => {
      // cargando en Variables Locales TipoOrigen
      this.Id_DetalleSR = params['Id_DetalleSR'];
      this.Id_SR = params['Id_SR'];

      // Confirmamos si Es un Nuevo Asiento o uno ya existente
      if (this.Id_DetalleSR > 0) {
        // Asignamos el Id_Operacion = 0
        this.Id_OperacionPrincipal = 0;

        const Fecha = new Date(
          this.VariablesSistema.Ano,
          this.MesArray.indexOf(this.VariablesSistema.Mes),
          1
        );

        // // Creamos una nueva Fecha UTC
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
        });

        this.CargarDetalleSR(this.Id_DetalleSR);
      } else {
        this.CargarOperacionPrincipal(params['Id_OperacionPrincipal']);
      }
    });
  }

  // ==========================================
  // Función que crea Las Formas (Operación Principal y Operación)
  // ==========================================
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
      FechaOperacion: new FormControl(this.PrimerDia),
      ResponsableGiro: new FormControl(''),
      RUCResponsableGiro: new FormControl(''),
      Solicitud: new FormControl(0),
      TipoSR: new FormControl(0),
      Id_SR: new FormControl(0),
      Id_DetalleSR: new FormControl(0),
      DescripcionDetalle: new FormControl(''),
      TC: new FormControl(1),
      Codigo_MedioPago: new FormControl('001'),
      ChequeSoles: new FormControl(''),
      ChequeDolares: new FormControl(''),
      Codigo_TipoDocumento: new FormControl('00'),
      Codigo_TipoRegistro: new FormControl('000'),
      SerieComprobante: new FormControl(''),
      NumeroComprobante: new FormControl(''),
      FechaComprobante: new FormControl(this.PrimerDia),
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

    this.PrimerDia = formatDate(
      new Date(this.VariablesSistema.Ano, this.NumeroMes, 1),
      'yyyy-MM-dd',
      'en-GB',
      '+0500'
    );

    this.UltimoDia = formatDate(
      new Date(this.VariablesSistema.Ano, this.NumeroMes + 1, 0),
      'yyyy-MM-dd',
      'en-GB',
      '+0500'
    );
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

  // ==========================================
  // Carga Auxiliares para alimentar Select
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

  // ==========================================
  // Carga PlanProyecto para alimentar el Autocomplete
  // ==========================================
  cargarPlanProyecto(Ano: number, Id_Proyecto: number) {
    this.planProyectoService
      .ListaPlanProyectos(Ano, Id_Proyecto)
      // tslint:disable-next-line: deprecation
      .subscribe((datos: any) => {
        this.planProyecto = datos;
      });
  }

  // ==========================================
  // Carga PlanContable para alimentar el Autocomplete
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

  // ==========================================
  // Cargar Select MedioPago
  // ==========================================
  CargarMedioPago() {
    // tslint:disable-next-line: deprecation
    this.medioPagoService.getMedioPagos().subscribe((datos) => {
      this.MedioPagos = datos;
    });
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
  // Cargar Select TipoRegistro
  // ==========================================
  CargarTipoRegistro() {
    // tslint:disable-next-line: deprecation
    this.tipoRegistroService.getTipoRegistros().subscribe((datos) => {
      this.TipoRegistros = datos;
    });
  }

  // ==========================================
  // Guardar o Modificar Operación Principal (Solo guardar programado)
  // ==========================================
  GuardarOperacionPrincipal() {
    if (
      this.formaOperacionPrincipal.controls['ResponsableGiro'].value !== '' &&
      this.formaOperacionPrincipal.controls['ResponsableGiro'].value !== ''
    ) {
      // Filtra si hay contenido, si existe, continua el guardado
      if (this.Id_OperacionPrincipal) {
        this.operacionPrincipalService
          .ActualizarOperacionPrincipal(this.formaOperacionPrincipal.value)
          // tslint:disable-next-line: deprecation
          .subscribe((resp) => {});
      } else {
        this.operacionPrincipalService
          .GuardarOperacionPrincipal(this.formaOperacionPrincipal.value)
          // tslint:disable-next-line: deprecation
          .subscribe((resp) => {
            // this.OperacionPrincipalModel = resp;

            this.formaOperacionPrincipal.setValue(resp);

            this.route.navigate([
              '/Administrador/OperacionesDiarias/MovimientoDiario/',
              this.formaOperacionPrincipal.controls['TipoOrigen'].value,
              this.formaOperacionPrincipal.controls['Id_OperacionPrincipal']
                .value,
            ]);
          });
      }
    } else {
      // Si no hay información, no se guarda y pide ingresar un Responsable de Giro
      swal.fire(
        'Faltan Campos Obligatorios',
        'Por favor ingrese un Concepto General y/o un Responsable de Giro',
        'error'
      );
    }
  }

  // ==========================================
  // Guardar - Actualizar Operación
  // ==========================================
  GuardarOperacion() {
    // Comprueba si los Registros obligatorios estan rellenados, sino muestra mensaje de advertencia

    if (
      this.formaOperacion.controls['TC'].value === 0 ||
      this.formaOperacion.controls['RUCAuxiliar'].value === '' ||
      this.formaOperacion.controls['Codigo_PlanCuenta'].value === ''
    ) {
      // Mensaje de Advertencia...
      swal.fire(
        'Faltan Campos Obligatorios',
        'Verifique que el Tipo de Cambio sea diferente a 0, Que Haya ingresado el Auxiliar y que Haya ingresado un Cuenta',
        'warning'
      );
    } else {
      this.formaOperacion.patchValue({
        DescripcionDetalle:
          this.formaOperacion.controls['DescripcionOperacion'].value,
        FechaOperacion: this.formaOperacion.controls['FechaComprobante'].value,
      });

      // Si Existe el Id_Operación, se actualiza
      if (this.formaOperacion.controls['Id_Operacion'].value > 0) {
        this.operacionService
          .ActualizarOperacion(this.formaOperacion.value)
          .subscribe((resp) => {
            this.formaDetalleSR.patchValue({
              Gasto: resp.Operacion.MontoSoles,
            });
            this.CargarTabla();

            this.GuardarDetalleSR();

            // this.ActualizarLibroDiarioSimplificado();

            // this.LimpiarFormaOperacion();
          });
        // sino existe el Id_Operación, simplemente se Guarda un nuevo Registro
      } else {
        this.ActualizarMontoTipoRegistro();
        this.operacionService
          .GuardarOperacion(this.formaOperacion.value)
          .subscribe((resp) => {
            // this.formaOperacionPrincipal.setValue(resp);
            this.formaDetalleSR.patchValue({
              Gasto: resp.MontoSoles,
            });
            this.CargarTabla();
            this.CargarTablaAlGuardarDetalleSR();
            this.GuardarDetalleSR();
          });
      }
    }
  }

  // ==========================================
  // Guardar / Actualizar - DetalleSR
  // ==========================================
  GuardarDetalleSR() {
    this.operacionService
      .ListaOperacionesIdDetalleSRRegistroGasto(this.Id_DetalleSR)
      .subscribe((datos: any) => {
        this.Datos = datos;

        // this.dataSource = new MatTableDataSource<Titulos>(this.Datos);
        // this.dataSource.paginator = this.paginator;

        // this.SumaTotalOperacion();

        let Suma: number;
        Suma = this.Datos.map((t) => t.MontoSoles).reduce(
          (acc, value) => acc + value,
          0
        );
        this.TotalOperacion = Suma;

        if (this.formaDetalleSR.controls['Id_DetalleSR'].value !== 0) {
          this.detalleSRService
            .ActualizarDetalleSR(this.formaDetalleSR.value)
            .subscribe((datos) => {});
        } else {
          this.detalleSRService
            .GuardarDetalleSR(this.formaDetalleSR.value)
            .subscribe((datos) => {});
        }
      });
  }

  // ==========================================
  // Cargar información de DetalleSR
  // ==========================================
  CargarDetalleSR(Id_DetalleSR: number) {
    this.detalleSRService
      .ListaDetalleSRIdDetalleSR(Id_DetalleSR)
      .subscribe((datos: any) => {
        this.formaDetalleSR.setValue(datos);

        this.TituloRegistro = datos.Actividad;

        this.Presupuesto = datos.Presupuesto;

        this.CargarSR(this.Id_SR);

        this.CargarOperacionIdSR(this.Id_SR);

        this.formaOperacion.patchValue({
          Codigo_PlanProyecto: datos.Codigo_PlanProyecto,
          DescripcionOperacion: datos.Actividad,
          DescripcionDetalle: datos.Actividad,
        });
      });
  }

  // ==========================================
  // Cargar información SR
  // ==========================================
  CargarSR(Id_SR: number) {
    this.srService.getSR(Id_SR).subscribe((datos: any) => {
      this.formaSR.setValue(datos);

      // // Corregir Fechas UTC
      // const FechaSolicitud = new Date(datos.FechaSolicitud);
      // const FechaSolicitudUTC = moment(FechaSolicitud).utcOffset(0);

      this.formaSR.patchValue({
        FechaSolicitud: formatDate(
          new Date(
            this.VariablesSistema.Ano,
            this.MesArray.indexOf(this.VariablesSistema.Mes),
            1
          ),
          'yyyy-MM-dd',
          'en-GB',
          '+0500'
        ),
      });

      this.NumeroSolicitud = datos.Numero;

      this.formaOperacion.patchValue({
        Solicitud: datos.Numero,
        Id_SR: Id_SR,
        Id_DetalleSR: this.Id_DetalleSR,
      });
    });
  }

  // ==========================================
  // Función para cargar Tabla
  // ==========================================
  CargarTabla() {
    this.operacionService
      .ListaOperacionesIdDetalleSRRegistroGasto(this.Id_DetalleSR)
      .subscribe((datos: any) => {
        this.Datos = datos;

        // this.dataSource = new MatTableDataSource<Titulos>(this.Datos);
        // this.dataSource.paginator = this.paginator;

        // this.SumaTotalOperacion();

        let Suma: number;
        Suma = this.Datos.map((t) => t.MontoSoles).reduce(
          (acc, value) => acc + value,
          0
        );
        this.TotalOperacion = Suma;

        return Suma;
      });
  }

  CargarTablaAlGuardarDetalleSR() {
    this.operacionService
      .ListaOperacionesIdDetalleSRRegistroGasto(this.Id_DetalleSR)
      .subscribe((datos: any) => {
        this.Datos = datos;

        // this.dataSource = new MatTableDataSource<Titulos>(this.Datos);
        // this.dataSource.paginator = this.paginator;

        this.CalcularSaldo();
      });
  }

  // ==========================================
  // Cargar Operacion con Id_SR común, para obtener Numero de Id_OperacionPrincipal y TipoOrigen, Codigo_operación
  // ==========================================
  CargarOperacionIdSR(Id_SR: number) {
    this.operacionService.ListaOperacionesIdSR(Id_SR).subscribe((datos) => {
      this.formaOperacion.patchValue({
        Id_OperacionPrincipal: datos.Id_OperacionPrincipal,
        TipoOrigen: datos.TipoOrigen,
        CodigoOperacion: datos.CodigoOperacion,
        ResponsableGiro: datos.ResponsableGiro,
        RUCResponsableGiro: datos.RUCResponsableGiro,
        TipoSR: 2,
        TC: datos.TC,
      });

      this.TipoOrigen = datos.TipoOrigen;

      this.CargarOperacionPrincipal(datos.Id_OperacionPrincipal);
    });
  }

  // ==========================================
  // Eliminar Operación
  // ==========================================
  async EliminarOperacion(Id_Operacion: number) {
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
        this.operacionService
          .ListaOperacionesIdDetalleSRRegistroGasto(this.Id_DetalleSR)
          .subscribe((datos: any) => {
            this.Datos = datos;

            // this.dataSource = new MatTableDataSource<Titulos>(this.Datos);
            // this.dataSource.paginator = this.paginator;

            // this.SumaTotalOperacion();

            let Suma: number;
            Suma = this.Datos.map((t) => t.MontoSoles).reduce(
              (acc, value) => acc + value,
              0
            );
            this.TotalOperacion = Suma;

            this.operacionService
              .EliminarOperacion(Id_Operacion)
              .subscribe((dato) => {
                this.CargarTabla();
                this.CargarTablaAlGuardarDetalleSR();
                this.GuardarDetalleSR();
                this.LimpiarFormaOperacion();
              });
          });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }

  // ==========================================
  // Limpiar Formulario
  // ==========================================
  LimpiarFormaOperacion() {
    this.Id_Operacion = 0;
    this.formaOperacion.patchValue({
      Id_Operacion: 0,
      Id_OperacionPrincipal: this.Id_OperacionPrincipal,
      TipoOrigen: this.TipoOrigen,
      CodigoOperacion: this.CodigoOperacion,

      DescripcionDetalle: '',
      Codigo_MedioPago: '001',
      Cheque: '',
      ChequeSoles: '',
      ChequeDolares: '',
      Codigo_TipoDocumento: '00',
      Codigo_TipoRegistro: '000',
      SerieComprobante: '',
      NumeroComprobante: '',
      FechaComprobante: this.PrimerDia,
      RUCAuxiliar: '',
      RazonSocial: '',
      Codigo_TipoDocumentoIdentidad: '',

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
      Mes: this.VariablesSistema.Mes,
      Ano: this.VariablesSistema.Ano,
      // Codigo_Proyecto: this.Codigo_Proyecto,
      Anulado: 0,
      Saldo: 0,
      CuentaPendiente: 0,
      TipoSaldo: 0,
    });
  }

  // ==========================================
  // Cargar Tabla de Operaciones por Id_OperacionPrincipal
  // ==========================================
  cargarTablaOperaciones(
    Ano: number,
    Mes: string,
    TipoOrigen: string,
    Id_Proyecto: number
  ) {
    // this.operacionPrincipalService
    //   .ListaOperacionesPrincipalesMes(Ano, Mes, TipoOrigen, Id_Proyecto)
    //   // tslint:disable-next-line: deprecation
    //   .subscribe((datos: any) => {
    //     this.DatosOperacion = datos.operaciones;
    //     this.dataSource = new MatTableDataSource<Titulos>(this.DatosOperacion);
    //   });
  }

  // ==========================================
  // Cargar Operación
  // ==========================================
  CargarOperacion(operacion: any) {
    this.Id_Operacion = operacion.Id_Operacion;

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
      Codigo_TipoDocumentoIdentidad: operacion.Codigo_TipoDocumentoIdentidad,
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
  }

  // ==========================================
  // Suma de Totales
  // ==========================================

  SumaTotalOperacion() {
    let Suma: number;
    Suma = this.Datos.map((t) => t.MontoSoles).reduce(
      (acc, value) => acc + value,
      0
    );
    this.TotalOperacion = Suma;

    return Suma;
  }

  CalcularSaldo() {
    if (this.TotalOperacion > 0) {
      this.Saldo = this.Presupuesto - this.TotalOperacion;
    }

    this.formaDetalleSR.patchValue({
      Gasto: this.TotalOperacion,
    });
  }

  // ==========================================
  // Cargar Operación Principal
  // ==========================================
  CargarOperacionPrincipal(Id_OperacionPrincipal: number) {
    this.operacionPrincipalService
      .getOperacionPrincipal(Id_OperacionPrincipal)
      // tslint:disable-next-line: deprecation
      .subscribe((datos) => {
        // const FechaURL = moment(datos.FechaOperacion).utcOffset(0);

        this.formaOperacionPrincipal.patchValue({
          Id_OperacionPrincipal: datos.Id_OperacionPrincipal,
          DescripcionOperacion: datos.DescripcionOperacion,
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
          ResponsableGiro: datos.ResponsableGiro,
          CodigoOperacion: datos.CodigoOperacion,
          Numero: datos.Numero,
          Ano: datos.Ano,
          Mes: datos.Mes,
          Id_Proyecto: datos.Id_Proyecto,
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

        this.Id_OperacionPrincipal = datos.Id_OperacionPrincipal;

        this.formaOperacion.patchValue({
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
        });

        this.CodigoOperacion = datos.CodigoOperacion;

        this.CargarOperacionIdOperacionPrincipal(Id_OperacionPrincipal);

        this.CargarTabla();
      });
  }

  // ==========================================
  // Cargar Operación
  // ==========================================
  CargarOperacionIdOperacionPrincipal(Id_OperacionPrincipal: number) {
    this.operacionService
      .ListaOperacionesIdOperacionPrincipal(Id_OperacionPrincipal)
      // tslint:disable-next-line: deprecation
      .subscribe((datos) => {
        // tslint:disable-next-line: max-line-length
        // Si el valor de Id_Operacion es 0, entonces agregamos información inicial de Operación Principal en la Forma Operación, caso contrario se carga toda la información existente de Operacion
        if (datos) {
          this.formaOperacion.patchValue({
            Id_OperacionPrincipal:
              this.formaOperacionPrincipal.controls['Id_OperacionPrincipal']
                .value,
            TipoOrigen:
              this.formaOperacionPrincipal.controls['TipoOrigen'].value,
            CodigoOperacion:
              this.formaOperacionPrincipal.controls['CodigoOperacion'].value,
          });
        } else {
        }
      });

    // this.Id_Operacion = operacion.Id_Operacion;

    // this.formaOperacion.patchValue({
    //   Id_Operacion: operacion.Id_Operacion,
    //   Id_OperacionPrincipal: operacion.Id_OperacionPrincipal,
    //   TipoOrigen: operacion.TipoOrigen,
    //   CodigoOperacion: operacion.CodigoOperacion,
    //   DescripcionOperacion: operacion.DescripcionOperacion,
    //   FechaOperacion: operacion.FechaOperacion,
    //   ResponsableGiro: operacion.ResponsableGiro,
    //   RUCResponsableGiro: operacion.RUCResponsableGiro,
    //   Solicitud: operacion.Solicitud,
    //   TipoSR: operacion.TipoSR,
    //   Id_SR: operacion.Id_SR,
    //   Id_DetalleSR: operacion.Id_DetalleSR,
    //   DescripcionDetalle: operacion.DescripcionDetalle,
    //   TC: operacion.TC,
    //   Codigo_MedioPago: operacion.Codigo_MedioPago,
    //   Cheque: operacion.Cheque,
    //   ChequeSoles: operacion.ChequeSoles,
    //   ChequeDolares: operacion.ChequeDolares,
    //   Codigo_TipoDocumento: operacion.Codigo_TipoDocumento,
    //   Codigo_TipoRegistro: operacion.Codigo_TipoRegistro,
    //   SerieComprobante: operacion.SerieComprobante,
    //   NumeroComprobante: operacion.NumeroComprobante,
    //   FechaComprobante: operacion.FechaComprobante,
    //   RUCAuxiliar: operacion.RUCAuxiliar,
    //   RazonSocial: operacion.RazonSocial,
    //   Codigo_TipoDocumentoIdentidad: operacion.Codigo_TipoDocumentoIdentidad,
    //   Codigo_PlanProyecto: operacion.Codigo_PlanProyecto,
    //   Codigo_PlanCuenta: operacion.Codigo_PlanCuenta,
    //   Nombre_PlanCuenta: operacion.Nombre_PlanCuenta,
    //   MontoSoles: operacion.MontoSoles,
    //   MontoDolares: operacion.MontoDolares,
    //   DebeSoles: operacion.DebeSoles,
    //   HaberSoles: operacion.HaberSoles,
    //   DebeDolares: operacion.DebeDolares,
    //   HaberDolares: operacion.HaberDolares,
    //   C1: operacion.C1,
    //   C2: operacion.C2,
    //   C3: operacion.C3,
    //   C4: operacion.C4,
    //   C5: operacion.C5,
    //   C6: operacion.C6,
    //   C7: operacion.C7,
    //   C8: operacion.C8,
    //   C9: operacion.C9,
    //   C10: operacion.C10,
    //   V1: operacion.V1,
    //   V2: operacion.V2,
    //   V3: operacion.V3,
    //   V4: operacion.V4,
    //   V5: operacion.V5,
    //   V6: operacion.V6,
    //   V7: operacion.V7,
    //   Mes: operacion.Mes,
    //   Ano: operacion.Ano,
    //   Codigo_Proyecto: operacion.Codigo_Proyecto,
    //   Anulado: operacion.Anulado,
    //   Saldo: operacion.Saldo,
    //   CuentaPendiente: operacion.CuentaPendiente,
    //   TipoSaldo: operacion.TipoSaldo,
    // });
  }

  // ==========================================
  // Calcular Debe Haber (Soles - Dolares)
  // ==========================================
  CalcularDebeSoles(Monto: number) {
    if (Monto > 0) {
      this.formaOperacion.patchValue({
        MontoSoles: Math.round(Monto * 100) / 100,
        MontoDolares:
          Math.round((Monto / this.formaOperacion.controls['TC'].value) * 100) /
          100,
        DebeSoles: Math.round(Monto * 100) / 100,
        HaberSoles: 0,
        HaberDolares: 0,
        DebeDolares:
          Math.round((Monto / this.formaOperacion.controls['TC'].value) * 100) /
          100,
      });

      this.formaDetalleSR.patchValue({
        Gasto: this.TotalOperacion,
      });
      this.ActualizarMontoTipoRegistro();
    }
  }

  CalcularHaberSoles(Monto: number) {
    if (Monto > 0) {
      this.formaOperacion.patchValue({
        MontoSoles: Math.round(Monto * 100) / 100,
        MontoDolares:
          Math.round((Monto / this.formaOperacion.controls['TC'].value) * 100) /
          100,
        HaberSoles: Math.round(Monto * 100) / 100,
        DebeSoles: 0,
        DebeDolares: 0,
        HaberDolares:
          Math.round((Monto / this.formaOperacion.controls['TC'].value) * 100) /
          100,
      });
      this.ActualizarMontoTipoRegistro();
    }
  }

  CalcularDebeDolares(Monto: number) {
    if (Monto > 0) {
      this.formaOperacion.patchValue({
        MontoSoles:
          Math.round(Monto * this.formaOperacion.controls['TC'].value * 100) /
          100,
        MontoDolares: Math.round(Monto * 100) / 100,
        DebeDolares: Math.round(Monto * 100) / 100,
        HaberSoles: 0,
        HaberDolares: 0,
        DebeSoles:
          Math.round(Monto * this.formaOperacion.controls['TC'].value * 100) /
          100,
      });
      this.ActualizarMontoTipoRegistro();
    }
  }

  CalcularHaberDolares(Monto: number) {
    if (Monto > 0) {
      this.formaOperacion.patchValue({
        MontoSoles:
          Math.round(Monto * this.formaOperacion.controls['TC'].value * 100) /
          100,
        MontoDolares: Math.round(Monto * 100) / 100,
        HaberDolares: Math.round(Monto * 100) / 100,
        DebeSoles: 0,
        DebeDolares: 0,
        HaberSoles:
          Math.round(Monto * this.formaOperacion.controls['TC'].value * 100) /
          100,
      });
      this.ActualizarMontoTipoRegistro();
    }
  }

  CalcularCambioTC(Monto: number) {
    if (+this.formaOperacion.controls['DebeSoles'].value > 0) {
      this.formaOperacion.patchValue({
        MontoDolares:
          Math.round(
            (this.formaOperacion.controls['DebeSoles'].value / Monto) * 100
          ) / 100,
        DebeDolares:
          Math.round(
            (this.formaOperacion.controls['DebeSoles'].value / Monto) * 100
          ) / 100,
      });
    } else if (+this.formaOperacion.controls['HaberSoles'].value > 0) {
      this.formaOperacion.patchValue({
        MontoDolares:
          Math.round(
            (this.formaOperacion.controls['HaberSoles'].value / Monto) * 100
          ) / 100,
        HaberDolares:
          Math.round(
            (this.formaOperacion.controls['HaberSoles'].value / Monto) * 100
          ) / 100,
      });
    } else {
    }
    this.ActualizarMontoTipoRegistro();
  }

  // ==========================================
  // Función que Actualiza el Tipo de Registro
  // ==========================================
  ActualizarMontoTipoRegistro() {
    // Primero Limpiamos los Registros para ingresar los nuevos Datos
    this.formaOperacion.patchValue({
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
    });

    if (this.formaOperacion.controls['Codigo_TipoRegistro'].value === '000') {
      this.formaOperacion.patchValue({
        C1: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '001'
    ) {
      this.formaOperacion.patchValue({
        C2: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '001A'
    ) {
      this.formaOperacion.patchValue({
        C3: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '002'
    ) {
      this.formaOperacion.patchValue({
        C4: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '002A'
    ) {
      this.formaOperacion.patchValue({
        C5: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '003'
    ) {
      this.formaOperacion.patchValue({
        C6: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '003A'
    ) {
      this.formaOperacion.patchValue({
        C7: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '004'
    ) {
      this.formaOperacion.patchValue({
        C8: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '008'
    ) {
      this.formaOperacion.patchValue({
        C9: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === '009'
    ) {
      this.formaOperacion.patchValue({
        C10: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V01'
    ) {
      this.formaOperacion.patchValue({
        V1: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V02'
    ) {
      this.formaOperacion.patchValue({
        V2: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V03'
    ) {
      this.formaOperacion.patchValue({
        V3: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V04'
    ) {
      this.formaOperacion.patchValue({
        V4: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V05'
    ) {
      this.formaOperacion.patchValue({
        V5: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V06'
    ) {
      this.formaOperacion.patchValue({
        V6: this.formaOperacion.controls['MontoSoles'].value,
      });
    } else if (
      this.formaOperacion.controls['Codigo_TipoRegistro'].value === 'V07'
    ) {
      this.formaOperacion.patchValue({
        V7: this.formaOperacion.controls['MontoSoles'].value,
      });
    }
  }

  // ==========================================
  // Función de Filtros de Selects
  // ==========================================
  FiltrarTipoRegistro(Codigo_TipoDocumento: string) {
    const Resultado = this.TipoDocumentos.find(
      (resp) => resp.Codigo_TipoDocumento === Codigo_TipoDocumento
    );

    this.formaOperacion.patchValue({
      Codigo_TipoRegistro: Resultado.Codigo_TipoRegistro,
    });
  }

  FiltrarAuxiliarRUC(RUC: string) {
    const Resultado = this.auxiliares.find((resp) => resp.RUC === RUC);

    this.formaOperacion.patchValue({
      RazonSocial: Resultado.RazonSocial,
      Codigo_TipoDocumentoIdentidad: Resultado.Codigo_TipoDocumentoIdentidad,
    });
  }

  FiltrarPlancontableCodigo(Codigo_PlanContable: string) {
    const Resultado = this.planContable.find(
      (resp) => resp.Codigo_PlanCuenta === Codigo_PlanContable
    );

    this.formaOperacion.patchValue({
      Nombre_PlanCuenta: Resultado.Nombre_PlanCuenta,
    });
  }

  // ==========================================
  // Propotipo para llamar funcion al presionar F2, serviría para abrir ventanas de busqueda
  // ==========================================
  onKeydown(event) {}

  // ==========================================
  // Valida si los Asientos Cuadran (Debe - Haber)
  // ==========================================

  // ValidarMontosOperacionPrincipal() {
  //   if (
  //     this.TotalDebeSoles === this.TotalHaberSoles ||
  //     this.TotalDebeDolares === this.TotalHaberDolares
  //   ) {
  //     this.formaOperacionPrincipal.patchValue({
  //       Cuadrado: true,
  //     });

  //     this.GuardarOperacionPrincipal();

  //     Swal.fire(
  //       'Operación Cerrado Correctamente!',
  //       'La Operación está Completa',
  //       'success'
  //     );
  //   } else {
  //     Swal.fire(
  //       'Asiento no Cuadrado!',
  //       'La suma del Debe no es igual al Haber!',
  //       'error'
  //     );
  //     this.formaOperacionPrincipal.patchValue({
  //       Cuadrado: false,
  //     });
  //     this.GuardarOperacionPrincipal();
  //   }
  // }

  BuscarResponsableGiro() {
    // const dialogRef = this.dialog.open(BuscarAuxiliarComponent, {
    //   width: '90%',
    //   minHeight: 'calc(100vh - 1500px)',
    //   height: 'auto',
    // });
    // dialogRef.afterClosed().subscribe((result: AuxiliarModel) => {
    //   if (result) {
    //     this.formaOperacionPrincipal.patchValue({
    //       ResponsableGiro: result.RazonSocial,
    //     });
    //   }
    // });
  }

  BuscarPlanProyecto() {
    // const dialogRef = this.dialog.open(BuscarPlanProyectoComponent, {
    //   width: '90%',
    //   minHeight: 'calc(100vh - 1500px)',
    //   height: 'auto',
    // });
    // dialogRef.afterClosed().subscribe((result: PlanProyectoModel) => {
    //   if (result) {
    //     this.formaOperacion.patchValue({
    //       Codigo_PlanProyecto: result.Codigo_PlanProyecto,
    //     });
    //   }
    // });
  }

  BuscarPlanContable() {
    // const dialogRef = this.dialog.open(BuscarPlanContableComponent, {
    //   width: '90%',
    //   minHeight: 'calc(100vh - 1500px)',
    //   height: 'auto',
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

  ImprimirMovimiento() {
    // // Default export is a4 paper, portrait, using millimeters for units
    // const doc = new jsPDF();
    // // Nombre del archivo
    // const nombre =
    //   'Constancia de Operación - ' +
    //   this.formaOperacionPrincipal.controls['CodigoOperacion'].value +
    //   '.pdf';
    // doc.setFontSize(10);
    // doc.text('CONSTANCIA DE OPERACIÓN', 1, 5);
    // doc.text('b', 2, 1);
    // doc.text('c', 2, 1);
    // // doc.setFontSize(16);
    // // doc.text('This is some normal sized text underneath.', 20, 30);
    // doc.save(nombre);
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

    let ListadoCuentas;

    ListadoCuentas = this.Datos.map((item) =>
      item.Codigo_PlanCuenta.slice(0, 2)
    ).filter((value, index, self) => self.indexOf(value) === index);

    for (let i = 0; i < ListadoCuentas.length; i++) {
      const Debe = this.Datos.filter(
        (item) => item.Codigo_PlanCuenta.slice(0, 2) === ListadoCuentas[i]
      ).reduce((sum, current) => sum + current.DebeSoles, 0);

      const Haber = this.Datos.filter(
        (item) => item.Codigo_PlanCuenta.slice(0, 2) === ListadoCuentas[i]
      ).reduce((sum, current) => sum + current.HaberSoles, 0);

      switch (ListadoCuentas[i]) {
        case '01':
          this.formaOperacionPrincipal.patchValue({
            C01: Debe - Haber,
          });
          break;
        case '02':
          this.formaOperacionPrincipal.patchValue({
            C02: Debe - Haber,
          });
          break;
        case '03':
          this.formaOperacionPrincipal.patchValue({
            C03: Debe - Haber,
          });
          break;
        case '04':
          this.formaOperacionPrincipal.patchValue({
            C04: Debe - Haber,
          });
          break;
        case '05':
          this.formaOperacionPrincipal.patchValue({
            C05: Debe - Haber,
          });
          break;
        case '06':
          this.formaOperacionPrincipal.patchValue({
            C06: Debe - Haber,
          });
          break;
        case '07':
          this.formaOperacionPrincipal.patchValue({
            C07: Debe - Haber,
          });
          break;
        case '08':
          this.formaOperacionPrincipal.patchValue({
            C08: Debe - Haber,
          });
          break;
        case '09':
          this.formaOperacionPrincipal.patchValue({
            C09: Debe - Haber,
          });
          break;
        case '10':
          this.formaOperacionPrincipal.patchValue({
            C10: Debe - Haber,
          });
          break;

        case '11':
          this.formaOperacionPrincipal.patchValue({
            C11: Debe - Haber,
          });
          break;
        case '12':
          this.formaOperacionPrincipal.patchValue({
            C12: Debe - Haber,
          });
          break;
        case '13':
          this.formaOperacionPrincipal.patchValue({
            C13: Debe - Haber,
          });
          break;
        case '14':
          this.formaOperacionPrincipal.patchValue({
            C14: Debe - Haber,
          });
          break;
        case '15':
          this.formaOperacionPrincipal.patchValue({
            C15: Debe - Haber,
          });
          break;
        case '16':
          this.formaOperacionPrincipal.patchValue({
            C16: Debe - Haber,
          });
          break;
        case '17':
          this.formaOperacionPrincipal.patchValue({
            C17: Debe - Haber,
          });
          break;
        case '18':
          this.formaOperacionPrincipal.patchValue({
            C18: Debe - Haber,
          });
          break;
        case '19':
          this.formaOperacionPrincipal.patchValue({
            C19: Debe - Haber,
          });
          break;
        case '20':
          this.formaOperacionPrincipal.patchValue({
            C20: Debe - Haber,
          });
          break;

        case '21':
          this.formaOperacionPrincipal.patchValue({
            C21: Debe - Haber,
          });
          break;
        case '22':
          this.formaOperacionPrincipal.patchValue({
            C22: Debe - Haber,
          });
          break;
        case '23':
          this.formaOperacionPrincipal.patchValue({
            C23: Debe - Haber,
          });
          break;
        case '24':
          this.formaOperacionPrincipal.patchValue({
            C14: Debe - Haber,
          });
          break;
        case '25':
          this.formaOperacionPrincipal.patchValue({
            C25: Debe - Haber,
          });
          break;
        case '26':
          this.formaOperacionPrincipal.patchValue({
            C26: Debe - Haber,
          });
          break;
        case '27':
          this.formaOperacionPrincipal.patchValue({
            C27: Debe - Haber,
          });
          break;
        case '28':
          this.formaOperacionPrincipal.patchValue({
            C28: Debe - Haber,
          });
          break;
        case '29':
          this.formaOperacionPrincipal.patchValue({
            C29: Debe - Haber,
          });
          break;
        case '30':
          this.formaOperacionPrincipal.patchValue({
            C30: Debe - Haber,
          });
          break;

        case '31':
          this.formaOperacionPrincipal.patchValue({
            C31: Debe - Haber,
          });
          break;
        case '32':
          this.formaOperacionPrincipal.patchValue({
            C32: Debe - Haber,
          });
          break;
        case '33':
          this.formaOperacionPrincipal.patchValue({
            C33: Debe - Haber,
          });
          break;
        case '34':
          this.formaOperacionPrincipal.patchValue({
            C34: Debe - Haber,
          });
          break;
        case '35':
          this.formaOperacionPrincipal.patchValue({
            C35: Debe - Haber,
          });
          break;
        case '36':
          this.formaOperacionPrincipal.patchValue({
            C36: Debe - Haber,
          });
          break;
        case '37':
          this.formaOperacionPrincipal.patchValue({
            C37: Debe - Haber,
          });
          break;
        case '38':
          this.formaOperacionPrincipal.patchValue({
            C38: Debe - Haber,
          });
          break;
        case '39':
          this.formaOperacionPrincipal.patchValue({
            C39: Debe - Haber,
          });
          break;
        case '40':
          this.formaOperacionPrincipal.patchValue({
            C40: Debe - Haber,
          });
          break;

        case '41':
          this.formaOperacionPrincipal.patchValue({
            C41: Debe - Haber,
          });
          break;
        case '42':
          this.formaOperacionPrincipal.patchValue({
            C42: Debe - Haber,
          });
          break;
        case '43':
          this.formaOperacionPrincipal.patchValue({
            C43: Debe - Haber,
          });
          break;
        case '44':
          this.formaOperacionPrincipal.patchValue({
            C44: Debe - Haber,
          });
          break;
        case '45':
          this.formaOperacionPrincipal.patchValue({
            C45: Debe - Haber,
          });
          break;
        case '46':
          this.formaOperacionPrincipal.patchValue({
            C46: Debe - Haber,
          });
          break;
        case '47':
          this.formaOperacionPrincipal.patchValue({
            C47: Debe - Haber,
          });
          break;
        case '48':
          this.formaOperacionPrincipal.patchValue({
            C48: Debe - Haber,
          });
          break;
        case '49':
          this.formaOperacionPrincipal.patchValue({
            C49: Debe - Haber,
          });
          break;
        case '50':
          this.formaOperacionPrincipal.patchValue({
            C50: Debe - Haber,
          });
          break;

        case '51':
          this.formaOperacionPrincipal.patchValue({
            C51: Debe - Haber,
          });
          break;
        case '52':
          this.formaOperacionPrincipal.patchValue({
            C52: Debe - Haber,
          });
          break;
        case '53':
          this.formaOperacionPrincipal.patchValue({
            C53: Debe - Haber,
          });
          break;
        case '54':
          this.formaOperacionPrincipal.patchValue({
            C54: Debe - Haber,
          });
          break;
        case '55':
          this.formaOperacionPrincipal.patchValue({
            C55: Debe - Haber,
          });
          break;
        case '56':
          this.formaOperacionPrincipal.patchValue({
            C56: Debe - Haber,
          });
          break;
        case '57':
          this.formaOperacionPrincipal.patchValue({
            C57: Debe - Haber,
          });
          break;
        case '58':
          this.formaOperacionPrincipal.patchValue({
            C58: Debe - Haber,
          });
          break;
        case '59':
          this.formaOperacionPrincipal.patchValue({
            C59: Debe - Haber,
          });
          break;
        case '60':
          this.formaOperacionPrincipal.patchValue({
            C60: Debe - Haber,
          });
          break;

        case '61':
          this.formaOperacionPrincipal.patchValue({
            C61: Debe - Haber,
          });
          break;
        case '62':
          this.formaOperacionPrincipal.patchValue({
            C62: Debe - Haber,
          });
          break;
        case '63':
          this.formaOperacionPrincipal.patchValue({
            C63: Debe - Haber,
          });
          break;
        case '64':
          this.formaOperacionPrincipal.patchValue({
            C64: Debe - Haber,
          });
          break;
        case '65':
          this.formaOperacionPrincipal.patchValue({
            C65: Debe - Haber,
          });
          break;
        case '66':
          this.formaOperacionPrincipal.patchValue({
            C66: Debe - Haber,
          });
          break;
        case '67':
          this.formaOperacionPrincipal.patchValue({
            C67: Debe - Haber,
          });
          break;
        case '68':
          this.formaOperacionPrincipal.patchValue({
            C68: Debe - Haber,
          });
          break;
        case '69':
          this.formaOperacionPrincipal.patchValue({
            C69: Debe - Haber,
          });
          break;
        case '70':
          this.formaOperacionPrincipal.patchValue({
            C70: Debe - Haber,
          });
          break;

        case '71':
          this.formaOperacionPrincipal.patchValue({
            C71: Debe - Haber,
          });
          break;
        case '72':
          this.formaOperacionPrincipal.patchValue({
            C72: Debe - Haber,
          });
          break;
        case '73':
          this.formaOperacionPrincipal.patchValue({
            C73: Debe - Haber,
          });
          break;
        case '74':
          this.formaOperacionPrincipal.patchValue({
            C74: Debe - Haber,
          });
          break;
        case '75':
          this.formaOperacionPrincipal.patchValue({
            C75: Debe - Haber,
          });
          break;
        case '76':
          this.formaOperacionPrincipal.patchValue({
            C76: Debe - Haber,
          });
          break;
        case '77':
          this.formaOperacionPrincipal.patchValue({
            C77: Debe - Haber,
          });
          break;
        case '78':
          this.formaOperacionPrincipal.patchValue({
            C78: Debe - Haber,
          });
          break;
        case '79':
          this.formaOperacionPrincipal.patchValue({
            C79: Debe - Haber,
          });
          break;
        case '80':
          this.formaOperacionPrincipal.patchValue({
            C80: Debe - Haber,
          });
          break;

        case '81':
          this.formaOperacionPrincipal.patchValue({
            C81: Debe - Haber,
          });
          break;
        case '82':
          this.formaOperacionPrincipal.patchValue({
            C82: Debe - Haber,
          });
          break;
        case '83':
          this.formaOperacionPrincipal.patchValue({
            C83: Debe - Haber,
          });
          break;
        case '84':
          this.formaOperacionPrincipal.patchValue({
            C84: Debe - Haber,
          });
          break;
        case '85':
          this.formaOperacionPrincipal.patchValue({
            C85: Debe - Haber,
          });
          break;
        case '86':
          this.formaOperacionPrincipal.patchValue({
            C86: Debe - Haber,
          });
          break;
        case '87':
          this.formaOperacionPrincipal.patchValue({
            C87: Debe - Haber,
          });
          break;
        case '88':
          this.formaOperacionPrincipal.patchValue({
            C88: Debe - Haber,
          });
          break;
        case '89':
          this.formaOperacionPrincipal.patchValue({
            C89: Debe - Haber,
          });
          break;
        case '90':
          this.formaOperacionPrincipal.patchValue({
            C90: Debe - Haber,
          });
          break;

        case '91':
          this.formaOperacionPrincipal.patchValue({
            C91: Debe - Haber,
          });
          break;
        case '92':
          this.formaOperacionPrincipal.patchValue({
            C92: Debe - Haber,
          });
          break;
        case '93':
          this.formaOperacionPrincipal.patchValue({
            C93: Debe - Haber,
          });
          break;
        case '94':
          this.formaOperacionPrincipal.patchValue({
            C94: Debe - Haber,
          });
          break;
        case '95':
          this.formaOperacionPrincipal.patchValue({
            C95: Debe - Haber,
          });
          break;
        case '96':
          this.formaOperacionPrincipal.patchValue({
            C96: Debe - Haber,
          });
          break;

        default:
          break;
      }

      this.GuardarOperacionPrincipal();
    }
  }

  CambiarFecha() {
    this.formaOperacion.patchValue({
      FechaOperacion: this.formaOperacion.controls['FechaComprobante'].value,
    });
  }

  // BuscarAuxiliar
  BuscarAuxiliar(modalForm: TemplateRef<any>) {
    this.cargarAuxiliares();
    this.formModalBuscarAuxiliares = this.modalService.show(modalForm, {
      class: 'modal-lg',
    });
  }

  onSelectBuscarAuxiliar({ selected }) {
    this.formaOperacion.patchValue({
      RUCAuxiliar: selected[0].RUC,
      RazonSocial: selected[0].RazonSocial,
      Codigo_TipoDocumentoIdentidad: selected[0].Codigo_TipoDocumentoIdentidad,
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

  // -----
  AbrirModalSunat(modalForm: TemplateRef<any>) {
    this.Limpiar();
    this.formModalSUNAT = this.modalService.show(modalForm, {
      class: 'modal-sm',
    });
  }

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

  // BUSQUEDA SUNAT
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

  // Plan Contable - Modal
  BuscarPlanContableModal(modalForm: TemplateRef<any>) {
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
}
