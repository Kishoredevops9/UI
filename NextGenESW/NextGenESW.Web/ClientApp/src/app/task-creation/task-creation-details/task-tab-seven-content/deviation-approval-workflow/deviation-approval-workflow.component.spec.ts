import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationApprovalWorkflowComponent } from './deviation-approval-workflow.component';

describe('DeviationApprovalWorkflowComponent', () => {
  let component: DeviationApprovalWorkflowComponent;
  let fixture: ComponentFixture<DeviationApprovalWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviationApprovalWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationApprovalWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
