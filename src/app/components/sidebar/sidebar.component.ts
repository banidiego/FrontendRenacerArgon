import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const misc: any = {
  sidebar_mini_active: true,
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
// Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: 'Inicio',
    title: 'Inicio',
    type: 'link',
    icontype: 'ni-shop text-primary',
  },
  {
    path: 'OperacionesDiarias',
    title: 'OperacionesDiarias',
    type: 'sub',
    icontype: 'ni-collection text-orange',
    collapse: 'examples',
    isCollapsed: true,
    children: [
      { path: 'MovimientoDiario', title: 'Movimiento Diario', type: 'link' },
      { path: 'SolicitudesMes', title: 'Solicitudes del Mes', type: 'link' },
      { path: 'CajaChica', title: 'Caja Chica', type: 'link' },
    ],
  },
  {
    path: 'BusquedaRapida',
    title: 'Búsqueda Rápida',
    type: 'link',
    icontype: 'fas fa-search text-info',
  },
  // {
  //   path: '/components',
  //   title: 'Búsqueda Rápida',
  //   type: 'sub',
  //   icontype: 'fas fa-search text-info',
  //   collapse: 'components',
  //   isCollapsed: true,
  //   children: [
  //     { path: 'buttons', title: 'Buttons', type: 'link' },
  //     { path: 'cards', title: 'Cards', type: 'link' },
  //     { path: 'grid', title: 'Grid', type: 'link' },
  //     { path: 'notifications', title: 'Notifications', type: 'link' },
  //     { path: 'icons', title: 'Icons', type: 'link' },
  //     { path: 'typography', title: 'Typography', type: 'link' },
  //     {
  //       path: 'multilevel',
  //       isCollapsed: true,
  //       title: 'Multilevel',
  //       type: 'sub',
  //       collapse: 'multilevel',
  //       children: [
  //         { title: 'Third level menu' },
  //         { title: 'Just another link' },
  //         { title: 'One last link' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/forms',
  //   title: 'Forms',
  //   type: 'sub',
  //   icontype: 'ni-single-copy-04 text-pink',
  //   collapse: 'forms',
  //   isCollapsed: true,
  //   children: [
  //     { path: 'elements', title: 'Elements', type: 'link' },
  //     { path: 'components', title: 'Components', type: 'link' },
  //     { path: 'validation', title: 'Validation', type: 'link' },
  //   ],
  // },
  {
    path: 'Reportes',
    title: 'Reportes',
    type: 'sub',
    icontype: 'ni-chart-pie-35 text-pink',
    collapse: 'tables',
    isCollapsed: true,
    children: [
      {
        path: 'Administrativo',
        isCollapsed: true,
        title: 'Administrativo',
        type: 'sub',
        collapse: 'Administrativo',
        children: [{ title: 'SR del Mes' }, { title: 'Gastos Ejecutados' }],
      },
      {
        path: 'Contable',
        isCollapsed: true,
        title: 'Contable',
        type: 'sub',
        collapse: 'Contable',
        children: [
          { title: 'Estado de Ganancias y Pérdidas' },
          { title: 'Balance General' },
          { title: 'Balance de Comprobación' },
        ],
      },
      {
        path: 'LibrosOficiales',
        isCollapsed: true,
        title: 'Libros Oficiales',
        type: 'sub',
        collapse: 'Libros Oficiales',
        children: [
          { title: 'Diario Simplificado' },
          { title: 'Caja y Bancos' },
          { title: 'Libro Mayor' },
          { title: 'Registro de Gastos' },
          { title: 'Registro de Ventas' },
        ],
      },

      { path: 'Presupuesto', title: 'Presupuesto', type: 'link' },
    ],
  },
  {
    path: 'Configuraciones',
    title: 'Configuraciones',
    type: 'sub',
    icontype: 'ni-settings-gear-65 text-green',
    collapse: 'maps',
    isCollapsed: true,
    children: [
      {
        path: 'Contable',
        isCollapsed: true,
        title: 'Contable',
        type: 'sub',
        collapse: 'Contable',
        children: [{ title: 'Plan de Cuentas' }],
      },
      {
        path: 'Proyectos',
        isCollapsed: true,
        title: 'Proyectos',
        type: 'sub',
        collapse: 'Proyectos',
        children: [{ title: 'Lista de Proyectos' }],
      },
      {
        path: 'Sistema',
        isCollapsed: true,
        title: 'Sistema',
        type: 'sub',
        collapse: 'Sistema',
        children: [
          { title: 'Medio de Pago' },
          { title: 'Documentos de Identidad' },
          { title: 'Tipo de Comprobantes' },
          { title: 'Usuarios del Sistema' },
        ],
      },
    ],
  },
  // {
  //   path: '/widgets',
  //   title: 'Widgets',
  //   type: 'link',
  //   icontype: 'ni-archive-2 text-green',
  // },
  // {
  //   path: '/charts',
  //   title: 'Charts',
  //   type: 'link',
  //   icontype: 'ni-chart-pie-35 text-info',
  // },
  // {
  //   path: '/calendar',
  //   title: 'Calendar',
  //   type: 'link',
  //   icontype: 'ni-calendar-grid-58 text-red',
  // },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.add('g-sidenav-show');
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  }
  minimizeSidebar() {
    const sidenavToggler =
      document.getElementsByClassName('sidenav-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('g-sidenav-pinned')) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove('g-sidenav-pinned');
      body.classList.add('g-sidenav-hidden');
      sidenavToggler.classList.remove('active');
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add('g-sidenav-pinned');
      body.classList.remove('g-sidenav-hidden');
      sidenavToggler.classList.add('active');
      misc.sidebar_mini_active = true;
    }
  }
}
