import { TestBed } from '@angular/core/testing';

import { DqmService } from './dqm.service';

describe('DqmService', () => {
  let service: DqmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
