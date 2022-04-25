import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabSixContentComponent } from './task-tab-six-content.component';

describe('TabSixContentComponent', () => {
  let component: TabSixContentComponent;
  let fixture: ComponentFixture<TabSixContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabSixContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSixContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
