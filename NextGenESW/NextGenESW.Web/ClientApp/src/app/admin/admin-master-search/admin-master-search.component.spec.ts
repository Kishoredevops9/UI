import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterSearchComponent } from './admin-master-search.component';

describe('AdminMasterSearchComponent', () => {
  let component: AdminMasterSearchComponent;
  let fixture: ComponentFixture<AdminMasterSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMasterSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMasterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
