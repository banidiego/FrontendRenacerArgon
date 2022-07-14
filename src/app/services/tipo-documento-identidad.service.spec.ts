import { TestBed } from '@angular/core/testing';

import { TipoDocumentoIdentidadService } from './tipo-documento-identidad.service';

describe('TipoDocumentoIdentidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoDocumentoIdentidadService = TestBed.get(TipoDocumentoIdentidadService);
    expect(service).toBeTruthy();
  });
});
