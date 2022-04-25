import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddonsPopupComponent } from './addons-popup.component';

describe('AddonsPopupComponent', () => {
  let component: AddonsPopupComponent;
  let fixture: ComponentFixture<AddonsPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddonsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
