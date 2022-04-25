import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WiLessonLearnedComponent } from './wi-lesson-learned.component';

describe('WiLessonLearnedComponent', () => {
  let component: WiLessonLearnedComponent;
  let fixture: ComponentFixture<WiLessonLearnedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WiLessonLearnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiLessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
