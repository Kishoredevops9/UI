import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TocPageComponent } from './toc-page.component';

describe('TocPageComponent', () => {
  let component: TocPageComponent;
  let fixture: ComponentFixture<TocPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TocPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
