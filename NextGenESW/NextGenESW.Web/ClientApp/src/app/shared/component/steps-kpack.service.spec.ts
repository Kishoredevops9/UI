import { TestBed } from '@angular/core/testing';

import { StepsKpackService } from './steps-kpack.service';

describe('StepsKpackService', () => {
  let service: StepsKpackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepsKpackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
