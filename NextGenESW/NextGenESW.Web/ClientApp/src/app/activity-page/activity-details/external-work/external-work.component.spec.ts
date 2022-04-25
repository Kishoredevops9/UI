import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalWorkComponent } from './external-work.component';

describe('ExternalWorkComponent', () => {
  let component: ExternalWorkComponent;
  let fixture: ComponentFixture<ExternalWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
