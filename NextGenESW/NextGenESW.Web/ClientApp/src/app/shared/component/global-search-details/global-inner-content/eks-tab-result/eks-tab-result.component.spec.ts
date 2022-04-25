import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksTabResultComponent } from './eks-tab-result.component';

describe('EksTabResultComponent', () => {
  let component: EksTabResultComponent;
  let fixture: ComponentFixture<EksTabResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksTabResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EksTabResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
