import { TestBed } from '@angular/core/testing';

import { TabOneContentService } from './task-tab-one-content.service';

describe('TabOneContentService', () => {
  let service: TabOneContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabOneContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
