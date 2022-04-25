import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapPurposeComponent } from './map-purpose.component';

describe('MapPurposeComponent', () => {
  let component: MapPurposeComponent;
  let fixture: ComponentFixture<MapPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
