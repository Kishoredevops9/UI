import { TestBed } from '@angular/core/testing';

import { CollaborateDialogService } from './collaborate-dialog.service';

describe('CollaborateService', () => {
  let service: CollaborateDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaborateDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
