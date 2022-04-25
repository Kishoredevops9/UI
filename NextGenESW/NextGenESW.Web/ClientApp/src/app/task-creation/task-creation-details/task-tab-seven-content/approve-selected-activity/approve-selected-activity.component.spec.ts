import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSelectedActivityComponent } from './approve-selected-activity.component';

describe('ApproveSelectedActivityComponent', () => {
  let component: ApproveSelectedActivityComponent;
  let fixture: ComponentFixture<ApproveSelectedActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveSelectedActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSelectedActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
