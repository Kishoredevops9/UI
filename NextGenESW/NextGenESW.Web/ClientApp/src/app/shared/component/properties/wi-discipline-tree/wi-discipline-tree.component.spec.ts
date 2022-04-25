import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WiDisciplineTreeComponent } from './wi-discipline-tree.component';

describe('WiDisciplineTreeComponent', () => {
  let component: WiDisciplineTreeComponent;
  let fixture: ComponentFixture<WiDisciplineTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WiDisciplineTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiDisciplineTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
