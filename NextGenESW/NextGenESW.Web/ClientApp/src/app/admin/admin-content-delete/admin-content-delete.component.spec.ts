import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContentDeleteComponent } from './admin-content-delete.component';

describe('AdminContentDeleteComponent', () => {
  let component: AdminContentDeleteComponent;
  let fixture: ComponentFixture<AdminContentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminContentDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
