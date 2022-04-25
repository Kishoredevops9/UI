import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessMapsService } from '@app/process-maps/process-maps.service';
import { TaskCrationPageService } from "@app/task-creation/task-creation.service"
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedService } from '@app/shared/shared.service'
import { NgxUiLoaderService } from "ngx-ui-loader";
import { documentPath } from '@environments/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { TooltipDict } from '@app/shared/utils/app-settings';
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
  selector: 'customize-task-map-tree',
  templateUrl: './customize-task-map-tree.component.html',
  styleUrls: ['./customize-task-map-tree.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})


export class CustomizeTaskMapTreeComponent implements OnInit{
  TooltipDict = TooltipDict;
  deleteEventOption: any
  someComplete: any = false;
  @Input() selectedMapsInput;
  @Input() phase : any = [];
  @Input() tag : any = []; 
  @Input() showinput;
  selectedMaps: any = []; 
  public idArray ; 
  chkD : boolean = false;
  eventsDiscipline: Subject<void> = new Subject<void>();
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
  disciplineList: FoodNode[] = [];
  disciplineData: any= [];
  selectedBox: any = {};
  showDisciplineDropDown = false;
  discipline: any;
  @Output() isCheckedChange = new EventEmitter<boolean>();
  chipDisciplineContainer: any = [];
  @Input() item = [];
  @Input() treetype;
  activityTabs;
  itemData = [];
  stepData = [];
  expendAll  : any  = false
  @Input() isChecked: boolean;
  loading:boolean;
  highlist: any = {}

  stObj  : any ={ 

    "A" : "A",
    "C"  : "CG",
    "SF" : "SF",
    "SP"  : "SP",
    "G"  : "GB",
    "I" : "WI",
    "K" : "KP",
    "M" : "PM",
    "S" : "DS",
    "R" : "RC",
    "D" : "D",
    "T" : "TC"



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
      "name": "Step Flow",
      "code": "SF",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 14,
      "name": "Step",
      "code": "SP",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    }
  ];

  public activeBlock : any = {};

  taskId: any;
  constructor(
    public TaskCrationPageService: TaskCrationPageService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private mapservice: ProcessMapsService  ,
    private createDocumentService: CreateDocumentService,
    public SharedService : SharedService,
    private ngxService: NgxUiLoaderService
  )   
  { 
  }
  getID($i) {
    let d = this.cType.find((node) => {
      return node.contentTypeId == $i
    })
    return ( d && d.code)? d.code : "C";
  }


  checkShowOption($item,checkIND,arg3){

    if(this.showinput.high){
      if ($item || arg3){
        return true;
      }
      else {
        return false;
      }
    }

    else if (this.showinput.un){

      if (checkIND){
        return true;
      }
      else {
        return false;
      }


    }
    else {
            return true;

    }
  }
  
  updateData(item,$event){ 
    this.chkD = true;
   let OBJ =  {
      "taskComponentId": item.TaskComponentId,
      "includedInd": $event.checked ,
       "taskId" :        this.taskId
    }
    this.TaskCrationPageService.updatetaskcomponentinclusion(OBJ).subscribe(( node:any ) => {
      
      this.selectedMaps =  this.checkReadyInd( node['Tasks'][0]['StepFlows']) ;
      this.chkD = false;

      
      // let taskId =  parseInt(window.location.href.split("/").pop()) 
      // if (taskId) {
      //   this.chkD = true;
      //   this.TaskCrationPageService.gettaskstepflowbytaskid(taskId).subscribe((node:any) => {         
      //    this.selectedMaps =  node['Tasks'][0]['StepFlows']  ; 
      //    this.chkD = false;
      //   })
      // }



    })
  }

  disciplineDropdown(data:any, treeType:any) {
    let DisciplineDropdown = data;
    let pushData : any = [];
    if(DisciplineDropdown.length > 0) {
        DisciplineDropdown.forEach(function(item: any){
          let Steps = item.Steps;
          if(Steps) {
            Steps.forEach(function(item: any, index:number){
              let Disciplines = item.Disciplines;
              if(Disciplines) {
                Disciplines.forEach(function(itemData: any, index:number){

                  let swimLaneTitle;

                  if(itemData.Discipline1) {
                    swimLaneTitle = itemData.Discipline1
                  }

                  if(itemData.Discipline2) {
                    swimLaneTitle = '';
                    swimLaneTitle = itemData.Discipline1 + '>' + itemData.Discipline2
                  }

                  if(itemData.Discipline3) {
                    swimLaneTitle = '';
                    swimLaneTitle = itemData.Discipline1 + '>' + itemData.Discipline2 + '>' + itemData.Discipline3
                  }

                  if(itemData.Discipline4) {
                    swimLaneTitle = '';
                    swimLaneTitle = itemData.Discipline1 + '>' + itemData.Discipline2 + '>' + itemData.Discipline3 + '>' + itemData.Discipline4
                  }

                  let tableModel: any = {
                    name: swimLaneTitle,
                    rowNo: itemData.DisciplineId
                  };
                  pushData.push(tableModel);
                  
                  
                });
              }
            });
          } 
      });

      const disciplineData = pushData;
      const objIds = disciplineData.reduce((a, { rowNo, name }) => {
        a[rowNo] = a[rowNo] || {rowNo, name }
        return {...a, ...{[rowNo]: {rowNo, name}}}
      }, {})
      const disciplineList:any = Object.values(objIds)
      this.dataSource.data = disciplineList; 
      //let selectedBox:any = this.selectedBox;
      // let disciplineListData = [];
      // disciplineList.forEach(function(item: any){
      //   selectedBox[item.rowNo] = true;
      //   disciplineListData.push({
      //     name: '',
      //     parentId: '',
      //     rowNo: item.rowNo,
      //     selectable: ''
      //   });
      // });
      // this.disciplineList = disciplineListData;
      //this.selectedBox = selectedBox;
    }

 

    const disciplineData = pushData;
      const objIds = disciplineData.reduce((a, { rowNo, name }) => {
        a[rowNo] = a[rowNo] || {rowNo, name }
        return {...a, ...{[rowNo]: {rowNo, name}}}
      }, {})
      const disciplineList:any = Object.values(objIds)
      this.dataSource.data = disciplineList;   
            
  }

    checkReadyInd(Obj) {

    return Obj.filter((node) => {

        if (node.hasOwnProperty('Steps')) {
            node.Steps = this.checkReadyInd(node.Steps)
        }

        if (node.hasOwnProperty('Disciplines')) {
            node.Disciplines = this.checkReadyInd(node.Disciplines)
        }
        if (node.hasOwnProperty('Activities')) {
            node.Activities = this.checkReadyInd(node.Activities)
        }
        if (node.hasOwnProperty('ContainerItems')) {
            node.ContainerItems = this.checkReadyInd(node.ContainerItems)
        }     


        return node.ReadyInd;

    })




}

openSF(element, type:string) {
  const pwStatus = 'published';
  sessionStorage.setItem('documentId', element.CID);
  sessionStorage.setItem('documentversion', element.version);
  sessionStorage.setItem('documentcontentType', 'SF');
  sessionStorage.setItem('documentWorkFlowStatus', pwStatus);
  sessionStorage.setItem('documentcontentId', element.OriginContentId);
  sessionStorage.setItem('documentcurrentUserEmail', element.createdUser);
  sessionStorage.setItem('contentNumber', element.OriginContentId);
  sessionStorage.setItem('componentType', 'SF');
  sessionStorage.setItem('redirectUrlPath', 'dashboard');
  sessionStorage.setItem('sfcontentId', element.OriginContentId);
  sessionStorage.setItem('sfversion', element.version);
  sessionStorage.setItem('sfID', element.CID);
  element.pwStatus && pwStatus === 'published'
    ? sessionStorage.setItem('documentStatusDetails', 'published')
    : sessionStorage.setItem('documentStatusDetails', 'draft');
  element.pwStatus && pwStatus === 'published'
    ? sessionStorage.setItem('statusCheck', 'true')
    : sessionStorage.setItem('statusCheck', 'false');
  element.pwStatus && pwStatus === 'published'
    ? sessionStorage.setItem('contentType', 'published')
    : sessionStorage.setItem('contentType', 'draft');
  element.pwStatus && pwStatus === 'published'
    ? sessionStorage.setItem('sfStatus', 'published')
    : sessionStorage.setItem('sfStatus', 'published');

  let documentType = type == 'SP' ? 'SP': 'SF';
  //console.log(documentPath.publishViewPath, documentType, element.contentId);
  // this.router.navigate([ documentPath.publishViewPath, documentType, element.contentid ]);
  window.open(
    documentPath.publishViewPath +
      '/' +
      documentType +
      '/' +
      element.ContentId,
    '_blank'
  );
}

handleOnContentIDClick(item){
  let data = item;
  let element = item.ContentId;
  let assetcode = element.split('-')
  let assettypecode = assetcode[1];
  let contentType = (assettypecode == "I") ? "WI" : (assettypecode == "G") ? "GB" : (assettypecode == "S") ? "DS" : (assettypecode == "A") ? "AP" : (assettypecode == "C") ? "CG" : (assettypecode == "K") ? "KP" : (assettypecode == "R") ? "RC" : (assettypecode == "T") ? "TOC" : '';
  sessionStorage.setItem('componentType', contentType);
  sessionStorage.setItem('contentNumber', data.ContentId);
  sessionStorage.setItem('contentType', 'published');
  sessionStorage.setItem('redirectUrlPath', 'search');
  sessionStorage.setItem('statusCheck', 'true');

  if (assettypecode == 'I' || assettypecode == 'G' || assettypecode == 'S' || assettypecode == 'D') {
    window.open(documentPath.publishViewPath + '/' + data.ContentId, '_blank');
  } else if (assettypecode === 'M' || assettypecode === 'Map') {
    this.router.navigate(['/process-maps/edit', data.id]);
  } else if (assettypecode === 'F' || assettypecode === 'SF') {
    this.router.navigate(['/process-maps/edit', data.id]);
  } else {
    var assetTypecode = (assettypecode === 'A') ? "AP" : (assettypecode === 'K') ? "KP" : (assettypecode === 'T') ? "TOC" : (assettypecode === 'R') ? "RC" : (assettypecode === 'C') ? "CG" : (assettypecode === 'F') ? "SF" : '';
  //  this.router.navigate([documentPath.publishViewPath, assetTypecode, data.assetContentId]);
   window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + data.ContentId, '_blank');

  }
}
  loadMap(){
    this.loading = true;
    let taskId =  parseInt(window.location.href.split("/").pop()) 
    if (taskId) {
      this.TaskCrationPageService.gettaskstepflowbytaskid(taskId).subscribe((node:any) => {       
        this.selectedMaps =  this.checkReadyInd( node['Tasks'][0]['StepFlows']) ;
        this.taskId = node['Tasks'][0]['TaskId'];
  
        // console.log("================")
        // console.log(this.selectedMaps)
        // console.log("================")  
        this.disciplineDropdown(this.selectedMaps, this.treetype);
        this.loading = false;
        // TAG  abcd 
        // this.selectedMaps.forEach(element => { 
        //   // console.log(element)
        //   this.setId(element.version, element.contentId)
        // });
      })

    }

  }
  ngOnInit(): void {
 
this.loadMap()

this.SharedService.chipmessage.subscribe((value:any)=>{

 
 if (value.tabindex.index==3){

  this.loadMap();

 }

});




    this.createDocumentService
    .getAllMetaDiscipline()
    .subscribe((res) => { 
      this.discipline = res;
      this.disciplineDropdown(this.selectedMaps, this.treetype);
    });
  }
 
getIdes($item){
  var   $id = [];
  if( $item.Phases &&  $item.Tags){ 
        $item.Phases.concat($item.Tags).map((node:any)=>{ 
          if (  node.hasOwnProperty('PhaseId') ){
            $id.push( node.PhaseId )
          }          
          if (  node.hasOwnProperty('TagId') ){
            $id.push( node.TagId )
          }
        })
          return $id;
       }
  else{
        return 0
      }
}
checkIdes($value){ 
  if ($value && $value.length ){
    let aLength = this.idArray.filter(element => $value.includes(element));
    if (aLength.length){
      return true;
    }
    else {
      return false;
    }
  }
  else {
     return false;
  }
}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedMapsInput && changes.selectedMapsInput.currentValue) {
      changes.selectedMapsInput.currentValue.forEach(element => {
        let taskId = parseInt(window.location.href.split("/").pop());
        let Obj = {
          "taskId": taskId,
          "knowledgeAssetId": element.contentnumber,
          "sequenceNumber": this.selectedMaps.length + 1,
          "knowledgeAssetTitle": element.title,
          "contentId": element.contentid
        }
        // console.log(Obj)
        // console.log(element)
        this.TaskCrationPageService.createtaskmap(Obj).subscribe((data) => {
          element.id = data['id'];
          this.selectedMaps.push(element);
        },
          err => {
            this._snackBar.open(`Entry already exists with   contentid  ${element.contentid}`, "", {
              duration: 1500
            });
          }
        )
      });
    }
   if ( changes.phase || changes.tag ){
      this.idArray = [];
       this.phase.concat(this.tag).map((node)=>{
        this.idArray.push(  node.id )
       })

       this.expendAll = ( this.phase.length ||  this.tag.length )? true : false;
      }



    }
  checkAllCheckBox() {
    let scount = this.selectedMaps.filter((node) => {
      return node.removable
    }).length
    if (this.selectedMaps.length == scount) {
      this.deleteEventOption = true;
    }
    else {
      this.deleteEventOption = false;
    }
    if (this.selectedMaps.length != scount && scount) {
      this.someComplete = true;
    }
    else {
      this.someComplete = false;
    }
  }
  changeStatus() {
    this.checkAllCheckBox()
  }
  showOptions($event) {
    this.selectedMaps.map((node) => {
      node.removable = $event.checked
    })
  }
  clearAll() {
    this.selectedMaps.map((node) => {
      node.removable = false
    })
    this.checkAllCheckBox()
  }
  removeSelected() {
    let copyNode = [... this.selectedMaps];
    copyNode.forEach((node, i) => {
      if (node.removable) {
        this.TaskCrationPageService.deletetaskmap(node.id).subscribe(() => {
          // console.log(node)
          this._snackBar.open(`Delete content id ${node.contentId} `, "", {
            duration: 1500
          });
        })
      }
    })
    this.selectedMaps =
      copyNode.filter((node) => {
        return !node.removable
      })
    this.someComplete = false;
  }


  setDisciplineData($event, treeType:any) {
    this.chipDisciplineContainer = $event;
    let eventData = $event;
    let getData:any = this.selectedMaps;
    if(treeType =='s') {

        getData.forEach(function(item: any, i:number){
          item["selectedData"]  = false;
        });

          eventData.forEach(function(event: any, i) {
            getData.forEach(function(item: any){
              if(item.DisciplineId === event.rowNo) {
                item["selectedData"]  = true;
              }

            });
  
          }); 

      }

      else {
        getData.forEach(function(item: any, i:number){
          let innerData = item.Steps ? item.Steps : [];
          innerData.forEach(function(child: any, j:number){
            let Disciplines = child.Disciplines ? child.Disciplines : [];
              Disciplines.forEach(function(disciplines: any){
                disciplines["selectedData"]  = false;  
              });
          });
        });
        eventData.forEach(function(event: any, i) {
          getData.forEach(function(item: any, i:number){
            let innerData = item.Steps ? item.Steps : [];
            innerData.forEach(function(child: any, j:number){
              let Disciplines = child.Disciplines ? child.Disciplines : [];
              Disciplines.forEach(function(disciplines: any){
                if(disciplines.DisciplineId === event.rowNo) {
                  disciplines["selectedData"]  = true;
                }  
              });
                      
            });
          });
  
        });             
        
      }

      this.selectedMaps = getData;
  }
  
  addDisciplineList(event: MatCheckboxChange, elementData, treeType:any): void {
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
    } else{
      this.removeDisciplineList(disciplineList, treeType);
    }

  }

  dasArray(){

    let tempArray = []
    this.disciplineList.map((node)=>{

      tempArray.push(node.name)

    })
    return tempArray;

  }
  checkD($item){

    let darray = this.dasArray()
 
 
 

 if    (
     darray.indexOf($item.Discipline1)>-1 ||
     darray.indexOf($item.Discipline2)>-1 ||
     darray.indexOf($item.Discipline3)>-1 ||
     darray.indexOf($item.Discipline4)>-1 

  
  
  )

 {
  return true
 }
 


  
else{
  return false;

}



  

 


  }


  checkDataFilter($item){ 



   let I =  $item.filter((node)=>{

    return node.AssetStatementTypeCode=='C'

    })

    

    if (I && I.length){
      return true;
    }
    else{
      return false;
    }


  }

  removeDisciplineList(dataList: any, treetype:any): void {
    const index = this.disciplineList.findIndex((element, index) => {
      if (element.rowNo === dataList.rowNo) {
        this.selectedBox[element.rowNo] = false
        return true
      }
    })
    if (index >= 0) {
      this.disciplineList.splice(index, 1);
    }
    this.setDisciplineData(this.disciplineList,treetype);
  }

 

  onCheckedChange() {
    this.isCheckedChange.emit(!this.isChecked);
  }

  SelectHighlighted($item,$event,$type)
  {
    this.chkD = true;
    this.ngxService.startLoader("highlight"); 
  
  let tempArray = []; 
      this.findContainerItems (  this.findById( this.selectedMaps , $item.TaskComponentId )  ).map((node)=>{     
        if (this.checkIdes(this.getIdes(node)) ||  this.checkD(node) ){
         tempArray.push({
            "taskComponentId": node.TaskComponentId,
            "includedInd": $event.checked ,
             "taskId" : this.taskId
         })
        }
       })    

       console.log(tempArray)
    if (tempArray && tempArray.length){
      this.TaskCrationPageService.updateHighLight(tempArray).subscribe(( node:any ) => {  
        this.selectedMaps =  this.checkReadyInd(node['Tasks'][0]['StepFlows']); 
        this.chkD = false;
        this.ngxService.stopLoader( "highlight");   
      } ,(err)=>{console.log("Error") 
      this.ngxService.stopLoader( "highlight");  
    } )

    }   
    else{
      this.ngxService.stopLoader( "highlight");  
     
      this._snackBar.open("'No highlight data in ContainerItems", 'x', {
        duration: 4000,
      });
  
      this.chkD = false;

    }

  



}


   findContainerItems(data){

    console.log(data)
    let ContainerItems = [];
    function  recr(d){ 
             if (d.hasOwnProperty('ContainerItems')){            
                 ContainerItems =   ContainerItems.concat( d['ContainerItems']  )
             }
             else{ 
                 for (var p in   d) {                 
                         if (typeof d[p] === 'object') {
                              recr(d[p] );                           
                         }
                 }
             }
     }
      recr(data);
    return ContainerItems;
 }
 
 
 
   findById(obj, id) {
     var result;
     for (var p in obj) {
         if (obj.TaskComponentId == id) {
             return obj;
         } else {
             if (typeof obj[p] === 'object') {
                 result = this.findById(obj[p], id);
                 if (result) {
                     return result;
                 }
             }
         }
     }
     return result;
 }




}
