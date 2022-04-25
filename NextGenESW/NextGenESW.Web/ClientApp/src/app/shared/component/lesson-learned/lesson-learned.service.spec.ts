import { TestBed } from '@angular/core/testing';

import { LessonLearnedService } from './lesson-learned.service';

describe('LessonLearnedService', () => {
  let service: LessonLearnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonLearnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
