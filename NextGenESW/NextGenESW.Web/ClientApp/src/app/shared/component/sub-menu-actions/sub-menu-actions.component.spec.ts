import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubMenuActionsComponent } from './sub-menu-actions.component';

describe('SubMenuActionsComponent', () => {
  let component: SubMenuActionsComponent;
  let fixture: ComponentFixture<SubMenuActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMenuActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
