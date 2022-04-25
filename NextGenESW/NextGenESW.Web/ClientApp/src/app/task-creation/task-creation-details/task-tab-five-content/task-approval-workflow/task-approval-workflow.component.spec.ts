import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskApprovalWorkflowComponent } from './task-approval-workflow.component';

describe('TaskApprovalWorkflowComponent', () => {
  let component: TaskApprovalWorkflowComponent;
  let fixture: ComponentFixture<TaskApprovalWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskApprovalWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskApprovalWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
