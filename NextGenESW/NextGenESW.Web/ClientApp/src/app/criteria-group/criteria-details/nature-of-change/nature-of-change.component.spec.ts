import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NatureOfChangeComponent } from './nature-of-change.component';

describe('NatureOfChangeComponent', () => {
  let component: NatureOfChangeComponent;
  let fixture: ComponentFixture<NatureOfChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NatureOfChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureOfChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
