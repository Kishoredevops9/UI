import { SharedModule } from './../../shared/shared.module';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CdDocumentComponent } from './cd-document.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CdDocumentComponent', () => {
  let component: CdDocumentComponent;
  let fixture: ComponentFixture<CdDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[BrowserAnimationsModule, SharedModule],
      declarations: [ CdDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
