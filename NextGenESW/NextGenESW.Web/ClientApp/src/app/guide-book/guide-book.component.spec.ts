import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuideBookComponent } from './guide-book.component';

describe('GuideBookComponent', () => {
  let component: GuideBookComponent;
  let fixture: ComponentFixture<GuideBookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
