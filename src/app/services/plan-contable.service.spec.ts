import { TestBed } from '@angular/core/testing';

import { PlanContableService } from './plan-contable.service';

describe('PlanContableService', () => {
  let service: PlanContableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanContableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
