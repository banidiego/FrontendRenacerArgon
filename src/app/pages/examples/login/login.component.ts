import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private route: Router) {
    this.crearFormulariosReactivos();
  }
  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaSesion: FormGroup;

  // tslint:disable-next-line: member-ordering
  focus: any;
  focus1: any;

  crearFormulariosReactivos(): void {
    // Formulario Operación Principal
    this.formaSesion = new FormGroup({
      Usuario: new FormControl(''),
      Password: new FormControl(''),
    });
  }

  IniciarSesion() {
    this.authService.Login(this.formaSesion.value).subscribe((datos: any) => {
      this.route.navigate(['Administrador/Inicio']); // para Editar diferentes Rutas de Acceso
      // this.variablesGlobalesService.CargarLocalStorage();
    });
  }

  ngOnInit() {}
}
