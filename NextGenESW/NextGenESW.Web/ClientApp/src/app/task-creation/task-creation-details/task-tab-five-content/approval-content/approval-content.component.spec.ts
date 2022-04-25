import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalContentComponent } from './approval-content.component';

describe('ApprovalContentComponent', () => {
  let component: ApprovalContentComponent;
  let fixture: ComponentFixture<ApprovalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
