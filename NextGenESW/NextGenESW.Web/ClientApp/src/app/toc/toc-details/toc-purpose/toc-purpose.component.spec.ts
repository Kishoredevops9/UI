import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TocPurposeComponent } from './toc-purpose.component';

describe('TocPurposeComponent', () => {
  let component: TocPurposeComponent;
  let fixture: ComponentFixture<TocPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TocPurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
