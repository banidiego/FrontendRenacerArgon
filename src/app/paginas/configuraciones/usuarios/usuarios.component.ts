import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsuarioModel } from '../../../models/Usuario.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import { FormGroup, FormControl } from '@angular/forms';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { UsuarioService } from '../../../services/usuario.service';
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
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
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
  Datos: UsuarioModel[] = [];
  Id_Usuario: number;
  Ano: number;
  modalFormUsuario: BsModalRef;

  VariablesSistema = new VariablesSistemaModel();

  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaUsuario: FormGroup;

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private usuarioService: UsuarioService,
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
    this.formaUsuario = new FormGroup({
      Id_Usuario: new FormControl(0),
      Usuario: new FormControl(''),
      Email: new FormControl(''),
      Password: new FormControl(''),
      Nombres: new FormControl(''),
      Imagen: new FormControl(''),
      Id_TipoUsuario: new FormControl(1),
    });
  }

  CargarTabla() {
    this.usuarioService.getUsuarios().subscribe((datos: any) => {
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
    this.modalFormUsuario = this.modalService.show(modalForm, {
      class: 'modal-md',
    });
  }

  CerrarModal() {
    this.modalFormUsuario.hide();
  }

  LimpiarForma() {
    this.Id_Usuario = 0;
    this.formaUsuario.patchValue({
      Id_Usuario: 0,
      Usuario: '',
      Email: '',
      Password: '',
      Nombres: '',
      Imagen: '',
      Id_TipoUsuario: 1,
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
      this.formaUsuario.controls['Usuario'].value === '' ||
      this.formaUsuario.controls['Email'].value === '' ||
      this.formaUsuario.controls['Password'].value === '' ||
      this.formaUsuario.controls['Nombres'].value === ''
    ) {
      // console.log('NO Rellenado');
      swal.fire(
        'Faltan Rellenar Campos Obligatorios',
        'Por Favor verifique que: Código de Plan de Proyecto y Descripción esten rellenados',
        'error'
      );
    } else {
      // Primero Evaluamos si se Actualiza o Guarda el SR
      if (this.formaUsuario.controls['Id_Usuario'].value > 0) {
        // Actualizamos la Información de SR

        this.usuarioService
          .actualizarUsuario(this.formaUsuario.value)
          .subscribe((info) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto Actualizado Correctamente',
              'success'
            );
            this.modalFormUsuario.hide();
          });
      } else {
        // Guardamos el SR
        this.usuarioService
          .crearUsuario(this.formaUsuario.value)
          .subscribe((respuesta) => {
            this.CargarTabla();
            swal.fire(
              'Sistema Renacer',
              'Proyecto creado Correctamente',
              'success'
            );
            this.modalFormUsuario.hide();
          });
      }
    }
  }

  Cargar(Id_Usuario: number) {
    this.usuarioService.getUsuario(Id_Usuario).subscribe((datos) => {
      this.formaUsuario.setValue(datos);
    });
  }

  // ==========================================
  // Eliminar PlanProyecto
  // ==========================================
  async Eliminar(Id_Usuario: number) {
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
        this.usuarioService.eliminarUsuario(Id_Usuario).subscribe((dato) => {
          this.CargarTabla();
          this.LimpiarForma();
        });
      } else {
        Swal.fire('Operacion Cancelada!', 'El registro no se eliminó', 'error');
      }
    });
  }
}
