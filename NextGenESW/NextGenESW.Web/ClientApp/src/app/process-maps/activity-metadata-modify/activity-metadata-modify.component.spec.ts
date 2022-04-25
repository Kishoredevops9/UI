import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityMetadataModifyComponent } from './activity-metadata-modify.component';

describe('ActivityMetadataModifyComponent', () => {
  let component: ActivityMetadataModifyComponent;
  let fixture: ComponentFixture<ActivityMetadataModifyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityMetadataModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMetadataModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
