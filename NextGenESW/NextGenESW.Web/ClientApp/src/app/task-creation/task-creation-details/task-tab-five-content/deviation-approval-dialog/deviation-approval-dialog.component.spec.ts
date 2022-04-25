import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationApprovalDialogComponent } from './deviation-approval-dialog.component';

describe('DeviationApprovalDialogComponent', () => {
  let component: DeviationApprovalDialogComponent;
  let fixture: ComponentFixture<DeviationApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviationApprovalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
