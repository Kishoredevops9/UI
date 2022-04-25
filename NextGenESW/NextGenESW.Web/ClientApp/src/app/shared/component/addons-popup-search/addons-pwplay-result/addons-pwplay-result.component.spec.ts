import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsPwplayResultComponent } from './addons-pwplay-result.component';

describe('AddonsPwplayResultComponent', () => {
  let component: AddonsPwplayResultComponent;
  let fixture: ComponentFixture<AddonsPwplayResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonsPwplayResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonsPwplayResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
