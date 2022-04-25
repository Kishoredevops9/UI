import { Component, OnInit, Input, Output, EventEmitter, Host, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { PersistanceService } from '@app/shared/persistance.service';
import * as FileSaver from 'file-saver';
import { ContextService } from '../global-panel/context/context.service';
import { RecordsService } from '../../records.service';
import { MatDialog } from '@angular/material/dialog';
import { ProcessMapsService } from '@app/process-maps/process-maps.service'
import { ASSET_STATUSES, launchXClass } from '../../../../environments/constants';
import { environment } from '@environments/environment';
import { CollaborateDialogComponent } from '@app/dashboard/content-list/collaborate-dialog/collaborate-dialog.component';
import { ConfirmObsoleteDialogComponent } from '@app/shared/component/confirm-obsolete-dialog/confirm-obsolete-dialog.component';
import { TaskItemsListService } from '@app/dashboard/task-items-list/task-items-list.service';
import { forkJoin } from 'rxjs';
import { ContentListService } from '@app/dashboard/content-list/content-list.service';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';

@Component({
  selector: 'app-sub-menu-actions',
  templateUrl: './sub-menu-actions.component.html',
  styleUrls: ['./sub-menu-actions.component.scss'],
})
export class SubMenuActionsComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  authorGuidances = environment.authorGuidances;
  ownerEdit: boolean = false;
  launchXClassPath = environment.XClassLaunchURL;
  disableObsoleteDocuments = environment.disableObsoleteDocuments;
  launchXClassPathNew;
  sfStatus1
  IsCheckOut: boolean = false;
  @Input() globalContent: any;
  @Input() globalThreeDots: any;

  @Input() contentType: any;
  @Input() id: any;
  @Input() type: any;
  @Output() messageToEmit = new EventEmitter<string>();
  @Output() revisionMessageToEmit = new EventEmitter<string>();
  @Output() recallMessageToEmit = new EventEmitter<string>();
  @Output() updateLastModifiedDate = new EventEmitter<string>();
  @Input() isFormDirty: boolean;
  checkOut: any;
  disableForm: boolean = false;
  contentId: any;
  contentId1: any;
  @Input() contentCollaboration: any;
  @Input() docStatus: string;
  bottomLineStyle;
  userMail;
  showCheckBtns: boolean = true;
  pdfURL: any;
  reCallManu: boolean = false;
  showOpenDocumentOption: boolean = false;
  @Input() isPublisheddocument: any;
  loading = false;
  globalData: any = {};
  broadCastMessage: any = '';
  time = new Date("2016-01-16T16:00:00");
  appened: any;
  EKSConentGroupControl: string;
  EKSAdminGroupControl: string;
  formDirty: boolean = false;
  @Input() propertiesLastUpdateDateTime: any;

  isNotStep: boolean = true;
  publishCond;
  checkKPcontent: any;
  displayName1 = sessionStorage.getItem('userMail');
  constructor(
    private globalService: GlobalService,
    private activityPageService: ActivityPageService,
    private _snackBar: MatSnackBar,
    private profileData: PersistanceService,
    private contextService: ContextService,
    private criteriaGroupService: CriteriaGroupPageService,
    private router: Router,
    private route: ActivatedRoute,
    private rservice: RecordsService,
    private taskItemsListService: TaskItemsListService,
    public dialog: MatDialog,
    public processMapsService: ProcessMapsService,
    public contentListService: ContentListService
  ) {
    // this.ownerEditValue(false);
  }

  ngOnChanges(event) {
    if (
      event.globalContent &&
      event.globalContent.currentValue &&
      event.globalContent.previousValue != event.globalContent.currentValue
    ) {
      if (this.globalContent.contentOwnerId == this.displayName1 && this.isStatusPublished(this.globalContent.originalAssetStatus)) {
        this.ownerEdit = true;
      }
      if (
        !(Object.keys(this.globalContent).length === 0) &&
        this.globalContent.id > 0
      ) {
        this.bottomLineStyle =
          this.globalContent.contentType == 'WI'
            ? 'bottom-line-wi'
            : this.globalContent.contentType == 'GB'
              ? 'bottom-line-gb'
              : this.globalContent.contentType == 'DS'
                ? 'bottom-line-ds'
                : this.globalContent.contentType == 'AP'
                  ? 'bottom-line-ap'
                  : this.globalContent.contentType == 'CG'
                    ? 'bottom-line-cg'
                    : this.globalContent.contentType == 'KP'
                      ? 'bottom-line-kp'
                      : 'bottom-line-rc';
        if (this.globalContent.lastUpdateDateTime) {
          var splitTime = this.globalContent.lastUpdateDateTime.split('T', 1);
          var date = splitTime[0].split('-');
          this.appened = `${date[1]}/${date[2]}/${date[0]}`;
        }
        this.contentId1 = this.globalContent.contentId;
      }
    }

    const status = this.globalContent?.assetStatus;
    const sfStatus = sessionStorage.getItem('sfStatus');
    if (status === ASSET_STATUSES.PUBLISHED || status === ASSET_STATUSES.CURRENT || status === ASSET_STATUSES.OBSOLETE) {
      this.reCallManu = false;
      this.sfStatus1 = 'published';
    }
    else if (sfStatus == 'Submitted for Approval') {
      this.reCallManu = true;
      this.sfStatus1 = 'Submitted for Approval'
    }
    else if (sfStatus == 'Approved, Waiting for JC') {
      this.reCallManu = true;
      this.sfStatus1 = 'Approved, Waiting for JC'
    }
    const pwStatus = event.globalContent?.currentValue?.pwStatus;
    if (pwStatus == 'Submitted for Approval') {
      event.globalContent.currentValue.assetStatusId = 3;
      event.globalContent.currentValue.assetStatus = ASSET_STATUSES.SUBMITTED_FOR_APPROVAL;
    }
    if (pwStatus == 'Approved, Waiting for JC') {
      event.globalContent.currentValue.assetStatusId = 4;
      event.globalContent.currentValue.assetStatus = ASSET_STATUSES.APPROVED_WAITING_FOR_JC;

    } else {

    }

    if (event.isFormDirty && event.isFormDirty.previousValue != event.isFormDirty.currentValue) {
      this.formDirty = event.isFormDirty.currentValue;
    }
    if (
      event.propertiesLastUpdateDateTime &&
      event.propertiesLastUpdateDateTime.currentValue &&
      event.propertiesLastUpdateDateTime.previousValue != event.propertiesLastUpdateDateTime.currentValue
    ) {
      var splitTime = event.propertiesLastUpdateDateTime.currentValue.split('T', 1);
      var date = splitTime[0].split('-');
      this.appened = `${date[1]}/${date[2]}/${date[0]}`;
    }

    this.checkForStep();

    if (this.globalContent?.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.globalContent?.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC) {
      this.reCallManu = true;
    }
    else {
      this.reCallManu = false;
    }

    console.log('globalThreeDots to check', this.globalThreeDots);
    //console.log(' this.globalContent.contentType ',this.globalContent.contentType);
    //console.log('  event.globalContent test',event.globalContent.currentValue.assetTypeCode);
    this.checkKPcontent = this.globalContent?.contentType;
    let checkStepPreview = sessionStorage.getItem('backPriviewOn');
    if (checkStepPreview == 'true' && this.globalContent?.assetTypeId == 13) {
    } else if (checkStepPreview == 'false' && this.globalContent?.assetStatus === ASSET_STATUSES.DRAFT) {
      sessionStorage.setItem('backPriviewOn', 'false');
    } else {
      sessionStorage.setItem('backPriviewOn', 'false');
    }
  }

  checkForStep() {
    // if(this.globalContent){
    //   if(this.globalContent.assetTypeId == 14 && this.globalContent.contentType == "SP"){
    //     this.isNotStep = false;
    //   }else{
    //     this.isNotStep = true;
    //   }
    // }
  }

  ngOnInit(): void {
    console.log(' docStatus', this.docStatus);
    this.launchXClass();
    //console.log('',this.globalContent);
    //console.log('',this.globalContent.assetStatusId);
    this.publishCond = this.globalContent?.assetStatus;
    if (this.globalContent?.contentOwnerId == this.displayName1) {
      this.ownerEdit = true;
    }

    if (this.globalContent?.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.globalContent?.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC) {
      this.reCallManu = true;
    }
    else {
      this.reCallManu = false;
    }
    //let publishCond = sessionStorage.getItem('sfStatus');
    this.route.params.subscribe((param) => {
      console.log(param)
      this.id = parseInt(param.id);
    });
    this.checkForStep();

    this.EKSConentGroupControl = sessionStorage.getItem('EKSConentGroupControl');
    this.EKSAdminGroupControl = sessionStorage.getItem('EKSAdminGroupControl');
    // initialising  record service for saved-saving button in html
    this.rservice.broadcast.subscribe(
      (broadCastMessage) => (this.broadCastMessage = broadCastMessage)
    );

    this.profileData.currentProfile.subscribe((data) => {
      this.userMail = data.mail;
      //console.log('userMail', this.userMail);
      if (this.globalContent) {
        this.contentCollaboration = {
          contentCollaboration: {
            resourceType: this.globalContent.contentType,
            resourceId: this.globalContent.id
              ? this.globalContent.id.toString()
              : 0,
            checkedOutOn: new Date(),
            checkedOutBy: this.userMail,
          },
          contentCollaborationHistory: {
            resourceType: this.globalContent.contentType,
            resourceId: this.globalContent.id
              ? this.globalContent.id.toString()
              : 0,
            checkedOutOn: new Date(),
            checkedOutBy: this.userMail,
          },
        };
      }
    });
    // this.getContentCollaboration();
    this.contextService.getContextInfo.subscribe((context) => {
      const contextInfo = context;
      this.globalContent = contextInfo.entityInfo;
      if (
        this.globalContent && (this.globalContent.originalAssetStatus === ASSET_STATUSES.PUBLISHED || this.globalContent.originalAssetStatus === ASSET_STATUSES.CURRENT || this.globalContent.originalAssetStatus === ASSET_STATUSES.OBSOLETE)
      ) {
        if (contextInfo && contextInfo.entityId > 0) {
          this.globalContent.id = contextInfo.entityId;
        }
        this.globalContent.contentType = this.globalContent.contentType
          ? this.globalContent.contentType
          : this.globalContent.documentType;
      }
    });
    let checkStepPreview = sessionStorage.getItem('backPriviewOn');
    if (checkStepPreview == 'true' && this.globalContent?.assetTypeId == 13) {
    } else if (checkStepPreview == 'false' && this.globalContent?.assetTypeId == 1) {
      sessionStorage.setItem('backPriviewOn', 'false');
    } else {
      sessionStorage.setItem('backPriviewOn', 'false');
    }

  }

  // getContentCollaboration() {
  //   this.showCheckBtns = true;
  //   this.activityPageService
  //     .getContentCollaboration(JSON.stringify(this.contentCollaboration))
  //     .subscribe((data) => {
  //       //console.log('get content collaboration', data);
  //       var res = JSON.parse(JSON.stringify(data));
  //       //console.log('res', res);
  //       //console.log('validation', res.validationMessage);
  //       if (res.contentCollaboration != null && res.validationMessage != null) {
  //         this._snackBar.open("'" + res.validationMessage + "'", 'x', {
  //           duration: 5000,
  //         });
  //         this.IsCheckOut = false;
  //         this.disableForm = true;
  //       } else if (
  //         res.contentCollaboration != null &&
  //         res.validationMessage == null
  //       ) {
  //         this.IsCheckOut = true;
  //         this.disableForm = false;
  //       } else {
  //         this.showCheckBtns = false;
  //         this.IsCheckOut = false;
  //         this.disableForm = true;
  //       }
  //     });
  // }
  exportToExcel() {
    let urlLocation = window.location.href;
    let url = urlLocation.substr(0, urlLocation.lastIndexOf("/SF") + 1);
    if (!url) {
      url = urlLocation.substr(0, urlLocation.lastIndexOf("/process-maps") + 1) + 'view-document';
    }
    this.processMapsService.getExportoXlsSF(this.globalContent.id, url)
      .subscribe((resultBlob: Blob) => {
        var fileName = this.globalContent.contentId ? `${this.globalContent.contentId}.xlsx` : 'StepFlow.xlsx';
        FileSaver.saveAs(resultBlob, fileName);
      });
  }
  exportToExcelSP() {
    let urlLocation = window.location.href;
    let url = urlLocation.substr(0, urlLocation.lastIndexOf("/SP") + 1);
    if (!url) {
      url = urlLocation.substr(0, urlLocation.lastIndexOf("/process-maps") + 1) + 'view-document';
    }
    this.processMapsService.getExportoXlsStep(this.globalContent.id, url)
      .subscribe((resultBlob: Blob) => {
        var fileName = this.globalContent.contentId ? `${this.globalContent.contentId}.xlsx` : 'StepFlow.xlsx';
        FileSaver.saveAs(resultBlob, fileName);
      });
  }
  exportToPDF() {
    //console.log("this.globalContent",this.globalContent);
    this.globalService
      .exportToPDF(this.globalContent.contentId)
      .subscribe((resURL) => {
        const fileName = `${this.contentType.toUpperCase()}_${this.globalContent.contentId}`
        this.openPdf(
          resURL,
          fileName,
          'pdf'
        );
        // this.activityPageService
        //   .downloadFile(this.pdfURL.fileUrl)
        //   .subscribe((res) => {
        //     this.openPdf(
        //       res,
        //       this.pdfURL.fileUrl.split('/')[
        //         this.pdfURL.fileUrl.split('/').length - 1
        //       ],
        //       'pdf'
        //     );
        //   });
      });
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
    let file = new Blob([this.base64ToArrayBuffer(element)], {
      type: 'application/pdf',
    });
    // let append = this.globalContent.contentId
    //   ? this.globalContent.contentId
    //   : 'report';

    FileSaver.saveAs(file, fileName);
  }
  addContent(type, warningTemplate) {
    if (this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      if (type === 'checkin') {
        if (this.checkOut == undefined) {
          this.loading = true;
          this.activityPageService
            .addContentCollaboration(JSON.stringify(this.contentCollaboration))
            .subscribe(
              (data) => {
                //console.log('add content collaboration', data);
                var res = JSON.parse(JSON.stringify(data));
                //console.log('addValidation', res.validationMessage);
                this.checkOut = data;
                this.checkOut.contentCollaborationHistory.checkedInOn = new Date();
                this.activityPageService
                  .updateContentCollaboration(JSON.stringify(this.checkOut))
                  .subscribe(
                    (data) => {
                      //console.log('update content collaboration', data);
                      var res = JSON.parse(JSON.stringify(data));
                      //console.log('addValidation', res.validationMessage);
                      if (res.validationMessage != '') {
                        this._snackBar.open(
                          "'Successfully check in the changes!'",
                          'x',
                          {
                            duration: 5000,
                          }
                        );
                        this.IsCheckOut = false;
                        this.disableForm = true;
                      } else {
                        this.IsCheckOut = true;
                        this.disableForm = false;
                      }
                      this.loading = false;
                    },
                    (error) => {
                      console.error('There was an error!', error);
                      this.loading = false;
                    }
                  );
              },
              (error) => {
                console.error('There was an error!', error);
                this.loading = false;
              }
            );
        } else {
          this.checkOut.contentCollaborationHistory.checkedInOn = new Date();
          this.loading = true;
          this.activityPageService
            .updateContentCollaboration(JSON.stringify(this.checkOut))
            .subscribe(
              (data) => {
                //console.log('update content collaboration', data);
                var res = JSON.parse(JSON.stringify(data));
                //console.log('addValidation', res.validationMessage);
                if (res.validationMessage != '') {
                  this._snackBar.open(
                    "'Successfully check in the changes!'",
                    'x',
                    {
                      duration: 5000,
                    }
                  );
                  this.IsCheckOut = false;
                  this.disableForm = true;
                } else {
                  this.IsCheckOut = true;
                  this.disableForm = false;
                }
                this.loading = false;
              },
              (error) => {
                console.error('There was an error!', error);
                this.loading = false;
              }
            );
        }
      } else {
        this.loading = true;
        this.activityPageService
          .addContentCollaboration(JSON.stringify(this.contentCollaboration))
          .subscribe(
            (data) => {
              //console.log('add content collaboration', data);
              var res = JSON.parse(JSON.stringify(data));
              //console.log('addValidation', res.validationMessage);
              this.checkOut = data;
              if (res.validationMessage != '') {
                this._snackBar.open("'" + res.validationMessage + "'", 'x', {
                  duration: 5000,
                });
                this.IsCheckOut = false;
                this.disableForm = true;
              } else {
                this.IsCheckOut = true;
                this.disableForm = false;
              }
              this.loading = false;
            },
            (error) => {
              console.error('There was an error!', error);
              this.loading = false;
            }
          );
      }
    }
  }

  sendMessageToParent() {
    this.messageToEmit.emit('true');

  }

  sendReviseMessageToParent() {
    this.revisionMessageToEmit.emit('true');
  }
  sendRecallMessageToParent() {
    this.recallMessageToEmit.emit('true');
  }

  handleOnOkButton() {
    this.dialog.closeAll();
  }

  launchXClass() {
    this.launchXClassPathNew = this.launchXClassPath;
    console.log('', this.launchXClassPathNew);
  }

  markDocumentAsObsolete() {
    this.loading = true;
    forkJoin([
      this.taskItemsListService.getTasksInUsed(this.globalContent.contentId, this.globalContent.version || this.globalContent.versionNumber),
      this.globalService.getAssetReference(this.globalContent.contentId, 'U')
    ]).subscribe(([taskList, contentList]) => {
      this.loading = false;
      if (!(taskList as any[])?.length && !(contentList as any[])?.length) {
        return this.obsoleteDocument();
      }
      const modalRef = this.dialog.open(ConfirmObsoleteDialogComponent, {
        width: '100%',
        maxWidth: '717px',
        panelClass: 'confirm-obsolete-dialog',
        data: {
          contentList,
          taskList
        },
        disableClose: true
      });
      modalRef.afterClosed().subscribe(response => {
        if (response) {
          this.obsoleteDocument();
        }
      });
    }, () => {
      this.loading = false;
    });
  }

  obsoleteDocument() {
    this.loading = true;
    this.contentListService.updatePublishedContentStatus(this.globalContent.contentId, this.globalContent.version || this.globalContent.versionNumber).subscribe(resp => {
      this.setContentToObsolete();
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  setContentToObsolete() {
    this.globalContent.assetStatusId = 3;
    this.globalContent.assetStatus = ASSET_STATUSES.OBSOLETE;
    this.globalContent.originalAssetStatus = ASSET_STATUSES.OBSOLETE;
    this.reCallManu = true;
  }
  private isStatusPublished(status) {
    return status === ASSET_STATUSES.PUBLISHED || status === ASSET_STATUSES.CURRENT;
  }

  get isPublishMode(){
    return this.globalContent?.originalAssetStatus === ASSET_STATUSES.PUBLISHED || this.globalContent?.originalAssetStatus === ASSET_STATUSES.CURRENT || this.globalContent?.originalAssetStatus === ASSET_STATUSES.OBSOLETE;
  }
}
