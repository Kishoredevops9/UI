import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBackDeviationComponent } from './send-back-deviation.component';

describe('SendBackDeviationComponent', () => {
  let component: SendBackDeviationComponent;
  let fixture: ComponentFixture<SendBackDeviationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendBackDeviationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBackDeviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
