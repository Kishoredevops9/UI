import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadWeblinkDialogComponent } from './upload-weblink-dialog.component';

describe('UploadWeblinkDialogComponent', () => {
  let component: UploadWeblinkDialogComponent;
  let fixture: ComponentFixture<UploadWeblinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadWeblinkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadWeblinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
