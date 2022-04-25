import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankMapComponent } from './blank-map.component';

describe('BlankMapComponent', () => {
  let component: BlankMapComponent;
  let fixture: ComponentFixture<BlankMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlankMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
