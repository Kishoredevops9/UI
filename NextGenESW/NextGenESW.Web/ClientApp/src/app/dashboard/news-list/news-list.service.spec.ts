import { TestBed } from '@angular/core/testing';

import { NewsListService } from './news-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('NewsListService', () => {
  let service: NewsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers:[NewsListService]
    });
    service = TestBed.inject(NewsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
