import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Color } from '@angular-material-components/color-picker';

import { hexToRgb } from '../../shared/utils/hexToRgb';
import { DEFAULT_SWIMLANE_BACKGROUND, DEFAULT_SWIMLANE_BORDER } from '../process-maps.consts';
import { Subject } from 'rxjs';
import { CreateDocumentService } from '@app/create-document/create-document.service';
interface DialogData {
  name: string;
  description: string;
  color: string;
  borderColor: string;
  borderStyle: string;
  borderWidth: number;
  isStepFlow?: boolean;
  isStep?: boolean;
  backgroundColor: string;
  disciplineId?: number;
}

@Component({
  selector: 'app-group-modify',
  templateUrl: './group-modify.component.html',
  styleUrls: ['./group-modify.component.scss'],

})
export class GroupModifyComponent implements OnInit {

  groupForm: FormGroup;
  showUpdateButton: boolean;
  touchUi: boolean;
  isStepFlow: boolean = false;
  isStep: boolean = false;
  selctdata: any = '';
  showDisciplineDropDown = false;
  eventsDiscipline: Subject<void> = new Subject<void>();
  discipline: any;
  selecteDiscipline: any;

  constructor(
    public createDocumentService: CreateDocumentService,
    private dialogRef: MatDialogRef<GroupModifyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private fb: FormBuilder
  ) {
    this.isStepFlow = data.isStepFlow;
    this.isStep = data.isStep;
    this.selectInitialDiscipline();
  }

  setDisciplineData($event) {
    this.selecteDiscipline = $event[0];
  }

  ngOnInit() {
    this.createDocumentService
      .getAllMetaDisciplineStep()
      .subscribe((res) => {
        this.discipline = res;
      });

    this.groupForm = this.createForm();
    this.showUpdateButton = this.shouldShowUpdateButton();
  }

  onFormSubmit() {
    const rawResult = this.groupForm.getRawValue();
    if (this.isStep) {
      rawResult.name = this.selecteDiscipline.name;
    }

    const result = {
      ...rawResult,
      borderColor: this.getColorControlValue(rawResult.borderColor),
      color: this.getColorControlValue(rawResult.color),
      disciplineId: this.selecteDiscipline ? this.selecteDiscipline.rowNo : 0
    };
    this.dialogRef.close(result);
  }

  private createForm() {
    const color = this.data.backgroundColor || DEFAULT_SWIMLANE_BACKGROUND;
    const borderColor = this.data.borderColor || DEFAULT_SWIMLANE_BORDER;

    return this.fb.group({
      name: [this.data.name || '', Validators.required],
      description: [this.data.description || ''],
      color: [this.createColorControl(color)],
      borderColor: [this.createColorControl(borderColor)],
      borderStyle: [this.data.borderStyle || 'solid'],
      borderWidth: [this.data.borderWidth || 1],
    });
  }

  private createColorControl(hex: string) {
    const { r, g, b } = hexToRgb(hex);

    return new Color(r, g, b);
  }

  private getColorControlValue(controlValue: any) {
    const hex = controlValue.hex as string;
    return hex.replace('#', '');
  }

  private shouldShowUpdateButton() {
    return !!this.data.name;
  }

  private selectInitialDiscipline() {
    if (!this.isStep) {
      return;
    }

    this.selecteDiscipline = {
      name: this.data.name,
      rowNo: this.data.disciplineId,
      parentId: 0,
      selectable: true,
    };
  }

}
