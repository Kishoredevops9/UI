import { TestBed } from '@angular/core/testing';

import { TopMenuActionsService } from './top-menu-actions.service';

describe('TopMenuActionsService', () => {
  let service: TopMenuActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopMenuActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
