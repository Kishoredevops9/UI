import { SharedModule } from './../../shared/shared.module';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { TaskItemsListComponent } from './task-items-list.component';
import { StoreModule } from '@ngrx/store';
import { reducers,metaReducers } from 'src/app/reducers';
import { TaskItemsListService } from './task-items-list.service';

describe('TaskItemsListComponent', () => {
  let component: TaskItemsListComponent;
  let fixture: ComponentFixture<TaskItemsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        StoreModule.forRoot(reducers, {
          metaReducers
       }),
      ],
      declarations: [TaskItemsListComponent],
      providers:[TaskItemsListService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
