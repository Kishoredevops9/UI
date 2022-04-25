import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityPurposeComponent } from './activity-purpose.component';

describe('ActivityPurposeComponent', () => {
  let component: ActivityPurposeComponent;
  let fixture: ComponentFixture<ActivityPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
