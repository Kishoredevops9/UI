import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VbrickResultComponent } from './vbrick-result.component';

describe('VbrickResultComponent', () => {
  let component: VbrickResultComponent;
  let fixture: ComponentFixture<VbrickResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VbrickResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VbrickResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
