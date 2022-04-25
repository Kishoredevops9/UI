import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepExportComplianceComponent } from './step-export-compliance.component';

describe('StepExportComplianceComponent', () => {
  let component: StepExportComplianceComponent;
  let fixture: ComponentFixture<StepExportComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepExportComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepExportComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
