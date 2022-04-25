import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManualsComponent } from './admin-manuals.component';

describe('AdminManualsComponent', () => {
  let component: AdminManualsComponent;
  let fixture: ComponentFixture<AdminManualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManualsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
