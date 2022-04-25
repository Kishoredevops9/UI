import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessMapsService } from '../../../process-maps/process-maps.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../dashboard/content-list/content-list.model';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { TaskCrationPageService } from '../../task-creation.service'

@Component({
  selector: 'app-task-popups',
  templateUrl: './task-popups.component.html',
  styleUrls: ['./task-popups.component.scss']
})
export class TaskPopupsComponent implements OnInit,AfterViewInit {

  contentType='M';
  searchKpackList;
  taskKpackDataSource=[];


  dataSourceActivitySearch;
  originalData;
  totalActivitySearchRecords: number = 0 ;
  pageRowCounters = [10,20,50,100];
  selectedElement;
  inputFieldValue = new FormControl();

  
  filterOn: boolean = false;
  filterSubMapShow: boolean = false; 
  filterSubMapForm: FormGroup;
  filterArray = [];
  dataLists;

  uniqueId = [];
  uniqueVersion = [];
  uniqueTitle = [];
  uniqueUsJc = [];
  uniqueEffectiveDate = [];
  uniqueTRMReviewDate = [];
  shortEffectiveDate = [];

  // Output event
  @ViewChild(MatPaginator) paginations: MatPaginator;
  @ViewChild(MatSort) sorting: MatSort;
  
  displayActivitySearchColumns: string[] = [
    'selectFields',
    'flagField',
    'id',
    'version',
    'title',
    'EffectiveDate',
    'TRMReviewDate',
    'usJc'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, 
              private activityService: ProcessMapsService,
              private ngxService: NgxUiLoaderService,
              private taskKpackService: TaskCrationPageService,
              ) {
    this.ngxService.startBackground();                
    this.filterSubMapForm = new FormGroup({
      idFilter: new FormControl(),
      usJcFilter: new FormControl(),
      versionFilter: new FormControl(),
      titleFilter: new FormControl(),
      effectiveDateFilter: new FormControl(),
      trmDateFilter: new FormControl()
    });

    if(data?.doc?.contentType){
      this.contentType = data?.doc?.contentType;
      
      this.displayActivitySearchColumns = [
        'selectFields',
        'flagField',
        'contentid',
        'version',
        'title',
        'effectivefrom',
        'usclassificationid'
      ];
    }
    console.log(this.contentType);
   }

  ngOnInit(): void {
    this.loadServiceData();
  }

  ngAfterViewInit(){

  }

  loadServiceData(){ 
    if(this.contentType=='M'){ 
      this.activityService.getAllProcessMap().subscribe(
        (data) => {
          //this.dataSourceActivitySearch = data ;
          this.dataLists = data;
          this.dataSourceActivitySearch = new MatTableDataSource(data);
          this.originalData = this.dataSourceActivitySearch.data;
          
          //this.totalActivitySearchRecords = this.dataSourceActivitySearch.length;
          this.dataSourceActivitySearch.paginator = this.paginations;
          //this.rowCount();
          this.dataSourceActivitySearch.sort = this.sorting;
          this.filterSubMapShow = false;
          this.ngxService.stopBackground();
          this.uniqueFunctionSM();
        }
      );
    }else if(this.contentType=='T'){
      console.log("Load data of Task");
      const searchAssetType = 'K';
      this.taskKpackService.getSearchPopupData(searchAssetType).subscribe(
        (data) => {
          console.log(data);
            var res = JSON.parse(JSON.stringify(data));
            this.searchKpackList = res.hits.hits;
            console.log(this.searchKpackList);
            this.searchKpackList.forEach((el) => {
              this.taskKpackDataSource.push(el._source);
            });
            console.log(this.taskKpackDataSource);

          this.dataLists = this.taskKpackDataSource;  
          this.dataSourceActivitySearch = new MatTableDataSource(this.taskKpackDataSource);
          this.originalData = this.dataSourceActivitySearch.data;
          this.dataSourceActivitySearch.paginator = this.paginations;
          //this.rowCount();
          this.dataSourceActivitySearch.sort = this.sorting;
          this.filterSubMapShow = false;
          this.ngxService.stopBackground();
          this.uniqueFunctionSM();
        }
      );
    }  
  }
  
  rowCount(){

    this.pageRowCounters.splice(0, this.pageRowCounters.length);
    if(this.totalActivitySearchRecords <=10){
      this.pageRowCounters.push(this.totalActivitySearchRecords);
    }else if (this.totalActivitySearchRecords <=20) {
      this.pageRowCounters.push(10,this.totalActivitySearchRecords);
    }else if(this.totalActivitySearchRecords <=50){
      this.pageRowCounters.push(10,20,this.totalActivitySearchRecords);
    }else if(this.totalActivitySearchRecords >50){
      this.pageRowCounters.push(10,20,50,this.totalActivitySearchRecords);
    }
    this.dataSourceActivitySearch.paginator.pageSizeOptions = this.pageRowCounters;
    
  }

  // Update Selection  List
  updateSelection(element: any, event) {
    if(this.contentType == 'T'){
      this.dataSourceActivitySearch.data.map(function(node){ 
        if (element.contentid!=node.contentid)node['checkbox'] = false;
      });
      this.selectedElement = this.dataSourceActivitySearch.data.find((node)=>{ 
        return node.checkbox == true;
      });
      console.log(this.selectedElement,"Task");
    } 
    if(this.contentType == 'M'){
      this.dataSourceActivitySearch.data.map(function(node){ 
        if (element.id!=node.id)node['checkbox'] = false;
      });
      this.selectedElement = this.dataSourceActivitySearch.data.find((node)=>{ 
        return node.checkbox == true;
      });
      console.log(this.selectedElement,"Maps");
    }

  }

  searchContents(){
    this.resetFilters();
    this.dataSourceActivitySearch.data = this.originalData;
    let inputValue = this.inputFieldValue.value;
    let currentValue: string;
    let filteredData = [];

    if(this.contentType == 'M'){
      let currentId: number;
      this.dataSourceActivitySearch.data.forEach(element => {
        currentId = element.id;
        if( currentId == inputValue ){
          filteredData.push(element);
        }
      });
    }

    if(this.contentType == 'T'){
      let currentId: string;
      this.dataSourceActivitySearch.data.forEach(element => {
        currentId = element.contentid;
        currentId = currentId?.toLowerCase();
        inputValue = inputValue?.toLowerCase();
        if( currentId?.startsWith(inputValue) ){
          filteredData.push(element);
        }
      });
    }

    this.dataSourceActivitySearch.data.forEach(element => {
      currentValue = element.title;
      currentValue = currentValue?.toLowerCase();
      inputValue = inputValue?.toLowerCase();
      if( currentValue?.startsWith(inputValue) ){
        filteredData.push(element);
      }
     
    });
    this.dataSourceActivitySearch.data = filteredData;

  }


  //Filter functions
  filterActivitypop(){
    this.filterSubMapShow = true;
  }

  closeFilters(){
    this.filterSubMapShow = false;
  }

  clearFilter() {
    this.dataSourceActivitySearch.filter = '';
  }

  resetFilters(){
    this.filterSubMapForm.reset();
    this.dataSourceActivitySearch = new MatTableDataSource(this.originalData);
    this.dataSourceActivitySearch.paginator = this.paginations;
    this.dataSourceActivitySearch.sort = this.sorting;
  }

  applySubMapFilter(){
    this.inputFieldValue.reset();

    let arrayData = [];
    this.filterArray = [];
    let dataholders = this.dataLists;
    
    
    if(this.contentType == 'M'){
      dataholders.forEach(element => {
        let nonEmptyFlag = '';
        let conditionFlag = '';

        if( this.filterSubMapForm.value.idFilter != '' && this.filterSubMapForm.value.idFilter != undefined && this.filterSubMapForm.value.idFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.id === this.filterSubMapForm.value.idFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterSubMapForm.value.versionFilter !== '' && this.filterSubMapForm.value.versionFilter !== undefined && this.filterSubMapForm.value.versionFilter !== null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.version === this.filterSubMapForm.value.versionFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterSubMapForm.value.titleFilter != '' && this.filterSubMapForm.value.titleFilter != undefined && this.filterSubMapForm.value.titleFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.title === this.filterSubMapForm.value.titleFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterSubMapForm.value.usJcFilter !== '' && this.filterSubMapForm.value.usJcFilter !== undefined && this.filterSubMapForm.value.usJcFilter !== null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          console.log(element.usclassificationId , this.filterSubMapForm.value.usJcFilter);  
          if(element.usclassificationId == this.filterSubMapForm.value.usJcFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterSubMapForm.value.effectiveDateFilter != '' && this.filterSubMapForm.value.effectiveDateFilter != undefined && this.filterSubMapForm.value.effectiveDateFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.effectiveFrom){
            let tempDate = element.effectiveFrom?.split("T",1);
            if(tempDate[0] === this.filterSubMapForm.value.effectiveDateFilter){
              conditionFlag = conditionFlag + '1';
            }else{
              conditionFlag = conditionFlag + '0';
            }
          }   
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterSubMapForm.value.trmDateFilter != '' && this.filterSubMapForm.value.trmDateFilter != undefined && this.filterSubMapForm.value.trmDateFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.TRMReviewDate === this.filterSubMapForm.value.trmDateFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }


        if( nonEmptyFlag == conditionFlag){
          this.filterArray.push(element);
        }

      });
    }
    //Filter or Task
    if(this.contentType == 'T'){
      dataholders.forEach(element => {
        let nonEmptyFlag = '';
        let conditionFlag = '';

        if( this.filterSubMapForm.value.idFilter != '' && this.filterSubMapForm.value.idFilter != undefined && this.filterSubMapForm.value.idFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.contentid === this.filterSubMapForm.value.idFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterSubMapForm.value.versionFilter !== '' && this.filterSubMapForm.value.versionFilter !== undefined && this.filterSubMapForm.value.versionFilter !== null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.version === this.filterSubMapForm.value.versionFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterSubMapForm.value.titleFilter != '' && this.filterSubMapForm.value.titleFilter != undefined && this.filterSubMapForm.value.titleFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.title === this.filterSubMapForm.value.titleFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterSubMapForm.value.usJcFilter !== '' && this.filterSubMapForm.value.usJcFilter !== undefined && this.filterSubMapForm.value.usJcFilter !== null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          console.log(element.usclassificationid , this.filterSubMapForm.value.usJcFilter);  
          if(element.usclassificationid == this.filterSubMapForm.value.usJcFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterSubMapForm.value.effectiveDateFilter != '' && this.filterSubMapForm.value.effectiveDateFilter != undefined && this.filterSubMapForm.value.effectiveDateFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.effectivefrom){
            let tempDate = element.effectivefrom?.split("T",1);
            if(tempDate[0] === this.filterSubMapForm.value.effectiveDateFilter){
              conditionFlag = conditionFlag + '1';
            }else{
              conditionFlag = conditionFlag + '0';
            }
          }   
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }


        if( nonEmptyFlag == conditionFlag){
          this.filterArray.push(element);
        }

      });
    }
  
    arrayData = this.filterArray;
    this.dataSourceActivitySearch.data = arrayData;
    
    this.dataSourceActivitySearch.paginator = this.paginations;
    this.dataSourceActivitySearch.sort = this.sorting;

  }

  uniqueFunctionSM(){
    let listdata = this.dataLists;
    let idArray = [];
    let versionArray = [];
    let titleArray = [];
    let usjcArray = [];
    let effectiveDateArray = [];
    let trmDateArray = [];

    if(this.contentType == 'M'){
      for(let i in listdata ){
        idArray.push(listdata[i].id);
        versionArray.push(listdata[i].version);
        titleArray.push(listdata[i].title);
        usjcArray.push(listdata[i].usclassificationId);
        effectiveDateArray.push(listdata[i].effectiveFrom);
        trmDateArray.push(listdata[i].TRMReviewDate);
      }
    }
    if(this.contentType == 'T'){
      for(let i in listdata ){
        idArray.push(listdata[i].contentid);
        versionArray.push(listdata[i].version);
        titleArray.push(listdata[i].title);
        usjcArray.push(listdata[i].usclassificationid);
        effectiveDateArray.push(listdata[i].effectivefrom);
      }
    }
    
    this.uniqueId = idArray.filter( (elem, i, arr) =>  arr.indexOf(elem) === i  );
    this.uniqueVersion = versionArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueTitle = titleArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueUsJc = usjcArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueEffectiveDate = effectiveDateArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueTRMReviewDate = trmDateArray?.filter( (elem, i, arr) => arr.indexOf(elem) === i );


    this.uniqueEffectiveDate.sort();
    this.uniqueEffectiveDate.reverse();
    this.shortEffectiveDate = this.createdOnFunction(this.uniqueEffectiveDate);
    
    this.uniqueTRMReviewDate?.sort();
    this.uniqueTRMReviewDate?.reverse();

  }

  createdOnFunction( CreatedOnDates ){
    let tempArray = [];
    let tempVar;
    for( let j in CreatedOnDates ){
      if(CreatedOnDates[j] != null){
        tempVar = CreatedOnDates[j].split("T",1) ;
        tempArray.push( tempVar[0] );
      }
    }
    return tempArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
  }



}
