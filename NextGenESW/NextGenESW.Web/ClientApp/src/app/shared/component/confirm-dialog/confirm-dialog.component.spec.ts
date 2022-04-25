import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    const matDialogRefStub = () => ({ close: arg => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConfirmDialogComponent],
      providers: [{ provide: MatDialogRef, useFactory: matDialogRefStub }]
    });
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  }));

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onConfirm', () => {
    it('makes expected calls', () => {
      const matDialogRefStub: MatDialogRef<typeof component> = fixture.debugElement.injector.get(
        MatDialogRef
      );
      spyOn(matDialogRefStub, 'close').and.callThrough();
      component.onConfirm();
      expect(matDialogRefStub.close).toHaveBeenCalled();
    });
  });

  describe('onDismiss', () => {
    it('makes expected calls', () => {
      const matDialogRefStub: MatDialogRef<typeof component> = fixture.debugElement.injector.get(
        MatDialogRef
      );
      spyOn(matDialogRefStub, 'close').and.callThrough();
      component.onDismiss();
      expect(matDialogRefStub.close).toHaveBeenCalled();
    });
  });

});
