import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen-mes',
  templateUrl: './resumen-mes.component.html',
  styleUrls: ['./resumen-mes.component.scss'],
})
export class ResumenMesComponent implements OnInit {
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
