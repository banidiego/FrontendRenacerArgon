import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busqueda-rapida',
  templateUrl: './busqueda-rapida.component.html',
  styleUrls: ['./busqueda-rapida.component.scss'],
})
export class BusquedaRapidaComponent implements OnInit {
  constructor() {}

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
}
