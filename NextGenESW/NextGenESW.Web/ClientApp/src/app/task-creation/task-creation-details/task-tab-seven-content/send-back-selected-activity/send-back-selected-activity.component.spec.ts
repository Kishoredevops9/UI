import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBackSelectedActivityComponent } from './send-back-selected-activity.component';

describe('SendBackSelectedActivityComponent', () => {
  let component: SendBackSelectedActivityComponent;
  let fixture: ComponentFixture<SendBackSelectedActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendBackSelectedActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBackSelectedActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
