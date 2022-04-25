import { TaskItemsListService } from './task-items-list.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { TaskItemsListEffects } from './task-items-list.effects';

describe('TaskItemsListEffects', () => {
  let actions$: Observable<any>;
  let effects: TaskItemsListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        TaskItemsListEffects,
        TaskItemsListService,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<TaskItemsListEffects>(TaskItemsListEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
