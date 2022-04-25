import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TocListItemComponent } from './toc-list-item.component';

describe('TocListItemComponent', () => {
  let component: TocListItemComponent;
  let fixture: ComponentFixture<TocListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TocListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
