import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabTwoContentComponent } from './task-tab-two-content.component';

describe('TabTwoContentComponent', () => {
  let component: TabTwoContentComponent;
  let fixture: ComponentFixture<TabTwoContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabTwoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabTwoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
