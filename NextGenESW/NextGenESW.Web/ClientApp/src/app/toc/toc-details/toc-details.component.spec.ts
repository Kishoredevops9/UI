import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TocDetailsComponent } from './toc-details.component';

describe('TocDetailsComponent', () => {
  let component: TocDetailsComponent;
  let fixture: ComponentFixture<TocDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TocDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
