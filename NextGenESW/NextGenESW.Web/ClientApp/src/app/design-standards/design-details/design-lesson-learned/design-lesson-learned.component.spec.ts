import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DesignLessonLearnedComponent } from './design-lesson-learned.component';

describe('DesignLessonLearnedComponent', () => {
  let component: DesignLessonLearnedComponent;
  let fixture: ComponentFixture<DesignLessonLearnedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DesignLessonLearnedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
