import { TestBed } from '@angular/core/testing';

import { ReportesGlobalesService } from './reportes-globales.service';

describe('ReportesGlobalesService', () => {
  let service: ReportesGlobalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesGlobalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
