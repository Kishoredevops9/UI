import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFooterLinksComponent } from './admin-footer-links.component';

describe('AdminFooterLinksComponent', () => {
  let component: AdminFooterLinksComponent;
  let fixture: ComponentFixture<AdminFooterLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFooterLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFooterLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
