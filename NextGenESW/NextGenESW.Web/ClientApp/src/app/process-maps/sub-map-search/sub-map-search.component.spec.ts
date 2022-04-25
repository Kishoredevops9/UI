import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubMapSearchComponent } from './sub-map-search.component';

describe('SubMapSearchComponent', () => {
  let component: SubMapSearchComponent;
  let fixture: ComponentFixture<SubMapSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMapSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
