import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborateDialogComponent } from '@app/dashboard/content-list/collaborate-dialog/collaborate-dialog.component';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { ContentListService } from '@app/dashboard/content-list/content-list.service';
import { selectContentList } from '@app/reducers';
import { Store, select } from '@ngrx/store';
import { ContextInfo } from '../global-panel/context/context.model';
import { ContextService } from '../global-panel/context/context.service';
import { ExportComplianceComponent } from './export-compliance/export-compliance.component';
import { TopMenuActionsService } from './top-menu-actions.service';
import { GlobalService } from '../global-panel/global.service';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { TaskReducer } from '@app/task-creation/store/task.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ASSET_STATUSES, Constants } from '@environments/constants';
import { SharedService } from '@app/shared/shared.service';
import { RecordsService } from '../../records.service';
import { RecordsService1 } from '../../records1.service';
import * as ContentDataActions from '@app/dashboard/content-list/shared/content-data.actions';
import * as TodoDataActions from '@app/dashboard/todo-items-list/shared/todo-data.actions';
import { environment } from '@environments/environment';
import { BaseComponent } from '@app/shared/component/base/base.component';

@Component({
  selector: 'app-top-menu-actions',
  templateUrl: './top-menu-actions.component.html',
  styleUrls: ['./top-menu-actions.component.scss'],
})
export class TopMenuActionsComponent extends BaseComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  contentDetails: any;
  @Input() contentType: any;
  @Input() globalContent: any;
  @Input() previewMode: any;
  @Output() handlePreviewMode = new EventEmitter<string>();
  @Output() handleRequestApprovalAction = new EventEmitter<string>();
  @Output() handleApprovalAction = new EventEmitter<string>();
  @Output() handleRequestAction = new EventEmitter<string>();
  @Input() isFormDirty: boolean;
  @Input() requestApprovalOption: any;
  @Input() handleContentOwnerValue: any;
  @Input('editMode') showEditOption = true;
  document: any;
  publishPreviewMode:boolean;
  loading = false;
  requestOption = 'Request Approval';
  requestOptionInviteCoAuthor = 'Invite Co-Author';
  publishMode: Boolean = false;
  ownerEdit: boolean = false;
  optionDisable: boolean = true;
  selected = 'Send';
  checked: boolean = false;
  requestComment = '';
  placeholder = 'COMMENT HERE';
  status;
  isApprove;
  filteredCoauthor: any = [];
  coauthors: any = [];
  selectedcontentOwner: any;
  rtxId:any;
  disableSubmit: boolean = true;
  sendBackComment = '';
  EKSConentGroupControl: string;
  EKSAdminGroupControl: string;
  formDirty: boolean = false;
  parentData:any;
  editingPublishedDocument = false;
  authorGuidances = environment.authorGuidances;

  showApprovalOption: boolean = true;
  broadCastMessage1: any = 'true';
  warningTemplate: any;
  showWarningMsg: boolean = false;
  disableRequestApproval: any = false;
  displayEditBtn:boolean = false;
  displayName1 = sessionStorage.getItem('userMail');
  publishCond;
  ownerEditPreview:boolean = true;
  constructor(
    public dialog: MatDialog,
    public topMenuAction: TopMenuActionsService,
    private router: Router,
    private contentListService: ContentListService,
    private contextService: ContextService,
    private globalService: GlobalService,
    private createDocumentService: CreateDocumentService,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService,
    private rservice: RecordsService1,
    private route: ActivatedRoute,
    private store: Store,
  ) {
    super();
    this.ownerEditValue(false);
  }

  ngOnChanges(event) {
    const isOwner = this.globalContent?.contentOwnerId == this.displayName1;
    if(isOwner && this.isStatusPublished(this.globalContent.originalAssetStatus)) {
      this.ownerEdit = true;
    } else if ( this.globalContent?.originalAssetStatus == ASSET_STATUSES.DRAFT
      || (this.globalContent?.originalAssetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && isOwner) ) {
      this.ownerEditPreview = false;
    } else {
      this.ownerEdit = false;
      this.ownerEditPreview = true;
    }
    this.rservice.broadcast.subscribe(
      (broadCastMessage1) => (this.broadCastMessage1 = broadCastMessage1)
    );
    if (
      event.globalContent &&
      event.globalContent.currentValue &&
      event.globalContent.previousValue != event.globalContent.currentValue
    ) {
      if(this.route.snapshot.queryParams['status'] !== 'draft' && this.route.snapshot.queryParams['tab'] === 'Properties' && this.globalContent.contentOwnerId == this.displayName1 && this.isStatusPublished(this.globalContent.originalAssetStatus)){
        this.ownerEdit = true;
      }

      const email = sessionStorage.getItem('userMail');
      if (
        !(Object.keys(this.globalContent).length === 0) &&
        this.globalContent.id > 0
      ) {
        // console.log('  this.globalContent.version', this.globalContent.version);
        // console.log(' this.globalContent.revisionType', this.globalContent.revisionType);
        // console.log('  this.globalContent.revisionTypeId', this.globalContent.revisionTypeId);
        this.selectedcontentOwner = this.globalContent.contentOwnerId;
        if (
          (this.globalContent &&
            this.globalContent.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL) ||
          (this.globalContent.pwStatus &&
            this.globalContent.pwStatus.toLowerCase() ==
            'submitted for approval')
          //contentStatus
        ) {
          if (
            this.globalContent.contentOwnerId ==
            sessionStorage.getItem('userMail')
          ) {
            this.requestOption = 'Approve Or Send Back';
            this.showApprovalOption = true;
          } else {
            this.showApprovalOption = false;
          }
        } else if (
          this.globalContent.assetStatus === ASSET_STATUSES.DRAFT ||
          (this.globalContent.pwStatus &&
            this.globalContent.pwStatus.toLowerCase() == 'draft')
        ) {
          this.requestOption = 'Request Approval';
          this.requestOptionInviteCoAuthor = 'Invite Co-Author';
          this.showApprovalOption = true;
          console.log("disableRequestApproval", this.disableRequestApproval);
        } else {
          this.showApprovalOption = false;
        }

        //console.log('  this.globalContent', this.globalContent);
        //console.log('  this.globalContent.contentType', this.globalContent.contentType);

        if (
          this.globalContent && (this.globalContent.contentType == 'KP') &&
          this.globalContent.originalAssetStatus && (this.isStatusPublished(this.globalContent.originalAssetStatus) || this.globalContent.originalAssetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL)
        ) {
          this.publishMode = true;
        } else {
          this.publishMode = false;
        }

        if (
          this.globalContent && (this.globalContent.contentType != 'KP') &&
          this.isStatusPublished(this.globalContent.originalAssetStatus)
        ) {
          this.publishMode = true;
          this.sharedService.publishedDrag(true);
        } else {
          this.publishMode = false;
        }
        if (this.broadCastMessage1 === 'true') {
          this.showEditOption = false;
        }
        this.loading = false;
      }
    }

    // const sfStatus = sessionStorage.getItem('sfStatus');
    // if(sfStatus == 'published') {
    //   this.publishMode = true;
    // }

    // if(sfStatus == 'draft') {
    //   this.publishMode = false;
    // }

    if (
      event.isFormDirty &&
      event.isFormDirty.previousValue != event.isFormDirty.currentValue
    ) {
      this.formDirty = event.isFormDirty.currentValue;
    }

    // console.log('  this.globalContent.version', this.globalContent.version);
    // console.log('  this.globalContent.revisionType', this.globalContent.revisionType);
    // console.log('  this.globalContent.revisionTypeId', this.globalContent.revisionTypeId);
    if(this.globalContent?.version == 2 ){
      if(!this.globalContent.revisionTypeId ){
          this.disableRequestApproval = true;
      }
      if(this.globalContent.revisionTypeId ==1){
        this.disableRequestApproval = true;
      }
      if(this.globalContent.revisionTypeId >=2){
        this.disableRequestApproval = false;
      }
      if(this.globalContent.revisionTypeId !==1){
        this.disableRequestApproval = false;
      }
    }
    else{
      if (event.requestApprovalOption && event.requestApprovalOption.previousValue != event.requestApprovalOption.currentValue) {
        this.disableRequestApproval = event.requestApprovalOption.currentValue;
      }
    }

    if (this.handleContentOwnerValue) {
      if (
        this.handleContentOwnerValue.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL ||
        (this.handleContentOwnerValue.pwStatus &&
          this.handleContentOwnerValue.pwStatus.toLowerCase() ==
          'submitted for approval')
      ) {
        if (
          this.handleContentOwnerValue.contentOwnerId ==
          sessionStorage.getItem('userMail')
        ) {
          this.requestOption = 'Approve Or Send Back';
          this.showApprovalOption = true;
        } else {
          this.showApprovalOption = false;
        }
      } else if (
        this.handleContentOwnerValue.assetStatus === ASSET_STATUSES.DRAFT ||
        (this.handleContentOwnerValue.pwStatus &&
          this.handleContentOwnerValue.pwStatus.toLowerCase() == 'draft')
      ) {
        this.requestOption = 'Request Approval';
        this.requestOptionInviteCoAuthor = 'Invite Co-Author';
        this.showApprovalOption = true;
        this.disableRequestApproval = false;
      } else {
        this.showApprovalOption = false;
      }
    }

  }

  ngOnInit(): void {
    const isOwner = this.globalContent?.contentOwnerId == this.displayName1;
    if(this.isStatusPublished(this.globalContent?.originalAssetStatus)){
      this.publishCond = 'published';
      if(this.globalContent?.contentOwnerId == this.displayName1 && this.isStatusPublished(this.globalContent?.originalAssetStatus)) {
        this.ownerEdit = true;
      }
    } else if ( this.globalContent?.originalAssetStatus == ASSET_STATUSES.DRAFT
      || (this.globalContent?.originalAssetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && isOwner) ) {
      this.ownerEditPreview = false;
    } else {
      this.publishCond = 'draft';
       this.ownerEditPreview = true;
    }

    this.EKSConentGroupControl = sessionStorage.getItem(
      'EKSConentGroupControl'
    );

    this.route.params.subscribe((param) => {
      console.log("Top::::param", param);

    });

    this.EKSAdminGroupControl = sessionStorage.getItem('EKSAdminGroupControl');
    // if (this.contentType == 'DocumentView') {
    //   this.publishMode = true;
    // }
    if (this.contentType == 'DocumentView' || this.publishCond == 'published') {
      this.publishMode = true;
    }
    if(this.publishCond == 'draft'){
      this.publishMode = false;
    }
    this.contextService.getContextInfo.subscribe((context) => {
      const contextInfo = context;
      this.globalContent = contextInfo.entityInfo;
      if (this.globalContent) {
        if (
          this.globalContent.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL ||
          (this.globalContent.pwStatus &&
            this.globalContent.pwStatus.toLowerCase() ==
            'submitted for approval')
        ) {
          if (
            this.globalContent.contentOwnerId ==
            sessionStorage.getItem('userMail')
          ) {
            this.requestOption = 'Approve Or Send Back';
            this.showApprovalOption = true;
          } else {
            this.showApprovalOption = false;
          }
        } else if (
          this.globalContent.assetStatus === ASSET_STATUSES.DRAFT ||
          (this.globalContent.pwStatus &&
            this.globalContent.pwStatus.toLowerCase() == 'draft')
        ) {
          this.requestOption = 'Request Approval';
          this.requestOptionInviteCoAuthor = 'Invite Co-Author';
          this.showApprovalOption = true;
        } else {
          this.showApprovalOption = false;
        }
      }
      // if (
      //   this.globalContent &&
      //   this.globalContent.originalAssetStatusId &&
      //   this.globalContent.originalAssetStatusId == 2
      // ) {
      //   this.publishMode = true;
      // } else {
      //   this.publishMode = false;
      // }
      if (
        this.globalContent && (this.globalContent.contentType == 'KP') &&
        this.globalContent.originalAssetStatusId &&
        ( this.isStatusPublished(this.globalContent.originalAssetStatus) || this.globalContent.originalAssetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL)
      ) {
        this.publishMode = true;
      } else {
        this.publishMode = false;
      }

      if (
        this.globalContent && (this.globalContent.contentType != 'KP') &&
        this.isStatusPublished(this.globalContent.originalAssetStatus)
      ) {
        this.publishMode = true;
      } else {
        this.publishMode = false;
      }
    });
    let checkStepPreview = sessionStorage.getItem('backPriviewOn');
    const preview = this.route.snapshot.queryParams['preview'];
    this.publishPreviewMode = (!preview || preview === 'false');
    // if ( checkStepPreview == 'true' && this.globalContent.assetTypeId == 13 ) {
    //   this.publishMode = false;
    //   // this.showEditOption = false;
    //   this.publishPreviewMode = true;
    // } else if (checkStepPreview == 'false') {
    //   sessionStorage.setItem('backPriviewOn', 'false');
    // } else {
    //   sessionStorage.setItem('backPriviewOn', 'false');
    // }
    console.log('checkStepPreview', checkStepPreview);

    this.selectedcontentOwner =
        this.globalContent &&
        (this.globalContent.contentOwnerMail ||
          this.globalContent.contentOwnerId);
      this.sharedService
        .getUserProfileByEmail(
          this.selectedcontentOwner,
          Constants.apiQueryString
        )
        .subscribe(
          (userProfileData) => {
            if(this.globalContent){
              this.globalContent.Aadid = userProfileData['aadId'];
            }
            this.rtxId = userProfileData['rtxId'];
          },
          (error) => {
            console.error('There was an error!', error);
          }
        );

    this.sharedService.ownerEditBTN.pipe(
      this.unsubsribeOnDestroy
    ).subscribe(value => {
      if ( !value ) {
        this.editingPublishedDocument = false;
      }
    });
  }
  openDialog(warningTemplate) {
    if (this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
    } else {
      if (
        this.globalContent.contentType === 'Map' ||
        this.globalContent.contentType === 'M' ||
        this.globalContent.contentType === 'map' ||
        this.globalContent.contentType === 'm'
      ) {
        let urlData = this.globalContent.id.toString();
        const dialogRef = this.dialog.open(CollaborateDialogComponent, {
          width: '100%',
          maxWidth: '670px',
          data: {
            doc: {
              id: this.globalContent.id,
              title: this.globalContent.title,
              url: urlData,
              contentType: this.globalContent.contentType,
              outsourceable: this.globalContent.outsourceable,
              exportAuthorityId: this.globalContent.exportAuthorityId,
              contentData: this.globalContent,
            },
          },
          disableClose: true,
        });
      } else {
        if ( this.globalContent.assetTypeId == 13 || this.globalContent.contentTypeId == 13 ) {
          if ( this.globalContent?.contentType == 'SF' ) {
          } else {
            this.globalContent['contentType'] = 'SF';
          }
        }

        if(this.globalContent.assetTypeId == 14 || this.globalContent.contentTypeId == 14 ){
          if(this.globalContent?.contentType == "SP"){
            // console.log("Found Value");
            console.log(this.globalContent?.contentType)
          }else{
            this.globalContent['contentType'] = "SP";
            // console.log("-----------------------");
            console.log(this.globalContent?.contentType);
            // console.log("--------- ------- -----------");
          }
        }
        const dialogRef = this.dialog.open(CollaborateDialogComponent, {
          width: '100%',
          maxWidth: '670px',
          data: {
            doc: {
              id: this.globalContent.id,
              title: this.globalContent.title,
              url: this.globalContent.fileUrl,
              contentType: this.globalContent.contentType,
              outsourceable: this.globalContent.outsourceable,
              exportAuthorityId: this.globalContent.exportAuthorityId,
              contentData: this.globalContent,
            },
          },
          disableClose: true,
        });
      }
    }
  }
  onRequestApproval() {
    console.log(this.globalContent, "cccccc");
    let selectedAuthor = this.filteredCoauthor.find((data) => {
      return data.displayName == this.selectedcontentOwner;
    });
    if (selectedAuthor) {
      this.globalContent.contentOwnerId = selectedAuthor.userPrincipalName;
      this.globalContent.contentOwnerMail = selectedAuthor.userPrincipalName;
      this.globalContent.contentOwnerName = selectedAuthor.displayName;
    } else {
      this.globalContent.contentOwnerId =
        this.globalContent?.contentOwnerId ||
        this.globalContent?.contentOwnerMail; //this.selectedcontentOwner;
    }
    let userProfileDataObj = JSON.parse(sessionStorage.getItem('userData'));
    this.globalContent.userName = userProfileDataObj.displayName;
    this.filteredCoauthor = [];
    this.dialog.closeAll();
    this.loading = true;
    var pwStatus;
    if (
      this.globalContent.contentType == 'WI' ||
      this.globalContent.contentType == 'GB' ||
      this.globalContent.contentType == 'DS'
    ) {
      pwStatus = this.globalContent.pwStatus;
    } else {
      pwStatus = this.globalContent.assetStatus;
    }
    // console.log(this.globalContent, "ggggggg");
    if(this.globalContent.assetTypeId == 13 || this.globalContent.contentTypeId == 13 ){
      if(this.globalContent?.contentType == "SF"){
        // console.log("Found Value");
        console.log(this.globalContent?.contentType)
      }else{
        this.globalContent['contentType'] = "SF";
        // console.log("-----------------------");
        console.log(this.globalContent?.contentType);
        // console.log("--------- ------- -----------");
      }
    }

    if(this.globalContent.assetTypeId == 14 || this.globalContent.contentTypeId == 14 ){
      if(this.globalContent?.contentType == "SP"){
        // console.log("Found Value");
        console.log(this.globalContent?.contentType)
      }else{
        this.globalContent['contentType'] = "SP";
        // console.log("-----------------------");
        console.log(this.globalContent?.contentType);
        // console.log("--------- ------- -----------");
      }
    }
    const payload = {
      id: this.globalContent.id,
      title: this.globalContent.title,
      creatorClockId: sessionStorage.getItem('userMail'),
      // documentType:(this.globalContent.contentType) ? this.globalContent.contentType.toUpperCase():this.globalContent.contentType,
      documentType: this.globalContent.contentType.toUpperCase(),
      contentOwnerMail: this.globalContent.contentOwnerId,
      contentOwnerName: this.globalContent.contentOwnerName,
      ContentOwnerAADId: this.globalContent.Aadid
        ? this.globalContent.Aadid
        : '',
      userName: this.globalContent.userName,
      pwStatus: pwStatus,
      docUrl: this.globalContent.sourceDocUrl
        ? this.globalContent.sourceDocUrl
        : sessionStorage.getItem('docUrl')
          ? sessionStorage.getItem('docUrl')
          : '',
      comments: this.requestComment,
      rtxId: this.rtxId,
    };
    this.contentListService.requestApproval(payload).subscribe(
      (data) => {
        if (data['Status'] == 'Sent') {
          this.globalContent.assetStatusId = 3;
          this.globalContent.assetStatus = ASSET_STATUSES.SUBMITTED_FOR_APPROVAL;
        }
        if (
          (this.globalContent &&
            //(this.globalContent.contentOwnerId == email) &&
            this.globalContent.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL) ||
          (this.globalContent.pwStatus &&
            this.globalContent.pwStatus.toLowerCase() ==
            'submitted for approval')
          //contentStatus
        ) {
          if (
            this.globalContent.contentOwnerId ==
            sessionStorage.getItem('userMail')
          ) {
            this.requestOption = 'Approve Or Send Back';
            this.showApprovalOption = true;
          } else {
            this.showApprovalOption = false;
          }
        } else if (
          this.globalContent.assetStatus === ASSET_STATUSES.DRAFT ||
          (this.globalContent.pwStatus &&
            this.globalContent.pwStatus.toLowerCase() == 'draft')
        ) {
          this.requestOption = 'Request Approval';
          this.requestOptionInviteCoAuthor = 'Invite Co-Author';
          this.showApprovalOption = true;
        } else {
          this.showApprovalOption = false;
        }
        this.handleRequestAction.emit(this.globalContent.contentOwnerId);
        this.loading = false;
        this._snackBar.open("'Your Approval Submitted Successfully!'", 'x', {
          duration: 5000,
        });
        this.store.dispatch(ContentDataActions.resetContentData());
        this.router.navigate(['/dashboard']);
        return true;
      },
      (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        this._snackBar.open("'Error In Submitting For Approval!", 'x', {
          duration: 5000,
        });
        return false;
      }
    );
  }
  onExportComplianceClick(warningTemplate) {
    if (this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
    } else {
      const exportDialog = this.dialog.open(ExportComplianceComponent, {
        width: '60%',
      });
    }
  }
  ownerEditValue(value){
    this.sharedService.ownerCanEdit(value);
    this.editingPublishedDocument = value;
  }

  showPreviewMode(value, warningTemplate) {
    if (this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
    } else {
      this.showEditOption = value && value == true ? true : false;
      if (value == false) {
        sessionStorage.setItem('backPriviewOn', 'false');
        console.log("sessionStorage.setItem('backPriviewOn', 'false')");
      }
      this.handlePreviewMode.emit(value);
    }
  }
  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }
  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = this.globalContent;
    contextInfo.entityId = this.globalContent.id;
    return contextInfo;
  }
  openModal(mytemplate, warningTemplate) {
    if (this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
    } else {
      this.showWarningMsg = (this.globalContent.revisionTypeId == 2);
      let dialogRef = this.dialog.open(mytemplate, {
        width: '450px',
        height: '450px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }
  handleOnCheckBoxChange(value) {
    this.optionDisable = value.checked ? false : true;
    this.checked = value.checked;
  }
  handleOnMatSelect(value) {
    if (value == 'Approve') {
      if(this.globalContent.revisionTypeId == 2) {
        this.optionDisable = this.checked ? false : true;
      } else {
        this.optionDisable = false;
      }
    }
    if (value == 'Send Back') {
      this.optionDisable = true;
    }
    if (value == 'Send') {
      this.optionDisable = true;
    }
  }
  handleOnRequestApproval(value, mytemplate) {

    console.log(this.globalContent, "handleRRR");
    if(this.globalContent.assetTypeId == 13 || this.globalContent.contentTypeId == 13 ){
      if(this.globalContent?.contentType == "SF"){
        console.log("Found Value this.globalContent.assetTypeId");
        console.log(this.globalContent?.contentType)
      }else{
        this.globalContent['contentType'] = "SF";
        console.log("-----------------------RRRRRR");
        console.log(this.globalContent?.contentType);
        console.log("--------- ------- -----------RRRRR");
      }
    }
    if(this.globalContent.assetTypeId == 14 || this.globalContent.contentTypeId == 14 ){
      if(this.globalContent?.contentType == "SP"){
        // console.log("Found Value this.globalContent.assetTypeId");
        console.log(this.globalContent?.contentType)
      }else{
        this.globalContent['contentType'] = "SP";
        // console.log("-----------------------RRRRRR");
        console.log(this.globalContent?.contentType);
        // console.log("--------- ------- -----------RRRRR");
      }
    }

    const payload = {
      resourceType: this.globalContent.contentType.toUpperCase() || '',
      resourceId: this.globalContent.id || '',
      user: this.globalContent.createdUser || '',
      comments: this.sendBackComment,

      parentId: 0,
      status: 'Open',
      createdOn: this.globalContent.createdDateTime || '',
      creatorClockId: this.globalContent.createdUser || '',
      assetStatusId: this.globalContent.assetStatusId || 0,
      version: this.globalContent.versionNumber || '',
      aadid: sessionStorage.getItem('AADid')
        ? sessionStorage.getItem('AADid')
        : '',
        rtxId: this.rtxId,
    };
    if (value == 'Approve') {
      this.isApprove = true;
      this.loading = true;
      this.dialog.closeAll();
      this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe(
        (res) => {
          //  console.log('res "ProcessInst Id is not matched!"',res);
          //   this.isApprove = false;
          //   this.loading = false;
          //   this._snackBar.open("'Approved Successfully!'", 'x', {
          //     duration: 5000,
          //   });
          //   this.router.navigate(['/dashboard']);
          //  // this.handleApprovalAction.emit('approve');
          if (res == 'ProcessInst Id is not matched!') {
            this.isApprove = false;
            this.loading = false;
            this._snackBar.open(
              "'System Error, Please contact EKS System Admin Team'",
              'x',
              {
                duration: 5000,
              }
            );
            this.router.navigate(['/dashboard']);
            // this.handleApprovalAction.emit('approve');
          } else {
            this.isApprove = false;
            this.loading = false;
            this._snackBar.open("'Approved Successfully!'", 'x', {
              duration: 5000,
            });
            this.store.dispatch(ContentDataActions.resetContentData());
            this.store.dispatch(TodoDataActions.resetTodoData());
            this.router.navigate(['/dashboard']);
            // this.handleApprovalAction.emit('approve');
          }
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
          this.isApprove = false;
        }
      );
    } else if (value == 'Send Back') {
      this.isApprove = false;
      this.loading = true;
      this.dialog.closeAll();
      this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe(
        (res) => {
          // this.handleApprovalAction.emit(value);
          this.loading = false;
          this.store.dispatch(ContentDataActions.resetContentData());
          this.store.dispatch(TodoDataActions.resetTodoData());
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
    }
  }
  onCloseButtonClick() {
    this.dialog.closeAll();
    this.filteredCoauthor = [];
    this.requestComment = '';
    this.sendBackComment = '';
    this.checked = false;
    this.selected = 'Send';
    this.optionDisable = true;
  }
  openRequestModal(requestApprovalTemplate, warningTemplate) {
    if (this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
    } else {
      this.selectedcontentOwner =
        this.globalContent &&
        (this.globalContent.contentOwnerMail ||
          this.globalContent.contentOwnerId);
      this.disableSubmit = this.selectedcontentOwner ? false : true;
      this.requestComment = '';
      this.sendBackComment = '';
      this.sharedService
        .getUserProfileByEmail(
          this.selectedcontentOwner,
          Constants.apiQueryString
        )
        .subscribe(
          (userProfileData) => {
            this.globalContent.contentOwnerName =
              userProfileData['displayName'];
            this.globalContent.Aadid = userProfileData['aadId'];
            this.selectedcontentOwner = userProfileData['displayName'];
            this.rtxId = userProfileData['rtxId'];
          },
          (error) => {
            console.error('There was an error!', error);
          }
        );
      let dialogRef = this.dialog.open(requestApprovalTemplate, {
        width: '450px',
        height: '470px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }
  filterCoauthor(name) {
    if (name && name.length == 3) {
      this.createDocumentService
        .retrieveCoauthor(name)
        .subscribe((response) => {
          this.filteredCoauthor = response['value'];
          this.disableSubmit = this.filteredCoauthor.length == 0;
        });
    } else if (name.length == 0) {
      this.filteredCoauthor = [];
      this.disableSubmit = true;
    }
  }
  handleCommentChange(value) {
    this.optionDisable = value == '';
    this.sendBackComment = value;
  }
  handleOnOkButton() {
    this.dialog.closeAll();
  }

  private isStatusPublished(status) {
    return status === ASSET_STATUSES.PUBLISHED || status === ASSET_STATUSES.CURRENT;
  }

  get isPublishMode(){
    return this.globalContent?.originalAssetStatus === ASSET_STATUSES.PUBLISHED || this.globalContent?.originalAssetStatus === ASSET_STATUSES.CURRENT || this.globalContent?.originalAssetStatus === ASSET_STATUSES.OBSOLETE;
  }
}
