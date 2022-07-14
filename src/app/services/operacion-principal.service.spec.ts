import { TestBed } from '@angular/core/testing';

import { OperacionPrincipalService } from './operacion-principal.service';

describe('OperacionPrincipalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperacionPrincipalService = TestBed.get(OperacionPrincipalService);
    expect(service).toBeTruthy();
  });
});
