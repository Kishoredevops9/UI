import { TaskCrationPageService } from './task-creation.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { TaskCreationEffects } from './task-creation.effects';

describe('TaskCreationEffects', () => {
  let actions$: Observable<any>;
  let effects: TaskCreationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        TaskCreationEffects,
        TaskCrationPageService,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<TaskCreationEffects>(TaskCreationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
