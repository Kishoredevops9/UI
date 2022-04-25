import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FileDetails,
  uploadETFF,
} from '@app/task-creation/task-creation.model';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  fileUploadDetails: FileDetails[] = [];
  fileUpList: FileList;
  fileUploadModel: uploadETFF;
  isShowSpinner: boolean = false;
  email: string = '';
  selectedFileName: string = '';
  taskId: any;
  taskComponentId: any;
  documentTypeCode: any;
  revisionId: string = '1';
  folderName: string = 'Standard Work1';
  filesContainer: Array<any>;
  private _value: number = 0;
  enableCall: boolean;
  fileUploadForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileUploadService: TaskCrationPageService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {
    this.taskComponentId = data.taskComponentId;
    this.documentTypeCode = data.documentTypeCode;
    this.taskId = data.taskId;
    this.filesContainer = new Array();
    this.fileUploadForm = this.fb.group({
      fileUpload: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fileUploadModel = new uploadETFF();
    this.email = sessionStorage.getItem('userMail');
  }
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (!isNaN(value) && value <= 100) {
      // if (!this.enableCall && value != 100) return;
      // this.enableCall = false;
      this._value = value;
      // setTimeout(() => (this.enableCall = true), 250);
    }
  }

  async fileHandlers(files, event) {
    // this.isShowSpinner = true;
    const file = files[0];
    this.selectedFileName = file.name;
    let fileType = this.selectedFileName.split('.').pop();
    const fileContents: any = await this.readUploadedFileAsByte(file);
    this.fileUpList = files;
    let formDataAry: any[] = [];

    for (let i = 0; i < this.fileUpList.length; i++) {
      let formData = new FormData();
      formData.append('file', file);

      this.fileUploadModel.fileData = fileContents;
      this.fileUploadModel.taskId = this.taskId;
      this.fileUploadModel.revisionId = this.revisionId;
      this.fileUploadModel.dataSetType = fileType;
      this.fileUploadModel.dataSetName = this.fileUpList[i].name;
      this.fileUploadModel.requester = this.email;
      // this.fileUploadModel.uploadFileName = this.fileUpList[i].name;
      // this.fileUploadModel.uploadFileType = fileType;
      this.fileUploadModel.taskComponentId = this.taskComponentId;
      this.fileUploadModel.documentTypeCode = this.documentTypeCode;
    }
  }

  readUploadedFileAsByte(inputFile) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result.toString());
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  closeModal(button: any) {
    this.dialogRef.close(button);
  }

  uploadETFFHandler() {
    this.fileUploadService
      .uploadETFF(this.fileUploadModel)
      .subscribe((event) => {
        if (event['loaded'] && event['total']) {
          this.value = Math.round((event['loaded'] / event['total']) * 100);
        }
        this.sharedService.setFileUploadData(true);
      });
  }
}
