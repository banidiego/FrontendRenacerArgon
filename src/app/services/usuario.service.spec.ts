import { TestBed } from '@angular/core/testing';

import { MedioPagoService } from './medio-pago.service';

describe('MedioPagoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedioPagoService = TestBed.get(MedioPagoService);
    expect(service).toBeTruthy();
  });
});
