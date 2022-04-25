import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackCommentsComponent } from './feedback-comments.component';

describe('FeedbackCommentsComponent', () => {
  let component: FeedbackCommentsComponent;
  let fixture: ComponentFixture<FeedbackCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
