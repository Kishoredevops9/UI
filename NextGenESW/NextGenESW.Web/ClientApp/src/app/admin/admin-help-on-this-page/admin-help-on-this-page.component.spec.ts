import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHelpOnThisPageComponent } from './admin-help-on-this-page.component';

describe('AdminHelpOnThisPageComponent', () => {
  let component: AdminHelpOnThisPageComponent;
  let fixture: ComponentFixture<AdminHelpOnThisPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHelpOnThisPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHelpOnThisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
