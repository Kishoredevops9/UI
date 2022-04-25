import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddonsPopupSearchComponent } from './addons-popup-search.component';

describe('AddonsPopupSearchComponent', () => {
  let component: AddonsPopupSearchComponent;
  let fixture: ComponentFixture<AddonsPopupSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddonsPopupSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonsPopupSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
