import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuidePropertiesComponent } from './guide-properties.component';

describe('GuidePropertiesComponent', () => {
  let component: GuidePropertiesComponent;
  let fixture: ComponentFixture<GuidePropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
