import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagTreeComponent } from './tag-tree.component';

describe('TagTreeComponent', () => {
  let component: TagTreeComponent;
  let fixture: ComponentFixture<TagTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
