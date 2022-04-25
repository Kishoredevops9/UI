import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabThreeContentComponent } from './task-tab-three-content.component';

describe('TabThreeContentComponent', () => {
  let component: TabThreeContentComponent;
  let fixture: ComponentFixture<TabThreeContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabThreeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabThreeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
