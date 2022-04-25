import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { FileUploadModel, FileDetails } from './file-upload-model';
import * as FileSaver from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskItemsListService } from '@app/dashboard/task-items-list/task-items-list.service';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from "@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component";
import { RecordsService } from './../../../../app/shared/records.service';

import { ASSET_STATUSES } from '@environments/constants';



@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
})
export class ContentsComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  fileUploadDetails: FileDetails[] = [];
  fileUpList: FileList;
  idF:any;
  fileUploadModel: FileUploadModel;
  //displayFileNames = [];
  email: string = '';
  //RCID: any;
  isShowSpinner: boolean = false;
  isShowSpinnerForDownload: boolean = false;
  contentType:any;
  data2:any;
  fileUrl;
  relatedContentID:any;
  @Input() ContentId: any;
  @Input() CcId: any;
  @Input() globalData: any;
  publishMode: Boolean = false;
  loading: Boolean = false;
  constructor(
    private activityPageService: ActivityPageService,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    public  TaskItemsListService : TaskItemsListService,
    public dialog: MatDialog,
    private rservice: RecordsService,
  ) {}
  checkFocusOut(){
    this.rservice.UpdateBroadcastMessage('false');
  }
  checkValueChange(){
    this.rservice.UpdateBroadcastMessage('true');
  }
  ngOnChanges(event) {
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.publishMode = !this.isEditableMode;
      }
    }
    if (
      event.ContentId && event.ContentId.currentValue &&
      event.ContentId.previousValue != event.globalData.currentValue
    ) {
      this.ContentId = event.ContentId.currentValue;
    }else{
      this.ContentId = this.globalData?.contentId;
      this.CcId = this.globalData?.id;
    }
    this.relatedContentData();
  }
  ngOnInit(): void {
    this.fileUploadModel = new FileUploadModel();
    this.email = sessionStorage.getItem('userMail');
    //this.RCID = sessionStorage.getItem('RCID');
    //alert(this.ContentId);
    // if (this.ContentId) {
    //   this.getUploadedFile();

    // }

    this.relatedContentData();
  }

  relatedContentData(){
    if(this.globalData && this.globalData.originalAssetStatusId == 2 || this.globalData?.version >= 2){
      this.fileUploadDetails = [];
      console.log('files2222',this.globalData.relatedContentInformation);
      this.bindData(this.globalData.relatedContentInformation);
    }
    else{
      const idF = sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : this.CcId;
      console.log('priya',idF);
      console.log('priya',this.CcId);
      if ( idF ) {
        this.idF = idF;
        this.activityPageService.getUploadFileRelatedContent(this.idF)
          .subscribe(
            (data) => {
              this.fileUploadDetails = [];
              this.data2 = data;
              this.bindData(data);
            });
      }
    }
  }

  fileChanged(e) {
    console.log(e);
    /*let file = e.target.files[0];
     let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    fileReader.readAsText(file);*/
  }
  //   fileHandlers(files) {
  //     let file = files[0];
  //     //var fileData = new Blob([file]);

  //     this.RCID = sessionStorage.getItem('RCID');
  //     console.log("RC id--", this.RCID);
  //     let fileReader = new FileReader();

  //     var fileContents
  //     fileReader.onload = function(e) {
  //       fileContents = fileReader.result;

  //     }

  //     fileReader.readAsArrayBuffer(file);

  //     //let fileReader2 = new FileReader();

  // //    fileReader.readAsArrayBuffer(file);
  //     //this.fileUploadModel.UploadFile =
  //     /*var reader = new FileReader();
  //     reader.readAsArrayBuffer(fileData);
  //     var bytes;

  //     reader.onload = function () {
  //       var arrayBuffer = reader.result
  //       bytes = new Uint8Array(<ArrayBuffer>fileReader.result);
  //     }

  //     setTimeout(() => {
  //       // reader.readAsDataURL(new Blob([data]));
  //       console.log(bytes);*/

  //       //this.fileUploadModel.UploadFile = file;
  //       this.fileUpList = files;

  //       let formDataAry: any[] = [];
  //       console.log(this.fileUpList);
  //       for (let i = 0; i < this.fileUpList.length; i++) {

  //         let formData = new FormData();
  //         formData.append('file', file);
  //         //formDataAry.push(formData);
  //         // this.displayFileNames[i] = this.fileUpList[i].name;

  //         this.fileUploadModel.fileName = this.fileUpList[i].name;
  //         this.fileUploadModel.fileType = this.fileUpList[i].type;
  //       }

  //       //this.fileUploadModel.UploadFile = bytes;
  //       this.fileUploadModel.createdUser = this.email;
  //       this.fileUploadModel.relatedContentId = this.RCID;
  //       //this.fileUploadModel.UploadFile = files;
  //       console.log(this.displayFileNames);
  //       this.activityPageService
  //         .UploadFileRelatedContent(this.fileUploadModel)
  //         .subscribe((data) => {
  //           console.log(data);
  //           this.getUploadedFile();
  //           // this.router.navigate(['/activity-page/' + this.activityPageId]);
  //         });

  //       console.log(fileReader.result);
  //     //}, 300);

  //   }

  async fileHandlers(e) {
    this.rservice.UpdateBroadcastMessage('true');
    const files = e.target.files;
    this.isShowSpinner = true;
    const file = files[0];
    if(file.size < 1048576000){
    try {
      const fileContents: any = await this.readUploadedFileAsByte(file);

      // this.RCID = sessionStorage.getItem('RCID');
      console.log('RC id--', this.ContentId);
      console.log('RC id--', this.CcId);
      this.fileUpList = files;
      let formDataAry: any[] = [];
      console.log(this.fileUpList);
      for (let i = 0; i < this.fileUpList.length; i++) {
        let formData = new FormData();
        formData.append('file', file);
        //formDataAry.push(formData);
        // this.displayFileNames[i] = this.fileUpList[i].name;

        this.fileUploadModel.fileName = this.fileUpList[i].name;
        this.fileUploadModel.fileType = ''; //this.fileUpList[i].type;
      }

      this.fileUploadModel.UploadFile = fileContents;
      this.fileUploadModel.createdUser = this.email;
      this.fileUploadModel.relatedContentId = this.globalData.id;
      this.fileUploadModel.contentId = this.globalData.contentId;
      //this.fileUploadModel.UploadFile = files;
      console.log('File upload to server-----');
      console.log(this.fileUploadDetails);
      this.activityPageService
        .UploadFileRelatedContent(this.fileUploadModel)
        .subscribe((data) => {
          console.log(data);
          this.isShowSpinner = false;
          this.getUploadedFile();
          this.rservice.UpdateBroadcastMessage('false');

          // this.router.navigate(['/activity-page/' + this.activityPageId]);
          this.rservice.UpdateBroadcastMessage('false');
        });
    } catch (e) {
      this.isShowSpinner = false;
    }
  }
  else{
    this.isShowSpinner = false;
            this._snackBar.open(
              "'Maximum file Size allowed for Upload: 1,000 MB'",
              'x',
              {
                duration: 5000,
              }
            );
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

  openDoc(filename, fileurl) {
    console.log('FileUrl', fileurl);
    console.log(filename, fileurl);

    window.open(fileurl, '_blank');
  }

  downloadDoc() {}

  getUploadedFile() {
    this.fileUploadDetails = [];
    this.loading = true;
    this.activityPageService
      .getUploadFileRelatedContent(this.CcId)
      .subscribe(
        (data) => {
          console.log('files222',data);
          console.log('this.publishMode',this.publishMode);
          this.bindData(data);
          this.loading = false;
          // this.router.navigate(['/activity-page/' + this.activityPageId]);
        },
        (error) => {
          this.loading = false;
          console.error('There was an error!', error);
        }
      );
  }

  DownloadFile(fileUrl, fileName, fileType) {
    this.isShowSpinnerForDownload = true;
    console.log(fileUrl);
    this.activityPageService.downloadFile(fileUrl).subscribe((res) => {
      console.log(res);
      this.openPdf(res, fileName, fileType);
      // this.isShowSpinnerForDownload = false;
      //  this.isShowSpinner = false;
      // this.getUploadedFile();
      // this.router.navigate(['/activity-page/' + this.activityPageId]);
    });
  }
  deleteFile(element){
    this.rservice.UpdateBroadcastMessage('false');
    this.activityPageService.deleteRCItems(element.relatedContentInformationId).subscribe((res) => {
      this.relatedContentData();
    })
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  openPdf(element, fileName, fileType) {
    let type: string[] = fileType.split('/');

    fileType = type[1];
    let file = new Blob([this.base64ToArrayBuffer(element)], {
      type: 'application/pdf',
    });
    let append = this.ContentId ? this.ContentId : 'report';

    // if(fileName == 'text/plain'){
    FileSaver.saveAs(file, fileName);
    this.isShowSpinnerForDownload = false;
    // }else{
    //  FileSaver.saveAs(file, fileName + '.'+fileType);
    // }
  }

  downloadAllFile() {
    this.fileUploadDetails.forEach((element) => {
      this.isShowSpinnerForDownload = true;
      console.log(element.fileUrl);
      this.activityPageService
        .downloadFile(element.fileUrl)
        .subscribe((res) => {
          console.log(res);
          this.openPdf(res, element.fileName, element.fileType);
          //this.isShowSpinnerForDownload = false;
        });
    });
  }
  bindData(data) {
    data.forEach((element) => {
      this.fileUploadDetails.push({
        fileName: element['fileName'],
        fileUrl: element['fileUrl'],
        fileType: element['fileType'],
        relatedContentInformationId: element['relatedContentInformationId'],
      });
    });
    //console.log('this.fileUploadDetails',this.fileUploadDetails);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('contentNumber');
    sessionStorage.removeItem('documentId');
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}




