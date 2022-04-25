import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskPopupsComponent } from './task-popups.component';

describe('TaskPopupsComponent', () => {
  let component: TaskPopupsComponent;
  let fixture: ComponentFixture<TaskPopupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPopupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
