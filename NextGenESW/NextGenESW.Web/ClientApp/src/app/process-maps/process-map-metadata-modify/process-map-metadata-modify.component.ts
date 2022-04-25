import { ProcessMapMetaData } from './../process-maps.model';
import {
  addProcessMapMetaData,
  deleteProcessMapMetaData,
} from '../process-maps.actions';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '../process-maps.reducer';
import { selectSelectedProcessMap } from '@app/reducers';
import { ProcessMap } from '../process-maps.model';

interface DialogData {
  model: any;
  processMapId: number;
}

@Component({
  selector: 'app-process-map-metadata-modify',
  templateUrl: './process-map-metadata-modify.component.html',
  styleUrls: ['./process-map-metadata-modify.component.scss'],
})
export class ProcessMapMetaDataModifyComponent implements OnInit {
  model: any = [];
  manageMetaDataForm;
  processMapId: number;
  displayedColumns: string[] = ['key', 'value', 'action'];
  metaData: ProcessMapMetaData[];
  processMap: ProcessMap;

  @ViewChild('key') keyField: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private fb: FormBuilder,
    private store: Store<ProcessMapsState>,
    private dialogRef: MatDialogRef<ProcessMapMetaDataModifyComponent>
  ) {
    this.model = data.model.processMapMetaData;
    this.processMapId = data.processMapId;
    this.store.select(selectSelectedProcessMap).subscribe((processMap) => {
      this.processMap = processMap;
      this.metaData = this.processMap.processMapMeta;
    });
  }
  ngOnInit() {
    this.manageMetaDataForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  //Submits the new key value pair
  onAddMetaData() {
    this.store.dispatch(
      addProcessMapMetaData({
        mapId: this.processMapId,
        processMapMetaData: this.manageMetaDataForm.value,
      })
    );
    this.manageMetaDataForm.reset();
  }

  //Deletes specified metadata
  onDeleteMetaData(id) {
    this.store.dispatch(
      deleteProcessMapMetaData({ mapId: this.processMapId, metaDataId: id })
    );
  }
}
