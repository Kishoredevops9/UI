import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskAddSwimlaneComponent } from './task-add-swimlane.component';

describe('TaskAddSwimlaneComponent', () => {
  let component: TaskAddSwimlaneComponent;
  let fixture: ComponentFixture<TaskAddSwimlaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAddSwimlaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAddSwimlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
