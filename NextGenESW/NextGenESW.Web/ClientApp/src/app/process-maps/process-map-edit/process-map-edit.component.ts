import * as go from 'gojs';
import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { PersistanceService } from '@app/shared/persistance.service';

import { CollaborateDialogComponent } from '../../dashboard/content-list/collaborate-dialog/collaborate-dialog.component';
import { GroupModifyComponent } from './../group-modify/group-modify.component';
import { ActivityAddComponent } from '../activity-add/activity-add.component';
import { PhaseAddComponent } from '../phase-add/phase-add.component';
import { AddConnectorComponent } from '../add-connector/add-connector.component';
import { SharedService } from '../../shared/shared.service';
import { ProcessMapsService } from '../process-maps.service';
import { ProcessMapsState } from '../process-maps.reducer';
import * as ProcessMapsActions from '../process-maps.actions';
import { ProcessMapEditDataService } from './services/process-map-edit-data.service';
import { ProcessMap } from '../process-maps.model';
import { DiagramDialogBoxService } from '../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { ProcessMapEditDialogService } from './services/process-map-edit-dialog.service';
import { DiagramHttpService } from '../../diagram-gojs/components/diagram/services/diagram-http.service';
import { ProcessMapEditHttpService } from './services/process-map-edit-http.service';
import { PROCESS_MAP_EDIT_PALETTE_ITEMS } from './process-map-edit.consts';
import { ContentListService } from '../../dashboard/content-list/content-list.service';
import { GlobalService } from '../../shared/component/global-panel/global.service';
import { DiagramConfiguration } from '../../diagram-gojs/components/diagram/diagram.types';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import * as ContentDataActions from '@app/dashboard/content-list/shared/content-data.actions';
import { ASSET_STATUSES } from '@environments/constants';

@Component({
  selector: 'app-process-map-edit',
  templateUrl: './process-map-edit.component.html',
  styleUrls: ['./process-map-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DiagramDialogBoxService,
      useClass: ProcessMapEditDialogService
    },
    {
      provide: DiagramHttpService,
      useClass: ProcessMapEditHttpService
    }
  ]
})
export class ProcessMapEditComponent implements OnInit, OnDestroy {
  constructor(
    private dataService: ProcessMapEditDataService,
    private store: Store<ProcessMapsState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService,
    private processMapsService: ProcessMapsService,
    private activityPageService: ActivityPageService,
    private profileData: PersistanceService,
    private contentListService: ContentListService,
    private globalService: GlobalService,
    private createDocumentService: CreateDocumentService,
  ) { }
  ASSET_STATUSES = ASSET_STATUSES;
  processMapId: number;
  processMap: ProcessMap;
  paletteItems = PROCESS_MAP_EDIT_PALETTE_ITEMS;
  diagramConfiguration: DiagramConfiguration = {
    viewOnly: true
  };

  nodes: Array<go.ObjectData>;
  lanes: Array<go.ObjectData>;

  showTreeMapView = true;
  saveAsBTN = false;
  activityDetailID: Number;
  selectedShapeData: any;
  model: any = [];
  milestoneActvities: any = [];
  shapeData: any;
  selectedActivityId: number;
  processMapMetaData: any = [];
  initialViewRender = true;
  draftMap :boolean = false;
  publishedMap:boolean = false;
  submittedForApproval:boolean = false;

  // CheckIn and CheckOut Maps
  checkOut: any;
  IsCheckOut = false;
  disableForm = false;
  contentCollaboration;
  userMail;
  showCheckBtns = true;
  contentType: string = 'M';

  private onDestroy$ = new Subject<void>();

  setMilestoneId($event) {
    this.activityDetailID = $event;
  }

  setShapeData($event) {
    this.selectedShapeData = $event;
  }

  // When a milestone is selected on the diagram, the event triggers this method that lowers the opacity of everything excepts the nodes
  // belonging to selected milestone
  matchMilestone(id) {
    // this.myDiagramComponent.diagram.commit((d) => {
    //   d.nodes.each((node) => {
    //     if (node.data.activityTypeId == 4) {
    //       const activityId = node.data.key.replace('activity-', '');
    //       if (activityId == id) {
    //         node.opacity = 1;
    //       }
    //     } else {
    //       if (node.data.milestoneId == id) {
    //         node.opacity = 1;
    //       }
    //     }
    //   });
    // }, 'changed opacity');
  }

  ngOnInit(): void {
    this.subscribeUrlParameters();
    this.subscribeProcessMapStore();
    this.subscribeCollaborationServices();
    this.sharedService.setSaveASMapData(this.processMap);
    console.log('Hello', this.processMap);
  }

  private subscribeUrlParameters() {
    this.route.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        const id = params.get('id');
        this.processMapId = parseInt(id, 10);
      });
  }

  private subscribeProcessMapStore() {
    this.dataService.getLoadedProcessMap()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((processMap) => {
        this.processMap = processMap;
        this.model = this.processMap;
        this.globalContent = this.processMap;
        this.assetStatusUpdate();
      });
    this.dataService.getIsPublishedMap()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((published) => {
        this.diagramConfiguration = {
          ...this.diagramConfiguration,
          viewOnly: published
        }
      });
  }

  private subscribeCollaborationServices() {
    this.profileData.currentProfile.subscribe((data) => {
      this.userMail = data.mail;
      this.contentCollaboration = {
        'contentCollaboration': {
          'resourceType': 'M',
          'resourceId': this.processMapId.toString(),
          'checkedOutOn': new Date(),
          'checkedOutBy': this.userMail
        },
        'contentCollaborationHistory': {
          'resourceType': 'M',
          'resourceId': this.processMapId.toString(),
          'checkedOutOn': new Date(),
          'checkedOutBy': this.userMail
        }
      };
    });
    // this.getContentCollaboration();
  }

  // #region SharedCodeToBeMovedToService

  // TODO: This functionality should be handled by a service
  // Opens the add Activity Dialog
  onAddActivity(arg) {
    this.route.params.subscribe(params => {
      this.processMapsService.getProcessMap(params['id']).subscribe((data) => {
        const Mdl = { ...data };
        const Edit = arg;
        const EditMap = arg.detail;
        Mdl['cid'] = arg.cid;
        const dialogRef = this.dialog.open(ActivityAddComponent, {
          width: '35%',
          data: {
            editShapedata: Edit,
            model: Mdl,
            processMapId: this.processMapId,
            milestoneActvities: this.milestoneActvities,
            editShapeMap: EditMap
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            if (result.id != null && result.id != '') {
              this.store.dispatch(
                ProcessMapsActions.editActivity({
                  activity: result
                })
              );
            } else {
              delete result.id;
              this.store.dispatch(
                ProcessMapsActions.addActivity({
                  mapId: this.processMapId,
                  activity: result,
                })
              );
            }
            // relayoutLanes();
            // setTimeout(() => {
            //   relayoutLanes();
            // }, 300);
            // relayoutDiagram;
          }
        });

      });

    });
  }

  // TODO: This functionality should be handled by a service
  // add Phase
  onAddPhase() {
    this.route.params.subscribe(params => {
      const dialogRef = this.dialog.open(PhaseAddComponent, {
        width: '35%',
        data: {},
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.processMapsService.createProcessMapPhase(result)
          .subscribe((data) => this.store.dispatch(
            ProcessMapsActions.addPhase({ phase: data})
          ));
      });
    });
  }

    // add Connection
    onAddConnection() {
      this.route.params.subscribe(params => {
        const dialogRef = this.dialog.open(AddConnectorComponent, {
          width: '35%',
          data: {},
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            delete result.id;
            this.store.dispatch(
              ProcessMapsActions.addActivity({
                mapId: this.processMapId,
                activity: result,
              })
            );
            // relayoutLanes();
            // setTimeout(() => {
            //   relayoutLanes();
            // }, 300);
            // relayoutDiagram;
          }
        });
      });
    }

  // TODO: This functionality should be handled by a service
  // Export XLS
  onExportXls() {
    let urlLocation = window.location.href;
   let url = urlLocation.substr(0, urlLocation.lastIndexOf("/SF") + 1);
    this.route.params.subscribe(params => {
        this.processMapsService.getExportXls(params['id'],url)
        .subscribe((resultBlob: Blob) => {
          const downloadURL = URL.createObjectURL(resultBlob);
          window.open(downloadURL);
        });
    });
  }

  // TODO: This functionality should be handled by a service
  // Opens the modify Group dialog
  public onSwimlaneInsert() {
    const dialogRef = this.dialog.open(GroupModifyComponent, {
      width: '35%',
      data: {
        model: this.model,
        processMapId: this.processMapId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(ProcessMapsActions.addGroup({
        mapId: this.processMapId,
        activityGroup: {
          ...result,
          sequenceNumber: this.processMap.swimLanes.length
        },
      }));
    });
  }

  // TODO: This functionality should be handled by a service
  // WHEN: selection on tree changes, reflect in diagram
  onSelectionChanged(e) {
    // if (e) {
    //   this.myDiagramComponent.diagram.select(
    //     this.myDiagramComponent.diagram.findNodeForKey('activity-' + e)
    //   );
    // } else {
    //   this.myDiagramComponent.diagram.clearSelection();
    // }
  }

  // #endregion SharedCodeToBeMovedToService

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // #region Collaboration

  addContentCollaboration(type) {
    if (type === 'checkin') {
      if (this.checkOut.contentCollaborationHistory == null) {
        this.checkOut.contentCollaborationHistory = {
          'resourceType': 'M',
          'resourceId': this.processMapId.toString(),
          'checkedOutOn': new Date(),
          'checkedOutBy': this.userMail
        };
      }
      this.checkOut.contentCollaborationHistory.checkedInOn = new Date();
      this.activityPageService.updateContentCollaboration(JSON.stringify(this.checkOut)).subscribe((data) => {
        let res = JSON.parse(JSON.stringify(data));

        if (res == null || data == null) {
          res = {
            validationMessage: undefined
          };
        }

        if (res.validationMessage != '') {
          this._snackBar.open('\'Successfully check in the changes!\'', 'x', {
            duration: 5000,
          });
          this.IsCheckOut = false;
          this.disableForm = true;
        } else {
          this.IsCheckOut = true;
          this.disableForm = false;
        }
      });
    } else {
      this.activityPageService.addContentCollaboration(JSON.stringify(this.contentCollaboration)).subscribe((data) => {
        const res = JSON.parse(JSON.stringify(data));
        this.checkOut = data;
        if (res.validationMessage != '') {
          this._snackBar.open('\'' + res.validationMessage + '\'', 'x', {
            duration: 5000,
          });
          this.IsCheckOut = false;
          this.disableForm = true;
        } else {
          this.IsCheckOut = true;
          this.disableForm = false;
        }

      });
    }
  }

  // getContentCollaboration() {
  //   this.showCheckBtns = true;
  //   this.activityPageService.getContentCollaboration(JSON.stringify(this.contentCollaboration)).subscribe((data) => {
  //     const res = JSON.parse(JSON.stringify(data));
  //     this.checkOut = data;
  //     if (res.contentCollaboration != null && res.validationMessage != null) {
  //       this._snackBar.open('\'' + res.validationMessage + '\'', 'x', {
  //         duration: 5000,
  //       });
  //       this.IsCheckOut = false;
  //       this.disableForm = true;
  //       if (res.contentCollaboration.checkedOutBy == this.userMail) {
  //         this.IsCheckOut = true;
  //       }
  //     } else if (res.contentCollaboration != null && res.validationMessage == null) {
  //       this.IsCheckOut = true;
  //       this.disableForm = false;
  //     } else {
  //       this.showCheckBtns = false;
  //       this.IsCheckOut = false;
  //       this.disableForm = true;
  //     }
  //   });
  // }

  onCollaborate() {
    this.openCoAuthorDialog();
  }

  openCoAuthorDialog() {
    const urlValue = this.model.id.toString();
    console.log(urlValue);
    const dialogRef = this.dialog.open(CollaborateDialogComponent, {
      width: '100%',
      maxWidth: '670px',
      data: {
        doc: { id: this.model.id, title: this.model.title, url: urlValue, contentType: 'M', contentTypeId: 4, contentData: this.model }
      },
    });
  }

  goToProperties() {
    this.sharedService.SaveASMapData=null;
    this.sharedService.setExistingMapData(this.model);
    this.router.navigate(['/process-maps/create-progressmap/', this.model.id]);
  }

  goToCreateProgressmap() {
    this.sharedService.setSaveASMapData(this.model);
    this.router.navigate(['/process-maps/create-progressmap/', this.model.id]);
  }

  // #endregion Collaboration

  //Edit Swimlane
  editMapSwimlane(swimlaneDetails){
    console.log("inside Edit Map Swimlane"+swimlaneDetails);
    console.log(swimlaneDetails);

    const dialogRefOnEdit = this.dialog.open(GroupModifyComponent, {
      width: '35%',
      data: {
        model: this.model,
        processMapId: this.processMapId,
        swimlaneData: swimlaneDetails,
        name: swimlaneDetails.name
      },
    });

    dialogRefOnEdit.afterClosed().subscribe((result) => {
      console.log(result);
      const activityGroupData = {
        id: swimlaneDetails.id,
        processMapId: this.processMapId,
        name: result.name,
        backgroundColor: result.backgroundColor,
        borderColor: result.borderColor,
        borderStyle: result.borderStyle,
        borderWidth: result.borderWidth,
        description: result.description,
        sequenceNumber: swimlaneDetails.sequenceNumber
      }

      this.processMapsService.updateMapGroup(activityGroupData).subscribe(
        (data) => {
          console.log(data);

        }
      );

    });
  }

  //Request For Approval (Workflow)
  requestForApproval(element) {
    console.log("requestForApproval()");
    console.log(element);
    console.log("requestForApproval()");
    let statusData;
    if(element.assetStatus == ASSET_STATUSES.DRAFT ){
      statusData = "Draft";
    }
    if(element){
      console.log("IF Inside Loop");
      let approvalElement = {
        id: element.id,
        contentId: element.contentId,
        docUrl: "",
        title: element.title,
        baer: "",
        comments: "",
        file: "",
        outsourceable: element.outsourceable,
        serverRedirectedEmbedUrl: "",
        fileLeafRef: "",
        documentType: "M",
        jc: "",
        pwStatus: statusData,
        modified: element.lastUpdateDateTime,
        creatorClockId: element.createdUser,
        contentOwnerMail: element.contentOwnerId
      }

      this.contentListService.requestApproval(approvalElement).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
    }
  }

  // Approve or Sendback (Workflow)
  optionDisable: boolean = true;
  checked: boolean = false;
  selected = 'Send';
  placeholder = 'COMMENT HERE';
  comment = '';
  isApprove;
  isStatusDraft: boolean = false;
  isStatusApproveOrReject: boolean = false;
  currentUserEmail = sessionStorage.getItem('userMail');



  assetStatusUpdate(){
    console.log(this.processMap);
    console.log(this.currentUserEmail);
    console.log(this.processMap.contentOwnerId);

    if(this.processMap.assetStatus == ASSET_STATUSES.DRAFT){
      this.isStatusDraft = true;
      this.isStatusApproveOrReject = false;
    }

    if(this.processMap.assetStatus == ASSET_STATUSES.APPROVED_WAITING_FOR_JC){
      this.isStatusDraft = false;
      if(this.currentUserEmail == this.processMap.contentOwnerId){
        console.log("Mail id matches");
        this.isStatusApproveOrReject = true;
      }
    }

    if(this.processMap.assetStatus == ASSET_STATUSES.PUBLISHED || this.processMap.assetStatus == ASSET_STATUSES.CURRENT){
      this.isStatusDraft = false;
      this.isStatusApproveOrReject = false;
    }

  }


  // Workflow Part (Ask for Approval & Approve/Reject)

  filteredCoauthor: any = [];
  coauthors: any = [];
  selectedcontentOwner: any;
  disableSubmit: boolean = true;
  sendBackComment = '';
  globalContent: any;
  requestOption;
  loading;
  requestComment;
  // Emit Values
  handleRequestAction;
  handleApprovalAction;

  onRequestApproval() {
    console.log(this.globalContent);
    let selectedAuthor = this.filteredCoauthor.find((data) => {
      return (data.displayName == this.selectedcontentOwner);
    })
    if(selectedAuthor) {
      //this.globalContent.contentOwnerId = selectedAuthor.userPrincipalName
    } else {
      //this.globalContent.contentOwnerId =  (this.globalContent.contentOwnerId || this.globalContent.contentOwnerMail); //this.selectedcontentOwner;
      // this.globalContent['contentOwnerId'] =  (this.globalContent['contentOwnerId'] || this.globalContent['contentOwnerMail']); //this.selectedcontentOwner;
    }
    this.filteredCoauthor = [];
    this.dialog.closeAll();
    this.loading = true;
    var pwStatus;
      if(this.globalContent.contentType == 'WI' || this.globalContent.contentType == 'GB' || this.globalContent.contentType == 'DS') {
        pwStatus = this.globalContent.pwStatus;
      } else  {
        pwStatus =  this.globalContent.assetStatus == ASSET_STATUSES.DRAFT ? 'Draft' : (this.globalContent.assetStatus == ASSET_STATUSES.PUBLISHED || this.globalContent.assetStatus == ASSET_STATUSES.CURRENT ) ? 'Published' : this.globalContent.assetStatus ==  ASSET_STATUSES.SUBMITTED_FOR_APPROVAL? 'Submitted for Approval' : 'Approved, Waiting for J&C';
      }
      const payload = {
        id: this.globalContent.id,
        title: this.globalContent.title,
        creatorClockId: this.globalContent.createdUser,
        // documentType: this.globalContent.contentType.toUpperCase(),
        documentType: 'M',
        contentOwnerMail: this.globalContent.contentOwnerId,
        pwStatus: pwStatus,
        docUrl: '',
        comments: this.requestComment
      }
      console.log(payload);
      this.contentListService.requestApproval(payload).subscribe(
        (data) => {
          console.log(data);
          if(data){
            console.log("Before LOads");
            this.store.dispatch(ContentDataActions.resetContentData());
            this.router.navigate(['/dashboard']);
          }

        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }

  openModal(mytemplate) {
    let dialogRef = this.dialog.open(mytemplate, {
      width: '450px',
      height: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleOnCheckBoxChange(value) {
    this.optionDisable = value.checked ? false : true;
    this.checked = value.checked;
  }

  handleOnMatSelect(value) {
    if (value == "Approve") {
      this.optionDisable = this.checked ? false : true;
    }
    if (value == "Send Back") {
      this.optionDisable = true;
    }
    if (value == "Send") {
      this.optionDisable = true;
    }
  }

  handleOnRequestApproval(value, mytemplate) {
    const payload = {
      resourceType: this.globalContent.contentType?.toUpperCase() || 'M',
      resourceId: this.globalContent.id || '',
      user: this.globalContent.createdUser || '',
      comments: this.sendBackComment,
      parentId: 0,
      status: "Open",
      createdOn: this.globalContent.createdDateTime || '',
      creatorClockId: this.globalContent.createdUser || '',
      assetStatusId: this.globalContent.assetStatusId || 0,
      assetStatus: this.globalContent.assetStatus,
      version: this.globalContent.version || ''
    }
    if (value == 'Approve') {
      this.isApprove = true;
      this.loading = true;
      this.dialog.closeAll();
      this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe((res) => {
        this.isApprove = false;
        console.log(res);
        this.isStatusApproveOrReject = false;
        this.store.dispatch(ContentDataActions.resetContentData());
        this.router.navigate(['/dashboard']);
      }, (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        this.isApprove = false;
      })
    } else if (value == 'Send Back') {
      this.isApprove = false;
      this.loading = true;
      this.dialog.closeAll();
      this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe((res) => {
        this.loading = false;
        console.log(res);
        this.isStatusApproveOrReject = false;
        this.store.dispatch(ContentDataActions.resetContentData());
        this.router.navigate(['/dashboard']);
      }, (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      })
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

  openRequestModal(requestApprovalTemplate) {
    this.selectedcontentOwner = this.globalContent && (this.globalContent.contentOwnerMail || this.globalContent.contentOwnerId);
    this.disableSubmit = this.selectedcontentOwner ? false : true;
    this.requestComment = '';
    this.sendBackComment = '';
    let dialogRef = this.dialog.open(requestApprovalTemplate, {
      width: '450px',
      height: '510px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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

}
