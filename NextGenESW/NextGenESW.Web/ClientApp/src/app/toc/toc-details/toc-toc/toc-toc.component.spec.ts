import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TocTocComponent } from './toc-toc.component';

describe('TocTocComponent', () => {
  let component: TocTocComponent;
  let fixture: ComponentFixture<TocTocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TocTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
