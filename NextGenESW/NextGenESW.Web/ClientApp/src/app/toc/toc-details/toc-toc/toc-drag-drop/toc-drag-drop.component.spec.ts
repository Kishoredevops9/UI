import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocDragDropComponent } from './toc-drag-drop.component';

describe('TocDragDropComponent', () => {
  let component: TocDragDropComponent;
  let fixture: ComponentFixture<TocDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TocDragDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TocDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
