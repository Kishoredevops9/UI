import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityApprovalDialogComponent } from './activity-approval-dialog.component';

describe('ActivityApprovalDialogComponent', () => {
  let component: ActivityApprovalDialogComponent;
  let fixture: ComponentFixture<ActivityApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityApprovalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
