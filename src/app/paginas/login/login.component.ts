import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
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
  ngOnDestroy(): void {
    Swal.close();
  }

  crearFormulariosReactivos(): void {
    // Formulario Operación Principal
    this.formaSesion = new FormGroup({
      Usuario: new FormControl(''),
      Password: new FormControl(''),
    });
  }

  IniciarSesion() {
    swal.fire({
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.authService.Login(this.formaSesion.value).subscribe(
      (datos: any) => {
        Swal.fire({
          title: 'Autentificación exitosa',
          html: 'Espere mientras carga el Sistema...',
          icon: 'success',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.route.navigate(['Administrador/Inicio']); // para Editar diferentes Rutas de Acceso
        // this.variablesGlobalesService.CargarLocalStorage();
      },
      (err) => {
        // Si Sucede un error de validación
        Swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  ngOnInit(): void {}
}
