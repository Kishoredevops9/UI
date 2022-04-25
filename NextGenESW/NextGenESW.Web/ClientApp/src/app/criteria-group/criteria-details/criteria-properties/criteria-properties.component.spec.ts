import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CriteriaPropertiesComponent } from './criteria-properties.component';

describe('CriteriaPropertiesComponent', () => {
  let component: CriteriaPropertiesComponent;
  let fixture: ComponentFixture<CriteriaPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
