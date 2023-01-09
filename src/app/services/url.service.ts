import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  URL: string;

  constructor() {
    this.URL = 'http://localhost:3000';
    // this.URL = 'https://backend-renacer-administracion.herokuapp.com';
    // this.URL = 'https://backenrenacerproduccion-production.up.railway.app';
  }
}
