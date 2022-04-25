import { TestBed } from '@angular/core/testing';

import { DesignStandardsService } from './design-standards.service';

describe('DesignStandardsService', () => {
  let service: DesignStandardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignStandardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
