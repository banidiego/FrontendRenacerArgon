import { TestBed } from '@angular/core/testing';

import { AuxiliarService } from './auxiliar.service';

describe('AuxiliarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuxiliarService = TestBed.get(AuxiliarService);
    expect(service).toBeTruthy();
  });
});
