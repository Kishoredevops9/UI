import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserGuidesComponent } from './admin-user-guides.component';

describe('AdminUserGuidesComponent', () => {
  let component: AdminUserGuidesComponent;
  let fixture: ComponentFixture<AdminUserGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUserGuidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
