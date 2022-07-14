import { TestBed } from '@angular/core/testing';

import { DetalleSrService } from './detalle-sr.service';

describe('DetalleSrService', () => {
  let service: DetalleSrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleSrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
