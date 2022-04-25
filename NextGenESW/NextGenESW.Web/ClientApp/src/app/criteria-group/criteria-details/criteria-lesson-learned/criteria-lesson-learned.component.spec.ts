import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CriteriaLessonLearnedComponent } from './criteria-lesson-learned.component';

describe('CriteriaLessonLearnedComponent', () => {
  let component: CriteriaLessonLearnedComponent;
  let fixture: ComponentFixture<CriteriaLessonLearnedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaLessonLearnedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaLessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
