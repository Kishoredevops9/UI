import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDragDropComponent } from './activity-drag-drop.component';

describe('ActivityDragDropComponent', () => {
  let component: ActivityDragDropComponent;
  let fixture: ComponentFixture<ActivityDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDragDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
