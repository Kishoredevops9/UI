import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { LobbyHomeComponent } from './lobby-home.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/reducers';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './../../shared/shared.module';
import { LobbyHomeService } from '../lobby-home.service';

describe('LobbyHomeComponent', () => {
  let component: LobbyHomeComponent;
  let fixture: ComponentFixture<LobbyHomeComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LobbyHomeComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        StoreModule.forRoot(reducers, {
          metaReducers
        }),
      ],
      declarations: [LobbyHomeComponent],
      providers: [LobbyHomeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
