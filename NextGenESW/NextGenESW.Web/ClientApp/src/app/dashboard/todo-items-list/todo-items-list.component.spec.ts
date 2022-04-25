import { TodoItemsListService } from './todo-items-list.service';
import { SharedModule } from './../../shared/shared.module';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { TodoItemsListComponent } from './todo-items-list.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/reducers';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TodoItemsListComponent', () => {
  let component: TodoItemsListComponent;
  let fixture: ComponentFixture<TodoItemsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {
          metaReducers
       }),
      ],
      declarations: [TodoItemsListComponent],
      providers:[TodoItemsListService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
