import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityPageSearchComponent } from './activity-page-search.component';

describe('ActivityPageSearchComponent', () => {
  let component: ActivityPageSearchComponent;
  let fixture: ComponentFixture<ActivityPageSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPageSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
