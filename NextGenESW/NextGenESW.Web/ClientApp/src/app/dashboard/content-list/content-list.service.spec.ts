/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ContentListService } from './content-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('Service: ContentList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [ContentListService]
    });
  });

  it('should ...', inject([ContentListService], (service: ContentListService) => {
    expect(service).toBeTruthy();
  }));
});
