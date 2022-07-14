import { Component, OnInit } from '@angular/core';
import { VariablesGlobalesService } from '../../../services/variables-globales.service';
import { VariablesSistemaModel } from '../../../models/VariablesSistema.model';

@Component({
  selector: 'app-menu-estatico',
  templateUrl: './menu-estatico.component.html',
  styleUrls: ['./menu-estatico.component.scss'],
})
export class MenuEstaticoComponent implements OnInit {
  // ==========================================
  // Declaración de Variables Locales y Generales
  // ==========================================
  VariablesSistema = new VariablesSistemaModel();

  constructor(private variablesGlobalesService: VariablesGlobalesService) {
    this.CargarInformacion();
  }

  ngOnInit(): void {}

  CargarInformacion() {
    this.VariablesSistema = this.variablesGlobalesService.VariablesSistema;
  }
}
