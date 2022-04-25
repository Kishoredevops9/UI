import { TestBed } from '@angular/core/testing';

import { GuideBookService } from './guide-book.service';

describe('GuideBookService', () => {
  let service: GuideBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuideBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
