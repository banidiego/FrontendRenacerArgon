import { TestBed } from '@angular/core/testing';

import { DatosOrganizacionService } from './datos-organizacion.service';

describe('DatosOrganizacionService', () => {
  let service: DatosOrganizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosOrganizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
