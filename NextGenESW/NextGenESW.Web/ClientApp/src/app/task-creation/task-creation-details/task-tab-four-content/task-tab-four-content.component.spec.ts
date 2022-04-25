import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabFourContentComponent } from './task-tab-four-content.component';

describe('TabFourContentComponent', () => {
  let component: TabFourContentComponent;
  let fixture: ComponentFixture<TabFourContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabFourContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFourContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
