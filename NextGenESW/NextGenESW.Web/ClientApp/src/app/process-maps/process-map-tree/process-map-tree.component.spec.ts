import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessMapTreeComponent } from './process-map-tree.component';

describe('ProcessMapTreeComponent', () => {
  let component: ProcessMapTreeComponent;
  let fixture: ComponentFixture<ProcessMapTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessMapTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMapTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
