import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessMapMilestoneTreeWComponent } from './process-map-milestone-tree.component';

describe('ProcessMapMilestoneTreeWComponent', () => {
  let component: ProcessMapMilestoneTreeWComponent;
  let fixture: ComponentFixture<ProcessMapMilestoneTreeWComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessMapMilestoneTreeWComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMapMilestoneTreeWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
