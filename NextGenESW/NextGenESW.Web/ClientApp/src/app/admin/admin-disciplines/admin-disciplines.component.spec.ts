import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisciplinesComponent } from './admin-disciplines.component';

describe('AdminDisciplinesComponent', () => {
  let component: AdminDisciplinesComponent;
  let fixture: ComponentFixture<AdminDisciplinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDisciplinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDisciplinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
