import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PresentationComponent } from './pages/presentation/presentation.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'presentation',
  //   pathMatch: 'full',
  // },

  // {
  //   path: 'presentation',
  //   component: PresentationComponent,
  // },

  // {
  //   path: '',
  //   component: AdminLayoutComponent,
  //   children: [
  //     {
  //       path: 'dashboards',
  //       loadChildren: () =>
  //         import('./pages/dashboards/dashboards.module').then(
  //           (m) => m.DashboardsModule
  //         ),
  //     },
  //     {
  //       path: 'components',
  //       loadChildren: () =>
  //         import('./pages/components/components.module').then(
  //           (m) => m.ComponentsModule
  //         ),
  //     },
  //     {
  //       path: 'forms',
  //       loadChildren: () =>
  //         import('./pages/forms/forms.module').then((m) => m.FormsModules),
  //     },
  //     {
  //       path: 'tables',
  //       loadChildren: () =>
  //         import('./pages/tables/tables.module').then((m) => m.TablesModule),
  //     },
  //     {
  //       path: 'maps',
  //       loadChildren: () =>
  //         import('./pages/maps/maps.module').then((m) => m.MapsModule),
  //     },
  //     {
  //       path: 'widgets',
  //       loadChildren: () =>
  //         import('./pages/widgets/widgets.module').then((m) => m.WidgetsModule),
  //     },
  //     {
  //       path: 'charts',
  //       loadChildren: () =>
  //         import('./pages/charts/charts.module').then((m) => m.ChartsModule),
  //     },
  //     {
  //       path: 'calendar',
  //       loadChildren: () =>
  //         import('./pages/calendar/calendar.module').then(
  //           (m) => m.CalendarModule
  //         ),
  //     },
  //     {
  //       path: 'examples',
  //       loadChildren: () =>
  //         import('./pages/examples/examples.module').then(
  //           (m) => m.ExamplesModule
  //         ),
  //     },
  //   ],
  // },

  // {
  //   path: '**',
  //   redirectTo: 'dashboard',
  // },

  {
    path: '',
    redirectTo: 'pagina/login',
    pathMatch: 'full',
  },

  {
    path: 'Administrador',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'Inicio',
        loadChildren: () =>
          import('./paginas/inicio/inicio.module').then((m) => m.InicioModule),
      },
      {
        path: 'OperacionesDiarias',
        loadChildren: () =>
          import(
            './paginas/operaciones-diarias/operaciones-diarias.module'
          ).then((m) => m.OperacionesDiariasModule),
      },
      {
        path: 'BusquedaRapida',
        loadChildren: () =>
          import('./paginas/busqueda-rapida/busqueda-rapida.module').then(
            (m) => m.BusquedaRapidaModule
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/tables.module').then((m) => m.TablesModule),
      },
      {
        path: 'maps',
        loadChildren: () =>
          import('./pages/maps/maps.module').then((m) => m.MapsModule),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/widgets/widgets.module').then((m) => m.WidgetsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/charts/charts.module').then((m) => m.ChartsModule),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./pages/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: 'examples',
        loadChildren: () =>
          import('./pages/examples/examples.module').then(
            (m) => m.ExamplesModule
          ),
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'pagina',
        loadChildren: () =>
          import('./layouts/auth-layout/auth-layout.module').then(
            (m) => m.AuthLayoutModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
