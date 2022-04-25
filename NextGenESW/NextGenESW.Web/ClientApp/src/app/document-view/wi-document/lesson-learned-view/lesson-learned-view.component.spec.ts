import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LessonLearnedViewComponent } from './lesson-learned-view.component';

describe('LessonLearnedViewComponent', () => {
  let component: LessonLearnedViewComponent;
  let fixture: ComponentFixture<LessonLearnedViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LessonLearnedViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonLearnedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
