import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStepPopupComponent } from './add-step-popup.component';

describe('AddStepPopupComponent', () => {
  let component: AddStepPopupComponent;
  let fixture: ComponentFixture<AddStepPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStepPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStepPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
