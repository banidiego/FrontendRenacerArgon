import { TestBed } from '@angular/core/testing';

import { PlanProyectoService } from './plan-proyecto.service';

describe('PlanProyectoService', () => {
  let service: PlanProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
