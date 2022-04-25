import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityLessonLearnedComponent } from './activity-lesson-learned.component';

describe('ActivityLessonLearnedComponent', () => {
  let component: ActivityLessonLearnedComponent;
  let fixture: ComponentFixture<ActivityLessonLearnedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLessonLearnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
