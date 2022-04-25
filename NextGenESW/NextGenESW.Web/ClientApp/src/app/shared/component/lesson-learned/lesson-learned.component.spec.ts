import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LessonLearnedComponent } from './lesson-learned.component';

describe('LessonLearnedComponent', () => {
  let component: LessonLearnedComponent;
  let fixture: ComponentFixture<LessonLearnedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonLearnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
