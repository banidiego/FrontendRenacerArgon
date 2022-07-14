import { TestBed } from '@angular/core/testing';

import { SrService } from './sr.service';

describe('SrService', () => {
  let service: SrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
