import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksFilterSectionComponent } from './eks-filter-section.component';

describe('EksFilterSectionComponent', () => {
  let component: EksFilterSectionComponent;
  let fixture: ComponentFixture<EksFilterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksFilterSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EksFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
