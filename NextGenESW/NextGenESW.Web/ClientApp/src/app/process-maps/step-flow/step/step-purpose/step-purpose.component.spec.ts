import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPurposeComponent } from './step-purpose.component';

describe('StepPurposeComponent', () => {
  let component: StepPurposeComponent;
  let fixture: ComponentFixture<StepPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepPurposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
