import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActivityPopupComponent } from './new-activity-popup.component';

describe('NewActivityPopupComponent', () => {
  let component: NewActivityPopupComponent;
  let fixture: ComponentFixture<NewActivityPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewActivityPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewActivityPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
