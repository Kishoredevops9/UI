import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksaddonsFilterComponent } from './eksaddons-filter.component';

describe('EksaddonsFilterComponent', () => {
  let component: EksaddonsFilterComponent;
  let fixture: ComponentFixture<EksaddonsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksaddonsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EksaddonsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
