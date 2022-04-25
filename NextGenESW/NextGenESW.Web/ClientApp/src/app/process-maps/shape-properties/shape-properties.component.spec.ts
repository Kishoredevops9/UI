import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShapePropertiesComponent } from './shape-properties.component';

describe('ShapePropertiesComponent', () => {
  let component: ShapePropertiesComponent;
  let fixture: ComponentFixture<ShapePropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
