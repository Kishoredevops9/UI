import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollaborateDialogComponent } from './collaborate-dialog.component';

describe('CollaborateComponent', () => {
  let component: CollaborateDialogComponent;
  let fixture: ComponentFixture<CollaborateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CollaborateDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaborateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
