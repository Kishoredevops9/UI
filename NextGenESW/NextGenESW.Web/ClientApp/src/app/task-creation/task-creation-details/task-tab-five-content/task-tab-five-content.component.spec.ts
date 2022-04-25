import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabFiveContentComponent } from './task-tab-five-content.component';

describe('TabFiveContentComponent', () => {
  let component: TabFiveContentComponent;
  let fixture: ComponentFixture<TabFiveContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabFiveContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFiveContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
