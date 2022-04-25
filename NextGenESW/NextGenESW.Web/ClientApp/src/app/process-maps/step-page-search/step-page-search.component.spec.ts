import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPageSearchComponent } from './step-page-search.component';

describe('StepPageSearchComponent', () => {
  let component: StepPageSearchComponent;
  let fixture: ComponentFixture<StepPageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepPageSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
