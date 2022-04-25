import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalContentListComponent } from './global-content-list.component';

describe('GlobalContentListComponent', () => {
  let component: GlobalContentListComponent;
  let fixture: ComponentFixture<GlobalContentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalContentListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
