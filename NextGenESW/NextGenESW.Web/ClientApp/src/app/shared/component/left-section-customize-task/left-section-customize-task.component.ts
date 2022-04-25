import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagSearchViewData } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.model';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { Subject, Subscription } from 'rxjs';
import { ConfirmDialogModel, ConfirmDialogComponent } from '@app/shared/component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubMapSearchComponent } from '@app/process-maps/sub-map-search/sub-map-search.component';
import { ActivityPageSearchComponent } from '@app/process-maps/activity-page-search/activity-page-search.component';
import { TaskPopupsComponent } from '@app/task-creation/task-creation-details/task-popups/task-popups.component';
import { TaskAddSwimlaneComponent } from '@app/task-creation/task-creation-details/task-add-swimlane/task-add-swimlane.component';
@Component({
  selector: 'app-left-section-customize-task-section',
  templateUrl: './left-section-customize-task.component.html',
  styleUrls: ['./left-section-customize-task.component.scss']
})
export class LeftSectionCustomizeTaskComponent {
  taskSubMapData;
  taskActivityData;
  taskKPackData;
  taskAddSwimlaneData;
  private subscription: Subscription;
  @Output() nextTab = new EventEmitter();
  tagId = ["0"];
  phaseId = ["0"]
  titleId = "";
  tagSearchViewData: TagSearchViewData[];
  processMapContent: any[];
  mainmap: any = [];
  treedata: any;
  tagCustomizeSearchForm: FormGroup;
  searchText: string;
  chipValues: any = [];
  chipData: any = [];
  phasesData: any;
  eventsSubject: Subject<void> = new Subject<void>();
  confirmOption: string = '';
  showOption : any = {}
  constructor(private SharedService: SharedService, private activityPageService: ActivityPageService,
    private tabOneContentService: TabOneContentService, private router: Router, private fb: FormBuilder,
    public dialog: MatDialog, public kPackDialog: MatDialog, public subMapDialog: MatDialog,
    public activityPageDialog: MatDialog, public addSwimlaneDialog: MatDialog) {
    this.loadDropDowndata() 
  }
  ngOnInit(): void {
    this.tagCustomizeSearchForm = this.createPhaseForm();
  }
  private createPhaseForm(): FormGroup {
    return this.fb.group({
      'searchText': [null, Validators.required]
    })
  }
  loadDropDowndata() {
    this.tabOneContentService.getAllAssetPhases().subscribe(data => {
      this.phasesData = data;
      this.phasesData.map((node) => {
        node.name = node.description
      })
      this.activityPageService
        .getTagList()
        .subscribe((res) => {
          this.phasesData = [{
            id: 4,
            name: "Phases",
            parentId: "undefined",
            children: this.phasesData
          }]
          this.treedata = this.phasesData.concat(res)
        });
    });
  }
  public cCode: any = {
    "WI": "#9D5A83",
    "GB": "#008A90",
    "DS": "#8800BA",
    "M": "#DF4B09",
    "AP": "#30A62A",
    "KP": "#404040",
    "CG": "#17b4ef",
    "TOC": "#034796",
    "RC": "#FFC400"
  }
  tagdata: any;
  tagDataEvent($event) {
    if ($event.length) {
      let phaseSelection = $event.filter(function (el) {
        return el.parentId == undefined &&
          el.id <= 8;
      });
      let tagSelection = $event.filter(function (el) {
        return el.parentId != undefined &&
          el.id >= 8;
      });
      if (Object.keys(phaseSelection).length > 0) {
        this.chipValues = phaseSelection;
      }
      if (Object.keys(tagSelection).length > 0) {
        this.chipData = tagSelection;
      }
    }
    else {
      this.chipData = [];
      this.chipValues = [];
    }
    this.tagdata = $event;
    this.tagId = $event;
  }
  removeChipData(delChip) {
    this.chipData = this.chipData.filter(function (node) {
      return node.id != delChip.id;
    })
    this.tagId = this.chipData;
    this.eventsSubject.next(delChip);
  }
  removeChipValues(chip) {
    this.chipValues = this.chipValues.filter(function (node) {
      return node.id != chip.id;
    })
    this.tagId = this.chipValues;
    this.eventsSubject.next(chip);
  }

  radioBox($event,input){

 


    if ($event.checked &&  input == 'high'){
      this.showOption['un'] = false;

    }

 if ($event.checked &&  input == 'un'){
  this.showOption['high'] = false;

    }
    




  }
  loadSearchSection(tagId, phaseId, titleId) {
    /*************************Tag & Phase QueryString Code***********/
    if (tagId != 'undefined' && tagId != 0 && tagId.length > 0) {
      let tagQueryId = tagId.filter(function (el) {
        return el.parentId != undefined &&
          el.id >= 8;
      });
      let phaseQueryId = tagId.filter(function (el) {
        return el.parentId == undefined &&
          el.id <= 8;
      });
      if (Object.keys(phaseQueryId).length > 0) {
        let phaseQurId = Array.prototype.map.call(phaseQueryId, function (item) { return item.id; }).join(",");
        phaseQurId = " phaseid:(" + phaseQurId + ") ";
        phaseId = phaseQurId;
      }
      var resultTag = "";
      let tagCombineData = this.combinedTagIds(tagQueryId);
      tagCombineData.forEach(function (tags) {
        resultTag += " tagsid:(" + tags.tagId + ") AND ";
      });
      tagId = resultTag.slice(0, -4);
    }
    /*************************Tag & Phase QueryString Code***********/
    /*************************Title QueryString Code***********/
    if (titleId != "" && titleId != null) {
      titleId = "(title:" + titleId + " OR purpose:" + titleId + " OR componenttype:" + titleId + ")";
    } else {
      titleId = "";
    }
    /*************************Title QueryString Code***********/
    //console.log("loadSearchSection Customize Task tagId phase Id title", tagId, phaseId, titleId);
    this.subscription = this.tabOneContentService
      .getTaskSearchViewListData(tagId, phaseId, titleId)
      .subscribe((res) => {
        this.tagSearchViewData = res;
        this.processMapContent = res['hits']['hits'].filter(x => x._source.contenttypeid === 4);
      });
  }
  combinedTagIds(tagArray: any) {
    const res = tagArray.reduce((acc, obj) => {
      let found = false;
      for (let i = 0; i < acc.length; i++) {
        if (acc[i].parentId === obj.parentId) {
          found = true;
          acc[i].tagId += ',' + obj.id;
        }
      }
      if (!found) {
        obj.tagId = obj.id;
        acc.push(obj);
      }
      return acc;
    }, []);
    return res;
  }
  navigationLink(contentTypeId, contentId) {
    if (contentTypeId === 4) {
      this.router.navigate(['/process-maps/edit', contentId]);
    }
  }
  openSite(siteUrl, contentId) {
    window.open(siteUrl + contentId, '_blank');
  }
  onSearchSubmit() {
    this.loadSearchSection(this.tagId, this.phaseId, this.tagCustomizeSearchForm.controls.searchText.value);
  }
  confirmDialog(): void {
    const message = `Are you sure you want to remove?`;
    const dialogData = new ConfirmDialogModel("Confirm Remove?", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.confirmOption = dialogResult;
    });
  }
  public onTaskAddSwimlane() {
    //console.log('onTaskAddSwimlane');
    const dialogRef = this.addSwimlaneDialog.open(TaskAddSwimlaneComponent, {
      width: '35%',
      height: '35%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
      //console.log(result);
      this.taskAddSwimlaneData = result;
    });
  }
  openTaskKPacks() {
    //console.log("openTaskKPacks");
    const dialogRef = this.kPackDialog.open(TaskPopupsComponent, {
      width: '90%',
      height: '90%',
      data: { doc: { contentType: 'T' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      this.taskKPackData = result;
    });
  }
  openTaskSubMap() {
    //console.log("openTaskSubMap");
    const dialogRef = this.subMapDialog.open(SubMapSearchComponent, {
      width: '90%',
      height: '90%',
      data: { doc: { contentType: 'T' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      this.taskSubMapData = result;
    });
  }
  openTaskActivityPage() {
    //console.log("openTaskActivityPage");
    const dialogRefAP = this.activityPageDialog.open(ActivityPageSearchComponent, {
      width: '90%',
      height: '90%',
      data: { doc: { contentType: 'T' } }
    });
    dialogRefAP.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      this.taskActivityData = result;
    });
  }
}
