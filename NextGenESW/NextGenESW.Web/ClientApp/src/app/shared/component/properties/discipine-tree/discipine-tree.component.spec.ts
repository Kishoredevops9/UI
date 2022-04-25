import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DiscipineTreeComponent } from './discipine-tree.component';

describe('DiscipineTreeComponent', () => {
  let component: DiscipineTreeComponent;
  let fixture: ComponentFixture<DiscipineTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscipineTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscipineTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
