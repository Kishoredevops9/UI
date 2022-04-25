import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGeneralGuidanceComponent } from './activity-general-guidance.component';

describe('ActivityGeneralGuidanceComponent', () => {
  let component: ActivityGeneralGuidanceComponent;
  let fixture: ComponentFixture<ActivityGeneralGuidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityGeneralGuidanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityGeneralGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
