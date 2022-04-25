import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewStepComponent } from './add-new-step.component';

describe('AddNewStepComponent', () => {
  let component: AddNewStepComponent;
  let fixture: ComponentFixture<AddNewStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
