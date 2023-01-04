import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuxiliarModel } from 'src/app/models/Auxiliar.model';
import { AuxiliarService } from '../../../services/auxiliar.service';
import { FormGroup, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TipoDocumentoIdentidadService } from '../../../services/tipo-documento-identidad.service';
import Swal from 'sweetalert2';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox',
}

@Component({
  selector: 'app-buscar-auxiliar',
  templateUrl: './buscar-auxiliar.component.html',
  styleUrls: ['./buscar-auxiliar.component.scss'],
})
export class BuscarAuxiliarComponent implements OnInit {
  formModalBuscarAuxiliares: BsModalRef;
  formModalSUNAT: BsModalRef;

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
  Datos: AuxiliarModel[] = [];
  TipoDocumentoIdentidad: any;

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaAuxiliar: FormGroup;

  constructor(
    private auxiliarService: AuxiliarService,
    private modalService: BsModalService,
    private tipoDocumentoIdentidadService: TipoDocumentoIdentidadService
  ) {
    this.CargarTabla();
    this.crearFormulariosReactivos();
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
  // Función que crea Las Formas (Operación Principal y Operación)
  // ==========================================
  crearFormulariosReactivos() {
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

  CargarTabla() {
    this.auxiliarService.getAuxiliares().subscribe((datos: any) => {
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
        this.TipoDocumentoIdentidad = datos;
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
      });
  }

  CargarAuxiliar(Id_Auxiliar: number) {
    this.auxiliarService.getAuxiliar(Id_Auxiliar).subscribe((datos) => {
      this.formaAuxiliar.setValue(datos);
    });
  }

  async EliminarAuxiliar(Id_Auxiliar: number) {
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
        this.auxiliarService.eliminarAuxiliar(Id_Auxiliar).subscribe((dato) => {
          this.CargarTabla();
          this.Limpiar();
        });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }

  CerrarModal() {
    this.formModalSUNAT.hide();
  }
}
