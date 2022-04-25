import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IntentBasisValidationComponent } from './intent-basis-validation.component';

describe('IntentBasisValidationComponent', () => {
  let component: IntentBasisValidationComponent;
  let fixture: ComponentFixture<IntentBasisValidationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentBasisValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentBasisValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
