import { Component, OnInit } from '@angular/core';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { OrigenService } from '../../../services/origen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-informacion',
  templateUrl: './menu-informacion.component.html',
  styleUrls: ['./menu-informacion.component.scss'],
})
export class MenuInformacionComponent implements OnInit {
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
  // Declaración de Variables Locales y Generales
  // ==========================================
  VariablesSistema = new VariablesSistemaModel();
  Mes: string;
  Ano: number;
  NombreProyecto: string;
  Indice: string;
  Coleccion = {};

  constructor(
    private variablesGlobalesService: VariablesGlobalesService,
    private origenService: OrigenService
  ) {
    this.CargarInformacion();
    this.CargarOrigenes();
  }

  ngOnInit(): void {}

  // ==========================================
  // Función para Cargar Lista de Origenes
  // ==========================================
  CargarOrigenes() {
    this.origenService
      .InformacionInicialOrigen(this.VariablesSistema.Ano)
      .subscribe((datos) => {
        this.Coleccion = {};

        for (let index = 0; index < Object.keys(datos).length; index++) {
          this.Coleccion[datos[index]['Nombre']] = datos[index]['Nombre'];
        }
      });
  }

  // ==========================================
  // Función para Cargar Toda la Información del Menu del LocalStorage
  // ==========================================
  CargarInformacion() {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;
  }

  // ==========================================
  // Función para Cambiar Mes y Actualizar en el LocalStorage
  // ==========================================
  async CambiarMes() {
    const { value: Mes } = await Swal.fire({
      title: 'Seleccione el Mes',
      icon: 'info',
      input: 'select',
      inputOptions: {
        Enero: 'Enero',
        Febrero: 'Febrero',
        Marzo: 'Marzo',
        Abril: 'Abril',
        Mayo: 'Mayo',
        Junio: 'Junio',
        Julio: 'Julio',
        Agosto: 'Agosto',
        Septiembre: 'Septiembre',
        Octubre: 'Octubre',
        Noviembre: 'Noviembre',
        Diciembre: 'Diciembre',
      },
      inputValue: this.VariablesSistema.Mes,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });

    if (Mes) {
      this.VariablesSistema.Mes = Mes;

      localStorage.setItem(
        'VariablesSistema',
        JSON.stringify(this.VariablesSistema)
      );

      this.variablesGlobalesService.VariablesSistema = this.VariablesSistema;
      this.variablesGlobalesService.Informacion$.emit(this.VariablesSistema);
    }
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
      this.VariablesSistema.Ano = Ano;

      localStorage.setItem(
        'VariablesSistema',
        JSON.stringify(this.VariablesSistema)
      );

      this.variablesGlobalesService.VariablesSistema = this.VariablesSistema;
      this.variablesGlobalesService.Informacion$.emit(this.VariablesSistema);
    }
  }

  // ==========================================
  // Función para Cambiar Nombre de Origen y Actualizar en el LocalStorage
  // ==========================================
  async CambiarNombreOrigen() {
    const { value: Origen } = await Swal.fire({
      title: 'Seleccione el Origen Contable',
      icon: 'info',
      input: 'select',
      inputOptions: this.Coleccion,
      inputValue: this.VariablesSistema.NombreProyecto,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });

    if (Origen) {
      this.VariablesSistema.NombreProyecto = Origen;

      this.CargarIndice(
        this.VariablesSistema.Ano,
        this.VariablesSistema.NombreProyecto
      );

      localStorage.setItem(
        'VariablesSistema',
        JSON.stringify(this.VariablesSistema)
      );

      this.variablesGlobalesService.VariablesSistema = this.VariablesSistema;
      this.variablesGlobalesService.Informacion$.emit(this.VariablesSistema);
    }
  }

  // ==========================================
  // Función para Cambiar Nombre de Origen y Actualizar en el LocalStorage
  // ==========================================
  CargarIndice(ano: number, nombre: string) {
    this.origenService.CambiarIndice(ano, nombre).subscribe((datos: any) => {
      this.VariablesSistema.Indice = datos.Origen[0].Indice;
      this.VariablesSistema.Origen = datos.Origen[0].Origen;
      this.VariablesSistema.Id_Proyecto = datos.Origen[0].Id_Proyecto;
      localStorage.setItem(
        'VariablesSistema',
        JSON.stringify(this.VariablesSistema)
      );

      this.variablesGlobalesService.VariablesSistema = this.VariablesSistema;
      this.variablesGlobalesService.Informacion$.emit(this.VariablesSistema);
    });
  }
}
