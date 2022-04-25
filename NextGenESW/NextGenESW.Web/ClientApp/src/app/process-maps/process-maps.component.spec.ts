import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessMapsComponent } from './process-maps.component';

describe('ProcessMapsComponent', () => {
  let component: ProcessMapsComponent;
  let fixture: ComponentFixture<ProcessMapsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
