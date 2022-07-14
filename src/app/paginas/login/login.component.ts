import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // ==========================================
  // Declaración de los Formularios Reactivos
  // ==========================================
  formaSesion: FormGroup;

  // tslint:disable-next-line: member-ordering
  focus: any;
  focus1: any;

  constructor(private authService: AuthService, private route: Router) {
    this.crearFormulariosReactivos();
  }

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

  ngOnInit(): void {}
}
