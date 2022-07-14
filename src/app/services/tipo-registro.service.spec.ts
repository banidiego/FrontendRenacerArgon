import { TestBed } from '@angular/core/testing';

import { TipoRegistroService } from './tipo-registro.service';

describe('TipoRegistroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoRegistroService = TestBed.get(TipoRegistroService);
    expect(service).toBeTruthy();
  });
});
