import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportComplianceComponent } from './export-compliance.component';

describe('ExportComplianceComponent', () => {
  let component: ExportComplianceComponent;
  let fixture: ComponentFixture<ExportComplianceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExportComplianceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
