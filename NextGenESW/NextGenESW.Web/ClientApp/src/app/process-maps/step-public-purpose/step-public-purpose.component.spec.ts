import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPublicPurposeComponent } from './step-public-purpose.component';

describe('StepPublicPurposeComponent', () => {
  let component: StepPublicPurposeComponent;
  let fixture: ComponentFixture<StepPublicPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepPublicPurposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPublicPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
