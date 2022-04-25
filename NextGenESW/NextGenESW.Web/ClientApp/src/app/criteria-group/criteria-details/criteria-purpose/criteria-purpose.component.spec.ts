import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CriteriaPurposeComponent } from './criteria-purpose.component';

describe('CriteriaPurposeComponent', () => {
  let component: CriteriaPurposeComponent;
  let fixture: ComponentFixture<CriteriaPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaPurposeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
