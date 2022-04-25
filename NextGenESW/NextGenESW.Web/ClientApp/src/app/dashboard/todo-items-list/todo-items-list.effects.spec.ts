import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TodoItemsListEffects } from './todo-items-list.effects';
import { TodoItemsListService } from './todo-items-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('TodoItemsListEffects', () => {
  let actions$: Observable<any>;
  let effects: TodoItemsListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        TodoItemsListEffects,
        TodoItemsListService,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<TodoItemsListEffects>(TodoItemsListEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
