import { TestBed } from '@angular/core/testing';

import { FooterServiceService } from './footer-service.service';

describe('FooterServiceService', () => {
  let service: FooterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
