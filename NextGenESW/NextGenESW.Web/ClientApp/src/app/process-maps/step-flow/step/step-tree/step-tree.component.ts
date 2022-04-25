import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { AddDisciplineModelboxComponent } from '../../add-discipline-modelbox/add-discipline-modelbox.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '../../../process-maps.reducer';
import * as ProcessMapsActions from '../../../process-maps.actions';
import { AddActivityModelboxComponent } from '../../add-activity-modelbox/add-activity-modelbox.component'
import { ProcessMapsService } from '@app/process-maps/process-maps.service'
import { TreeconfirmboxComponent } from './treeconfirmbox/treeconfirmbox.component';
import { StepflowService } from '../../stepflow.service';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { Subject } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SharedService } from '@app/shared/shared.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ProcessMapEditDataService } from '../../../process-map-edit/services/process-map-edit-data.service';
import { ActivityGroup } from '@app/process-maps/process-maps.model';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode } from '@environments/constants';
import { Console } from 'console';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from '@app/shared/records.service';
interface TreeNode {
  name: string;
  children?: TreeNode[];
}
interface FoodNode {
  name: string;
  rowNo: number;
  children?: FoodNode[];
  parentId: number;
  selectable: boolean;
}

@Component({
  selector: 'app-step-tree',
  templateUrl: './step-tree.component.html',
  styleUrls: ['./step-tree.component.scss'],
})
export class StepTreeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @Input() globalData: any;
  id: any;
  @Input() isChecked: boolean;
  @Output() isCheckedChange = new EventEmitter<boolean>();
  expandall: boolean = false;
  public list: any = []
  @Input() item = [];
  @Input() treetype
  @Input() previewMode;
  activityTabs;
  itemData = [];
  loading = false;
  docStatus = ASSET_STATUSES.DRAFT;
  globalDataBuf: any;
  hasProperty: any = true;
  @Input() largerDiagram = false;
  hasPublished: any = false;
  showDisciplineDropDown = false;
  discipline: any;
  selectedRowIndex = -1;
  selectedRowDIndex = -1;
  selectedRowAIndex = -1;
  selectedRowLastIndex = -1;
  @Input() processMap;
  @Output() dataReload = new EventEmitter<boolean>();
  chipDisciplineContainer: any = [];
  selectable = true;
  stepData = [];
  eventsDiscipline: Subject<void> = new Subject<void>();
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
  disciplineList: FoodNode[] = [];
  disciplineData: any = [];
  selectedBox: any = {};
  temCheck: any;
  isDisabled: boolean = false;
  fl: any = {
    "SP": true,
    "A": true,
    "D": true,
    "WI": true,
    "CG": true,
    "GB": true,
    "RC": true,
    "C": true,
    "SL": true
  };

  @ViewChild('diagramHeaderContainer', { read: ViewContainerRef })
  diagramHeaderContainerRef: ViewContainerRef;

  disciplineList1: any = [
    {
      "name": "Aerothermal Fluids",
      "children": [
        {
          "name": "Acoustics",
          "children": [
            {
              "name": "Fan and Compressor",
              "rowNo": 1,
              "checked": true
            },
            {
              "name": "Fan",
              "rowNo": 2,
              "checked": false
            },
            {
              "name": "Compressor",
              "rowNo": 3,
              "checked": true
            },
          ]
        }
      ]
    }
  ]
  treeStatus: any;
  public cCode: any = {
    "WI": "#9D5A83",
    "GB": "#008A90",
    "DS": "#8800BA",
    "M": "#DF4B09",
    "AP": "#30A62A",
    "KP": "#404040",
    "CG": "#17b4ef",
    "TC": "#FFC400",
    "RD": "#E3B900",
    "TOC": "#034796",
    "RC": "#FFC400",
    "C": "#000000"
  }
  public cType: any =
    [
      {
        "contentTypeId": 0,
        "name": "Work Instructions",
        "code": "C",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 1,
        "name": "Work Instructions",
        "code": "WI",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 2,
        "name": "Guide Book",
        "code": "GB",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 3,
        "name": "Design Standards",
        "code": "DS",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 4,
        "name": "ProcessMaps",
        "code": "M",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 5,
        "name": "Refernce Doc",
        "code": "RD",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 6,
        "name": "Activity Page",
        "code": "AP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 7,
        "name": "Video",
        "code": null,
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 8,
        "name": "Tasks",
        "code": null,
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 9,
        "name": "Knowledge Pack",
        "code": "KP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 10,
        "name": "Criteria Group",
        "code": "CG",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 11,
        "name": "Table Of Content",
        "code": "TOC",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 12,
        "name": "Related Content",
        "code": "RC",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 13,
        "name": "STEP Flow",
        "code": "SF",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 14,
        "name": "STEP",
        "code": "SP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      }
    ];




  public markedCheckbox: any = false;

  checkChange() {
    setTimeout(() => {

      if (Object.values(this.fl).indexOf(true) < 0) {
        this.markedCheckbox = false;
        for (let i in this.fl) {
          this.fl[i] = true;

        }



      }

    }, 100)



  }


  changeObj($arg) {
    this.markedCheckbox = true
    this.expandAllGlobal();
    for (let i in this.fl) {



      if (i == $arg) {
        this.fl[i] = true;

      }
      else {
        this.fl[i] = false;
      }


    }




  }
  getID($i) {
    let d = this.cType.find((node) => {
      return node.contentTypeId == $i
    })

    return d.code
  }

  showChk(type, contentTypeId) {
    if (type == "C") {

      return this.fl[this.getID(contentTypeId)]


    }
    else {

      return this.fl[type];

    }


  }
  swapArrayElements(a, b) {
    let temp = this.item[a];
    this.item[a] = this.item[b];
    this.item[b] = temp;
    //console.log(this.item)


    let swapPayloadData = [];
    this.item.forEach((elems) => {
      if (elems.baseType == 'SL') {
        swapPayloadData.push({ id: elems.swimLaneId, sequenceNumber: this.item.indexOf(elems) });
      }
      if (elems.baseType == 'P') {
        swapPayloadData.push({ id: elems.stepActivityBlockId, sequenceNumber: this.item.indexOf(elems) });
      }
    });

    if (this.item[0].baseType == 'P') {
      //console.log(swapPayloadData);
      this.rservice.UpdateBroadcastMessage('true');
      this.processMapsService.updateActivityBlockSequence(swapPayloadData).subscribe((actData) => {
        this.rservice.UpdateBroadcastMessage('false');
      });
    }

    if (this.item[0].baseType == 'SL') {
      //console.log(swapPayloadData);
      this.rservice.UpdateBroadcastMessage('true');
      this.processMapsService.updateDisciplinesSequence(swapPayloadData).subscribe((data) => {
        this.rservice.UpdateBroadcastMessage('false');
        //console.log(data);
      });
    }

  };
  moveUp($i) {
    if ($i > 0) {
      this.swapArrayElements($i, $i - 1)
    }
  }
  moveDown($i) {
    var ind = this.item.length - 1;
    // console.log($i)
    // console.log(ind)
    if ($i < ind) {
      this.swapArrayElements($i, $i + 1)
    }
  }
  deleteData($item, $type) {
    const dialogRef = this.dialog.open(TreeconfirmboxComponent, {
      width: '400px',
      height: '170px'
    });
    dialogRef.afterClosed().subscribe(result => {

      console.log(result)

      // console.log('The dialog was closed');
      // console.log($item, $type);

      if (result) {
        if ($type == 'D') {
          this.rservice.UpdateBroadcastMessage('true');
          this.StepflowService.deleteTreeD($item).subscribe(arg => {
            this.dataReload.emit(true);
                    this.rservice.UpdateBroadcastMessage('false');
            // this.loadStep();;
          });
        }
        if ($type == 'A') {
          this.rservice.UpdateBroadcastMessage('true');
          this.StepflowService.deleteTreeA($item).subscribe(arg => {
            this.dataReload.emit(true);
                    this.rservice.UpdateBroadcastMessage('false');
            // this.loadStep();;
          });
        }
        if ($type == 'SF') {
          this.rservice.UpdateBroadcastMessage('true');
          this.StepflowService.deleteTreeSF($item).subscribe(arg => {
            this.dataReload.emit(true);
                    this.rservice.UpdateBroadcastMessage('false');
            // this.loadStep();;
          });
        }
        if ($type == 'SP') {
          let stepflowid= {
            "stepflowid": sessionStorage.getItem("stepflowid")
          };
          let itemData = {
            ...$item,
            ...stepflowid
        };
          this.rservice.UpdateBroadcastMessage('true');
          this.StepflowService.deleteTreeSP(itemData).subscribe(arg => {
            this.dataReload.emit(true);
                    this.rservice.UpdateBroadcastMessage('false');
            // this.loadStep();;
          });
        }

      }


    });
  }

  constructor(
    public dialog: MatDialog,
    private store: Store<ProcessMapsState>,
    private router: Router,
    private processMapsService: ProcessMapsService,
    public StepflowService: StepflowService,
    private route: ActivatedRoute,
    private createDocumentService: CreateDocumentService,
    private mapStore: Store<any>,
    private dataService: ProcessMapEditDataService,
    private rservice: RecordsService,
    private SharedService: SharedService
  ) {

    this.SharedService.activeSw.subscribe((data) => {

      setTimeout(() => {
        this.item.forEach((node, i) => {
          if (node.swimLaneId == data) {
            this.item[i]['active'] = true;
            this.loading = false;
          }
        })
      }, 2000);







    })


  }





  ngOnChanges(event) {
    this.item = this.filterActivityType1(this.item, this.treetype);
    this.stepData = this.item;
    this.disciplineDropdown(this.stepData, this.treetype);
    if (
      this.globalData && event && event.globalData &&
      event.globalData?.previousValue != event.globalData?.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatusId;
        this.docStatus = event.globalData.currentValue.assetStatus;
        this.activityTabs = event.globalData.currentValue;
        this.loading = false;
      }
    }
    this.temCheck = sessionStorage.getItem('backPriviewOn');
    //console.log( ' this.temCheck',this.temCheck);
    if (this.temCheck == 'true') {
      this.temCheck = 'true';
      //console.log( 'if',this.temCheck);
    }
    else if (this.temCheck == 'false') {
      this.temCheck = 'false';
      //console.log( 'else if',this.temCheck);
    }
    else {
      this.temCheck = 'false';
      // console.log( 'else',this.temCheck);
    }
    // this.expandAllGlobal();
  }




  disciplineDropdown(data: any, treeType: any) {
    let DisciplineDropdown = data;
    let pushData: any = [];
    if (DisciplineDropdown.length > 0) {
      DisciplineDropdown.forEach(function (item: any) {
        if (treeType == 's') {
          let steplist = item;
          const myArr = steplist.swimLaneTitle.split(">");
          const myArrLn = myArr.length;
          myArr.forEach(function (itemArr: any, i: number) {
            const StepLen = i + 1;
            if (StepLen == myArrLn) {
              let tableModel: any = {
                name: steplist.swimLaneTitle,
                rowNo: steplist.disciplineId
              };
              pushData.push(tableModel);
            }
          });
        }
        else {
          let stepSwimLanes = item.stepSwimLanes;
          if (stepSwimLanes) {
            stepSwimLanes.forEach(function (items: any) {
              let steplist = items;
              const myArr = steplist.swimLaneTitle.split(">");
              const myArrLn = myArr.length;
              myArr.forEach(function (itemArr: any, i: number) {
                const StepLen = i + 1;
                if (StepLen == myArrLn) {
                  let tableModel: any = {
                    name: steplist.swimLaneTitle,
                    rowNo: steplist.disciplineId
                  };
                  pushData.push(tableModel);
                }
              });

            });
          }
        }
      });
    }
    const disciplineData = pushData;
    const objIds = disciplineData.reduce((a, { rowNo, name }) => {
      a[rowNo] = a[rowNo] || { rowNo, name }
      return { ...a, ...{ [rowNo]: { rowNo, name } } }
    }, {})
    const disciplineList: any = Object.values(objIds)
    this.dataSource.data = disciplineList;
    let selectedBox: any = this.selectedBox;
    let disciplineListData = [];
    disciplineList.forEach(function (item: any) {
      selectedBox[item.rowNo] = true;
      disciplineListData.push({
        name: '',
        parentId: '',
        rowNo: item.rowNo,
        selectable: ''
      });
    });
    this.disciplineList = disciplineListData;
    this.selectedBox = selectedBox;
  }


  // loadStep(){
  //   let StepById = parseInt(window.location.href.split("/").pop());

  //   this.StepflowService.getStepById(StepById).subscribe((data:any)=>{
  //     this.item = data[0].stepSwimLanes;
  //     this.loading  = false;
  //   })


  // }


  ngOnInit() {
    this.createDocumentService
      .getAllMetaDisciplineStep()
      .subscribe((res) => {
        this.discipline = res;
        this.disciplineDropdown(this.stepData, this.treetype);
        //this.dataSource.data = this.discipline;
      });
    this.temCheck = sessionStorage.getItem('backPriviewOn');
    //console.log( ' this.temCheck',this.temCheck);
    if (this.temCheck == 'true') {
      this.temCheck = 'true';
      //console.log( 'if',this.temCheck);
    }
    else if (this.temCheck == 'false') {
      this.temCheck = 'false';
      //console.log( 'else if',this.temCheck);
    }
    else {
      this.temCheck = 'false';
      //console.log( 'else',this.temCheck);
    }

    this.expandAllGlobal();
  }
  processMapId: number;
  openDialog() {
    console.log("Open From Here 1")
    const dialogRef = this.dialog.open(AddDisciplineModelboxComponent, {
      data: { id: parseInt(window.location.href.split("/").pop()) ? parseInt(window.location.href.split("/").pop()) : sessionStorage.getItem('stepId') }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.loading = true;
        this.processMapsService.createSwimlane(result).subscribe((swimlane: ActivityGroup) => {
          this.dataReload.emit(true);
          // this.loadStep();

          // setTimeout(() => {
          //   this.loading = false;
          // }, 2000);


        })
      }

    });
  }
  onAddActivity(arg) {

    const dialogRef = this.dialog.open(AddActivityModelboxComponent, {
      width: '30%',
      data: this.item[0].stepId
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result == undefined) {
        this.loading = false;
      }
      //console.log("True Loads");
      //console.log('activity Data', result);

      result.swimLaneId = arg;
      result.processMapId = this.id;
      //console.log('activity Data', result);
      if (result && result != undefined) {
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
              mapId: result.processMapId,
              activity: result,
            })
          );
        }
        setTimeout(() => {
          // this.loadStep();
          this.dataReload.emit(arg)
        }, 1000);
      } else {
        this.loading = false;
      }
      if(result) {
        this.globalExpend = true;
        this.expandAllGlobal();
      }
    });

  }
  goToStep(key) {
    console.log('key', key);
    // if(parseInt(window.location.href.split("/").pop())) {
    //   this.router.navigate(['/process-maps/step', key.id]);
    // } else {
    //   const contentId = sessionStorage.getItem('sfcontentId');
    //   let stepId:any =key;
    //   sessionStorage.removeItem('stepId');
    //   sessionStorage.setItem('stepId', stepId);
    //   this.router.navigate(['/view-document/step', key.stepContentId]);
    // }

    //published case
    this.router.navigate([
      documentPath.publishViewPath,
      'SP',
      key.stepContentId
    ]);


    //  this.router.navigate(['/process-maps/step', key.stepId]);

  }

  globalExpend: boolean = false;


  expandAllGlobal() {

    this.globalExpend = (this.globalExpend) ? false : true;

    this.item.map((node) => {
      node.expandall = this.globalExpend;
      node.active = (node.expandall) ? true : false;
      if (node.stepSwimLanes) {
        node.stepSwimLanes.map((stepSwimLanes) => {
          stepSwimLanes.active = (node.expandall) ? true : false;
          if (stepSwimLanes.activityBlocks) {
            stepSwimLanes.activityBlocks.map((activityBlock) => {
              activityBlock.active = (node.expandall) ? true : false;
            })
          }
        })
      } else {
        if (node.activityBlocks) {
          node.activityBlocks.map((activityBlocks) => {
            activityBlocks.active = (node.expandall) ? true : false;
            if (activityBlocks.activityContainers) {
              activityBlocks.activityContainers.map((activityContainers) => {
                activityContainers.active = (node.expandall) ? true : false;
              })
            }
          })
        }
      }
    })
  }





  expandAll($item) {


    this.item.map((node) => {

      if (node.stepId == $item.stepId) {
        node.expandall = (node.expandall) ? false : true;
        node.active = (node.expandall) ? true : false;

        if (node.stepSwimLanes) {
          node.stepSwimLanes.map((stepSwimLanes) => {

            stepSwimLanes.active = (node.expandall) ? true : false;

            if (stepSwimLanes.activityBlocks) {



              stepSwimLanes.activityBlocks.map((activityBlock) => {
                activityBlock.active = (node.expandall) ? true : false;


              })


            }




          })



        }

      }



    })



    // this.expandall = !this.expandall;
  }

  setDisciplineData($event, treeType: any) {
    this.chipDisciplineContainer = $event;
    let eventData = $event;
    //this.item = [];
    this.itemData = this.stepData;
    let getData: any = this.itemData;



    if (treeType == 's') {

      getData.forEach(function (item: any, i: number) {
        item["selectedData"] = true;
      });

      eventData.forEach(function (event: any, i) {
        getData.forEach(function (item: any) {
          if (item.disciplineId === event.rowNo) {
            item["selectedData"] = false;
          }

        });

      });

    }

    else {
      getData.forEach(function (item: any, i: number) {
        let innerData = item.stepSwimLanes ? item.stepSwimLanes : [];
        innerData.forEach(function (child: any, j: number) {
          child["selectedData"] = true;
        });
      });
      eventData.forEach(function (event: any, i) {
        getData.forEach(function (item: any, i: number) {
          let innerData = item.stepSwimLanes ? item.stepSwimLanes : [];
          innerData.forEach(function (child: any, j: number) {
            if (child.disciplineId === event.rowNo) {
              child["selectedData"] = false;
            }
          });
        });

      });

    }
    this.item = this.itemData;



  }




  addDisciplineList(event: MatCheckboxChange, elementData, treeType: any): void {
    const disciplineList: any = elementData;
    const checked = event.checked;
    if (disciplineList && checked) {
      this.disciplineList.push({
        name: disciplineList.name,
        parentId: disciplineList.parentId,
        rowNo: disciplineList.rowNo,
        selectable: disciplineList.selectable
      });
      this.setDisciplineData(this.disciplineList, treeType);
    } else {
      this.removeDisciplineList(disciplineList, treeType);
    }

  }


  removeDisciplineList(dataList: any, treetype: any): void {
    const index = this.disciplineList.findIndex((element, index) => {
      if (element.rowNo === dataList.rowNo) {
        this.selectedBox[element.rowNo] = false
        return true
      }
    })
    if (index >= 0) {
      this.disciplineList.splice(index, 1);
    }
    this.setDisciplineData(this.disciplineList, treetype);
  }



  onCheckedChange() {
    const next = !this.isChecked;
    if (next) {
      this.globalData = {
        ...this.globalData,
        skipsDiagramUpdate: false
      }
    }
    let StepById;
    if (parseInt(window.location.href.split("/").pop())) {
      StepById = parseInt(window.location.href.split("/").pop());
    } else {
      StepById = sessionStorage.getItem('stepId')
    }


    if (this.treetype == 's') {
      this.StepflowService.getStepById(parseInt(StepById)).subscribe((data: any) => {
        this.item = data[0].stepSwimLanes;
        this.disciplineDropdown(this.item, this.treetype);
      })
    }

    this.isCheckedChange.emit(next);
  //  this.dataReload.emit(!next);
  }

  handleOnContentIDClick(item) {
    let data = item;
    if(item.baseType){
      let elementSP = item.baseType;
      let elementP = (elementSP == "P") ? "SP" : ''
      window.open(documentPath.publishViewPath + '/' + elementP + '/' + data.stepContentId, '_blank');
    }
    else{
    let element = item.assetContentId;
    let assetcode = element.split('-');
    let assettypecode = assetcode[1];
    let contentType = (assettypecode == "I") ? "WI" : (assettypecode == "G") ? "GB" : (assettypecode == "S") ? "DS" : (assettypecode == "A") ? "AP" : (assettypecode == "C") ? "CG" : (assettypecode == "K") ? "KP" : (assettypecode == "R") ? "RC" : (assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', data.assetContentId);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');
    if (assettypecode == 'I' || assettypecode == 'G' || assettypecode == 'S' || assettypecode == 'D') {
      window.open(documentPath.publishViewPath + '/' + data.assetContentId, '_blank');
    } else if (assettypecode === 'M' || assettypecode === 'Map') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else if (assettypecode === 'F' || assettypecode === 'SF') {
      this.router.navigate(['/process-maps/edit', data.id]);
    }
     else {
      var assetTypecode = (assettypecode === 'A') ? "AP" : (assettypecode === 'K') ? "KP" : (assettypecode === 'T') ? "TOC" : (assettypecode === 'R') ? "RC" : (assettypecode === 'C') ? "CG" : (assettypecode === 'F') ? "SF" : '';
      //  this.router.navigate([documentPath.publishViewPath, assetTypecode, data.assetContentId]);
      window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + data.assetContentId, '_blank');

    }
   }
  }

  filterActivityType1(treedata: any, treetype: string): any
  {
    if(treetype == 's'){
      treedata.forEach(swimlane => {
        if(swimlane.activityBlocks){
          swimlane.activityBlocks = swimlane.activityBlocks.filter(function(activity){
            return activity.activityTypeId == 1;
          })
        }
      })
    }else if(treetype == 'sf'){
      treedata.forEach(function(step: any){
        if(step.stepSwimLanes){
          step.stepSwimLanes.forEach(swimlane => {
            if(swimlane.activityBlocks){
              swimlane.activityBlocks = swimlane.activityBlocks.filter(function(activity){
                return activity.activityTypeId == 1;
              })
            }
          });
        }
      })
    }
    return treedata;
  }

  get isEditable(){
    return this.globalData?.originalAssetStatus === ASSET_STATUSES.DRAFT || (this.globalData?.originalAssetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.isContentOwner);
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }
}
