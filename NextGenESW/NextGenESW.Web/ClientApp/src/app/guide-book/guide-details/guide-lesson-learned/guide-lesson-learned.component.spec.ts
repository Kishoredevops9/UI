import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuideLessonLearnedComponent } from './guide-lesson-learned.component';

describe('GuideLessonLearnedComponent', () => {
  let component: GuideLessonLearnedComponent;
  let fixture: ComponentFixture<GuideLessonLearnedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideLessonLearnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideLessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
