import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksaddonsConfirmpopupComponent } from './eksaddons-confirmpopup.component';

describe('EksaddonsConfirmpopupComponent', () => {
  let component: EksaddonsConfirmpopupComponent;
  let fixture: ComponentFixture<EksaddonsConfirmpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksaddonsConfirmpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EksaddonsConfirmpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
