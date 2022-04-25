import { TestBed } from '@angular/core/testing';

import { RelatedContentService } from './related-content.service';

describe('RelatedContentService', () => {
  let service: RelatedContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelatedContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
