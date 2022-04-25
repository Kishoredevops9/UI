import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopMenuActionsComponent } from './top-menu-actions.component';

describe('TopMenuActionsComponent', () => {
  let component: TopMenuActionsComponent;
  let fixture: ComponentFixture<TopMenuActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMenuActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMenuActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
