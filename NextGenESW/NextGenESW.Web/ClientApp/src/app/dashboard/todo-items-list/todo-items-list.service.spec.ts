/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TodoItemsListService } from './todo-items-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('Service: TodoItemsList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [TodoItemsListService]
    });
  });

  it('should ...', inject([TodoItemsListService], (service: TodoItemsListService) => {
    expect(service).toBeTruthy();
  }));
});
