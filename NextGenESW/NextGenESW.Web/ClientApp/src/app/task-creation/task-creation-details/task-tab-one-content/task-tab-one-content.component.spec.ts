import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabOneContentComponent } from './task-tab-one-content.component';

describe('TabOneContentComponent', () => {
  let component: TabOneContentComponent;
  let fixture: ComponentFixture<TabOneContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabOneContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabOneContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
