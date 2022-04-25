import { LobbyHomeService } from './lobby-home.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { TaskLobbyHomeEffects } from './lobby-home.effects';

describe('TaskLobbyHomeEffects', () => {
  let actions$: Observable<any>;
  let effects: TaskLobbyHomeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        TaskLobbyHomeEffects,
        LobbyHomeService,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<TaskLobbyHomeEffects>(TaskLobbyHomeEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
