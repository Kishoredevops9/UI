import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CollaborateDialogComponent } from '@app/dashboard/content-list/collaborate-dialog/collaborate-dialog.component';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { ContentListService } from '@app/dashboard/content-list/content-list.service';
import { selectContentList } from '@app/reducers';
import { Store, select } from '@ngrx/store';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ExportComplianceComponent } from '@app/shared/component/top-menu-actions/export-compliance/export-compliance.component';
import { TopMenuActionsService } from '@app/shared/component/top-menu-actions/top-menu-actions.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { TaskReducer } from '@app/task-creation/store/task.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-step-export-compliance',
  templateUrl: './step-export-compliance.component.html',
  styleUrls: ['./step-export-compliance.component.scss']
})
export class StepExportComplianceComponent implements OnInit {
  contentDetails: any;
  @Input() contentType: any;
  @Input() globalContent: any;
  @Input() isFormDirty: boolean;
  document: any;
  showEditOption = false;
  loading = false;
  requestOption = 'Request Approval';
  requestOptionInviteCoAuthor = 'Invite Co-Author';
  publishMode: Boolean = false;
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
  disableSubmit: boolean = true;
  sendBackComment = '';
  EKSConentGroupControl: string;
	EKSAdminGroupControl: string;
  formDirty: boolean = false;
  constructor(
    public dialog: MatDialog,
    public topMenuAction: TopMenuActionsService,
    private router: Router,
    private contentListService: ContentListService,
    private contextService: ContextService,
    private globalService: GlobalService,
    private createDocumentService: CreateDocumentService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnChanges(event) {
    if (
      event.globalContent &&
      event.globalContent.currentValue &&
      event.globalContent.previousValue != event.globalContent.currentValue
    ) {
      const email = sessionStorage.getItem('userMail');
      if (
        !(Object.keys(this.globalContent).length === 0) &&
        this.globalContent.id > 0
      ) {
        const contentStatus = (this.globalContent.originalAssetStatusId == 3 || (this.globalContent.pwStatus && this.globalContent.pwStatus.toLowerCase() == "submitted for approval"));
        if (
          (this.globalContent &&this.globalContent.pwStatus
          //this.globalContent.contentOwnerId == email && 
          (this.globalContent.assetStatusId == 3)) || (this.globalContent.pwStatus &&  ( this.globalContent && this.globalContent.pwStatus &&  this.globalContent.pwStatus.toLowerCase() == "submitted for approval"))
          //contentStatus
        ) {
          this.requestOption = 'Approve Or Send Back';
        } else  {
          this.requestOption = 'Request Approval';
          this.requestOptionInviteCoAuthor = 'Invite Co-Author';
        }
        if (this.globalContent && this.globalContent.originalAssetStatusId && this.globalContent.originalAssetStatusId == 2) {
          this.publishMode = true;
        } else {
          this.publishMode = false
        }
        this.loading = false;
      }
    }
    if(event.isFormDirty &&  event.isFormDirty.previousValue != event.isFormDirty.currentValue) {
      this.formDirty = event.isFormDirty.currentValue;
    }
  }

  ngOnInit(): void {
    this.EKSConentGroupControl = sessionStorage.getItem('EKSConentGroupControl');
    this.EKSAdminGroupControl = sessionStorage.getItem('EKSAdminGroupControl');    
    if (this.contentType == 'DocumentView') {
      this.publishMode = true;
    }
    this.contextService.getContextInfo.subscribe((context) => {
      const contextInfo = context;
      this.globalContent = contextInfo.entityInfo;

      if (this.globalContent) {
        if (( this.globalContent.assetStatusId == 3 ) || (this.globalContent.pwStatus && this.globalContent.pwStatus.toLowerCase() == "submitted for approval")){
          this.requestOption = 'Approve Or Send Back';
        } else  {
          this.requestOption = 'Request Approval';
          this.requestOptionInviteCoAuthor = 'Invite Co-Author';
        }


      }
      if(this.globalContent && this.globalContent.originalAssetStatusId && this.globalContent.originalAssetStatusId == 2) {
      this.publishMode = true;
    } else {
      this.publishMode = false;
    }
    });
  }
  openDialog(warningTemplate) {
    if(this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
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
              contentData: this.globalContent
            },
          },
          disableClose: true
        });
      } else {
        //console.log("this.globalContent Top Menu",this.globalContent);
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
              contentData: this.globalContent
            },
          },
          disableClose: true
        });
      }
    }
  }
  onRequestApproval() {
    let selectedAuthor = this.filteredCoauthor.find((data) => {
      return (data.displayName == this.selectedcontentOwner);
    })
    if(selectedAuthor) {
      this.globalContent.contentOwnerId = selectedAuthor.userPrincipalName
    } else {
      this.globalContent.contentOwnerId =  (this.globalContent.contentOwnerId || this.globalContent.contentOwnerMail); //this.selectedcontentOwner;
    }
    this.filteredCoauthor = [];
    this.dialog.closeAll();
    this.loading = true;
    var pwStatus;
      if(this.globalContent.contentType == 'WI' || this.globalContent.contentType == 'GB' || this.globalContent.contentType == 'DS') {
        pwStatus = this.globalContent.pwStatus;
      } else  {
        pwStatus =  this.globalContent.assetStatusId == 1 ? 'Draft' : this.globalContent.assetStatusId == 2 ? 'Published' : this.globalContent.assetStatusId == 3 ? 'Submitted for Approval' : 'Approved, Waiting for J&C';
      }
      const payload = { 
        id: this.globalContent.id,
        title: this.globalContent.title,
        creatorClockId: this.globalContent.createdUser,
        documentType: this.globalContent.contentType.toUpperCase(),
        contentOwnerMail: this.globalContent.contentOwnerId,
        pwStatus: pwStatus,
        docUrl: sessionStorage.getItem('docUrl'),
        comments: this.requestComment
      }
      this.contentListService.requestApproval(payload).subscribe(
        (data) => {
          if(data['Status'] == "Sent") {
          this.globalContent.assetStatusId = 3;
          }
          const email = sessionStorage.getItem('userMail');
          const contentStatus = (this.globalContent.assetStatusId == 3 || this.globalContent.pwStatus == "Submitted for Approval");
          if((this.globalContent && 
            //(this.globalContent.contentOwnerId == email) &&
             (this.globalContent.assetStatusId == 3)) || (this.globalContent.pwStatus.toLowerCase() == "submitted for approval")
          //contentStatus
          ) {
            this.requestOption = 'Approve Or Send Back';
          } else  {
            this.requestOption = 'Request Approval';
            this.requestOptionInviteCoAuthor = 'Invite Co-Author';
          }
          // this.handleRequestAction.emit(this.globalContent.contentOwnerId);
          this.loading = false;
          this._snackBar.open("'Your Approval Submitted Successfully!", 'x', {
            duration: 5000,
          });
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
      ),
      (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        this._snackBar.open("'Error In Submitting For Approval!", 'x', {
          duration: 5000,
        });
        return false;
      };
  }
  onExportComplianceClick(warningTemplate) {
    if(this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      const exportDialog = this.dialog.open(ExportComplianceComponent, {
        width: '60%',
        height: '90%',
      });
    }
  }
  showPreviewMode(value,warningTemplate) {
    if(this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      this.showEditOption = value;
      // this.handlePreviewMode.emit(value);
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
  openModal(mytemplate,warningTemplate) {
    if(this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      let dialogRef = this.dialog.open(mytemplate, {
        width: '450px',
        height: '450px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
  handleOnCheckBoxChange(value) {
    this.optionDisable = value.checked ? false : true;
    this.checked = value.checked;
  }
  handleOnMatSelect(value) {
    if(value == "Approve") {
      this.optionDisable = this.checked ? false : true;
    }
    if(value == "Send Back") {
      this.optionDisable = true;
    }
    if(value == "Send") {
      this.optionDisable = true;
    }
  }
  handleOnRequestApproval(value,mytemplate) {
    const payload = { 
      resourceType: this.globalContent.contentType.toUpperCase() || '',
      resourceId: this.globalContent.id || '',
      user: this.globalContent.createdUser || '',
      comments: this.sendBackComment,
      parentId: 0,
      status: "Open",
      createdOn: this.globalContent.createdDateTime || '',
      creatorClockId: this.globalContent.createdUser || '',
      assetStatusId: this.globalContent.assetStatusId || 0,
      version: this.globalContent.version || ''
    }
  if(value == 'Approve') {
   this.isApprove = true;
   this.loading = true;
   this.dialog.closeAll();
   this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe((res) => {
    this.isApprove = false;
    this.loading = false;
    // this.handleApprovalAction.emit('approve');
   },(error) => {
   console.error('There was an error!', error);
   this.loading = false;
   this.isApprove = false;
 })
}else if(value == 'Send Back') {
  this.isApprove = false;
  this.loading = true;
  this.dialog.closeAll();
  this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe((res) => {
   // this.handleApprovalAction.emit(value);
    this.loading = false;
},(error) => {
  console.error('There was an error!', error);
  this.loading = false;
})
}
  }
  onCloseButtonClick () {
    this.dialog.closeAll();
    this.filteredCoauthor = [];
    this.requestComment = '';
    this.sendBackComment = '';
    this.checked = false;
    this.selected = 'Send';
    this.optionDisable = true;
  }
  openRequestModal(requestApprovalTemplate,warningTemplate) {
    if(this.formDirty) {
      const dialogRef = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      this.selectedcontentOwner = this.globalContent && (this.globalContent.contentOwnerMail || this.globalContent.contentOwnerId);
      this.disableSubmit = this.selectedcontentOwner ? false : true;
      this.requestComment = '';
      this.sendBackComment = '';
      let dialogRef = this.dialog.open(requestApprovalTemplate, {
        width: '450px',
        height: '470px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
  filterCoauthor(name) {
    if (name && name.length == 3) {
      this.createDocumentService.retrieveCoauthor(name).subscribe((response) => {
        this.filteredCoauthor = response['value'];
        this.disableSubmit = this.filteredCoauthor.length == 0;
      });
     } else if (name.length == 0) {
      this.filteredCoauthor = [];
      this.disableSubmit = true;
     }
  }
  handleCommentChange(value) {
    this.optionDisable = (value == '');
    this.sendBackComment = value;
  }
  handleOnOkButton () {
    this.dialog.closeAll();
  }
}

