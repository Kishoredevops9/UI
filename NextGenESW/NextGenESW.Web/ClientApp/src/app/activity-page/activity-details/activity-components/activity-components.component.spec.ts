import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityComponentsComponent } from './activity-components.component';

describe('ActivityComponentsComponent', () => {
  let component: ActivityComponentsComponent;
  let fixture: ComponentFixture<ActivityComponentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
