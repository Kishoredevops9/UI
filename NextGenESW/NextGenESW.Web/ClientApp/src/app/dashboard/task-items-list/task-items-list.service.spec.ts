/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TaskItemsListService } from './task-items-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('Service: TaskItemsList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [TaskItemsListService]
    });
  });

  it('should ...', inject([TaskItemsListService], (service: TaskItemsListService) => {
    expect(service).toBeTruthy();
  }));
});
