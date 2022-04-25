import { SharedModule } from './../../shared/shared.module';
import { NewsListService } from './news-list.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NewsListComponent } from './news-list.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/reducers';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        StoreModule.forRoot(reducers, {
          metaReducers
       }),
      ],
      declarations: [NewsListComponent],
      providers:[NewsListService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
