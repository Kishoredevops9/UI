import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessMapsService } from '../process-maps.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../dashboard/content-list/content-list.model';
import { TaskCrationPageService } from '../../task-creation/task-creation.service';

@Component({
  selector: 'app-step-page-search',
  templateUrl: './step-page-search.component.html',
  styleUrls: ['./step-page-search.component.scss']
})
export class StepPageSearchComponent implements OnInit {

  contentType='M';
  searchPopList;
  taskActivityPageDataSource = [];

  dataSourceActivitySearch;
  originalData;
  totalActivitySearchRecords: number = 0 ;
  pageRowCounters = [10,20,50,100];
  selectedElement;
  inputFieldValue = new FormControl();
  checkboxDisabled = false;

  filterOn: boolean = false;
  filterActivityShow: boolean = false; 
  filterActivityForm: FormGroup;
  filterArray = [];
  dataLists;

  uniqueId = [];
  uniqueVersion = [];
  uniqueTitle = [];
  uniqueUsJc = [];
  uniqueCreatedOn = [];
  uniqueCreatedOnDate = [];

  // Output event
  @ViewChild(MatPaginator) paginations: MatPaginator;
  @ViewChild(MatSort) sorting: MatSort;
  
  displayActivitySearchColumns: string[] = [
    'selectFields',
    'flagField',
    'contentid',
    'version',
    'title',
    'effectivefrom',
    'jc'
  ];

  constructor(private activityService: ProcessMapsService, 
              private ngxService: NgxUiLoaderService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, 
              private taskAPservice: TaskCrationPageService,
              ) { 
    this.ngxService.startBackground();  
    this.filterActivityForm = new FormGroup({
        createdOnFilter: new FormControl(),
        idFilter: new FormControl(),
        usJcFilter: new FormControl(),
        versionFilter: new FormControl(),
        titleFilter: new FormControl()
      });
      
    if(data?.doc?.contentType){
     this.contentType = data?.doc?.contentType;
      
    

      this.displayActivitySearchColumns = [
        'selectFields',
        'flagField',
        'contentid',
        'version',
        'title',
        'createddatetime',
        'usjurisdictionid'
      ];
    }
    console.log(this.contentType, this.displayActivitySearchColumns);
    console.log("===============");
    console.log(this.contentType); 
    console.log("===============");
  }

  ngOnInit(): void {
    this.loadServiceData();
  }

  ngAfterViewInit(){
    console.log("===============");
    console.log(this.data);
    console.log("===============");
  }

  loadServiceData(){
    if(this.contentType=='M'){ 
      this.activityService.getAllStepPages().subscribe(
        (data) => {

          
          this.dataLists = []
          
          data.hits.hits.map((node)=>{
 
            this.dataLists.push( node._source )

          })


       

          //this.dataSourceActivitySearch = data ;
          this.dataSourceActivitySearch = new MatTableDataSource(this.dataLists );
          this.originalData = this.dataSourceActivitySearch.data;
           //this.totalActivitySearchRecords = this.dataSourceActivitySearch.length;
          this.dataSourceActivitySearch.paginator = this.paginations;
          //this.rowCount();
          this.dataSourceActivitySearch.sort = this.sorting;
          this.filterActivityShow = false;
          this.ngxService.stopBackground();
          this.uniqueFunctionAP();
        }
      );
    }
    if(this.contentType=='F'){ 
      this.activityService.getAllStepFlowPages().subscribe(
        (data) => {

          
          this.dataLists = []
          
          data.hits.hits.map((node)=>{
 
            this.dataLists.push( node._source )

          })


       

          //this.dataSourceActivitySearch = data ;
          this.dataSourceActivitySearch = new MatTableDataSource(this.dataLists );
          this.originalData = this.dataSourceActivitySearch.data;
           //this.totalActivitySearchRecords = this.dataSourceActivitySearch.length;
          this.dataSourceActivitySearch.paginator = this.paginations;
          //this.rowCount();
          this.dataSourceActivitySearch.sort = this.sorting;
          this.filterActivityShow = false;
          this.ngxService.stopBackground();
          this.uniqueFunctionAP();
        }
      );
    }
    
    
    else if(this.contentType=='T'){
      console.log("Activity in Tasks");
      const searchAssetType = 'A';
      this.taskAPservice.getSearchPopupData(searchAssetType).subscribe(
        (data) => {
          console.log(data);
            var res = JSON.parse(JSON.stringify(data));
            this.searchPopList = res.hits.hits;
            console.log(this.searchPopList);
            this.searchPopList.forEach((el) => {
              this.taskActivityPageDataSource.push(el._source);
            });
            console.log(this.taskActivityPageDataSource);
          
          this.dataLists = this.taskActivityPageDataSource;  
          this.dataSourceActivitySearch = new MatTableDataSource(this.taskActivityPageDataSource);
          this.originalData = this.dataSourceActivitySearch.data;
          this.dataSourceActivitySearch.paginator = this.paginations;
          //this.rowCount();
          this.dataSourceActivitySearch.sort = this.sorting;
          this.filterActivityShow = false;
          this.ngxService.stopBackground();
          this.uniqueFunctionAP();
        }
      );
    }
      
  }
  
  rowCount(){
    this.pageRowCounters.splice(0,this.pageRowCounters.length);
    if(this.totalActivitySearchRecords <=10){
      this.pageRowCounters.push(this.totalActivitySearchRecords);
    }else if (this.totalActivitySearchRecords <=20) {
      this.pageRowCounters.push(10,this.totalActivitySearchRecords);
    }else if(this.totalActivitySearchRecords <=50){
      this.pageRowCounters.push(10,20,this.totalActivitySearchRecords);
    }else if(this.totalActivitySearchRecords <=100){
      this.pageRowCounters.push(10,20,50,this.totalActivitySearchRecords);
    }else if(this.totalActivitySearchRecords >100){
      this.pageRowCounters.push(10,20,50,100,this.totalActivitySearchRecords);
    }
    this.dataSourceActivitySearch.paginator.pageSizeOptions = this.pageRowCounters;
    
  }

  
  // Update Collaborate To do List
  updateSelection(element: any, event) {
    if(this.contentType == 'T'){
      this.dataSourceActivitySearch.data.map(function(node){ 
        if (element.contentid!=node.contentid)node['checkbox'] = false;
      });
      this.selectedElement = this.dataSourceActivitySearch.data.find((node)=>{ 
        return node.checkbox == true;
      });
      console.log(this.selectedElement,"Tasks");
    } 
    // if(this.contentType == 'M'){
    //   this.dataSourceActivitySearch.data.map(function(node){ 
    //     if (element.id!=node.id)node['checkbox'] = false;
    //   });
    //   this.selectedElement = this.dataSourceActivitySearch.data.find((node)=>{ 
    //     return node.checkbox == true;
    //   });
    //   console.log(this.selectedElement,"Maps");
    // } 
    if(this.contentType == 'M' || this.contentType == 'F'){
      this.dataSourceActivitySearch.data.map(function(node){ 
        if (element.contentnumber!=node.contentnumber)node['checkbox'] = false;
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
      let currentId: string;
      this.dataSourceActivitySearch.data.forEach(element => {
        currentId = element.contentid;
        if( currentId?.toLowerCase()?.startsWith(inputValue.toLowerCase()) ){
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
    this.filterActivityShow = true;
  }

  closeFilters(){
    this.filterActivityShow = false;
  }

  clearFilter() {
    this.dataSourceActivitySearch.filter = '';
  }

  resetFilters(){
    this.filterActivityForm.reset();
    this.dataSourceActivitySearch = new MatTableDataSource(this.originalData);
    this.dataSourceActivitySearch.paginator = this.paginations;
    this.dataSourceActivitySearch.sort = this.sorting;
  }

  applyActivityFilter(){
    this.inputFieldValue.reset();

    let arrayData = [];
    this.filterArray = [];
    let dataholders = this.dataLists;
    
    if(this.contentType == 'M'){
      dataholders.forEach(element => {
        let nonEmptyFlag = '';
        let conditionFlag = '';

        if( this.filterActivityForm.value.idFilter != '' && this.filterActivityForm.value.idFilter != undefined && this.filterActivityForm.value.idFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.contentid === this.filterActivityForm.value.idFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterActivityForm.value.versionFilter != '' && this.filterActivityForm.value.versionFilter != undefined && this.filterActivityForm.value.versionFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.version === this.filterActivityForm.value.versionFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterActivityForm.value.titleFilter != '' && this.filterActivityForm.value.titleFilter != undefined && this.filterActivityForm.value.titleFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.title === this.filterActivityForm.value.titleFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterActivityForm.value.createdOnFilter != '' && this.filterActivityForm.value.createdOnFilter != undefined && this.filterActivityForm.value.createdOnFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.effectivefrom){
            let tempDate = element.effectivefrom?.split("T",1);
            if(tempDate[0] === this.filterActivityForm.value.createdOnFilter){
              conditionFlag = conditionFlag + '1';
            }else{
              conditionFlag = conditionFlag + '0';
            }
          }   
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterActivityForm.value.usJcFilter != '' && this.filterActivityForm.value.usJcFilter != undefined && this.filterActivityForm.value.usJcFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.jc === this.filterActivityForm.value.usJcFilter){
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
    //Task AP Filters
    if(this.contentType == 'T'){
      dataholders.forEach(element => {
        let nonEmptyFlag = '';
        let conditionFlag = '';

        if( this.filterActivityForm.value.idFilter != '' && this.filterActivityForm.value.idFilter != undefined && this.filterActivityForm.value.idFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.contentid === this.filterActivityForm.value.idFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterActivityForm.value.versionFilter != '' && this.filterActivityForm.value.versionFilter != undefined && this.filterActivityForm.value.versionFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.version === this.filterActivityForm.value.versionFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterActivityForm.value.titleFilter != '' && this.filterActivityForm.value.titleFilter != undefined && this.filterActivityForm.value.titleFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.title === this.filterActivityForm.value.titleFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }
        
        if( this.filterActivityForm.value.createdOnFilter != '' && this.filterActivityForm.value.createdOnFilter != undefined && this.filterActivityForm.value.createdOnFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.createddatetime){
            let tempDate = element.createddatetime?.split("T",1);
            if(tempDate[0] === this.filterActivityForm.value.createdOnFilter){
              conditionFlag = conditionFlag + '1';
            }else{
              conditionFlag = conditionFlag + '0';
            }
          }   
        }else{
          nonEmptyFlag = nonEmptyFlag + '0';
          conditionFlag = conditionFlag + '0';
        }

        if( this.filterActivityForm.value.usJcFilter != '' && this.filterActivityForm.value.usJcFilter != undefined && this.filterActivityForm.value.usJcFilter != null ){
          nonEmptyFlag = nonEmptyFlag + '1';
          if(element.usjurisdictionid === this.filterActivityForm.value.usJcFilter){
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

    arrayData = this.filterArray;
    this.dataSourceActivitySearch.data = arrayData;
    
    this.dataSourceActivitySearch.paginator = this.paginations;
    this.dataSourceActivitySearch.sort = this.sorting;

  }

  uniqueFunctionAP(){
    let listdata = this.dataLists;
    let idArray = [];
    let versionArray = [];
    let titleArray = [];
    let createdOnArray = [];
    let usjcArray = [];

    if(this.contentType == 'M'){
      for(let i in listdata ){
        idArray.push(listdata[i].contentid);
        versionArray.push(listdata[i].version);
        titleArray.push(listdata[i].title);
        createdOnArray.push(listdata[i].effectivefrom);
        usjcArray.push(listdata[i].jc);
      }
    }
    if(this.contentType == 'T'){
      for(let i in listdata ){
        idArray.push(listdata[i].contentid);
        versionArray.push(listdata[i].version);
        titleArray.push(listdata[i].title);
        createdOnArray.push(listdata[i].createddatetime);
        usjcArray.push(listdata[i].usjurisdictionid);
      }
    }
    
    this.uniqueId = idArray.filter( (elem, i, arr) =>  arr.indexOf(elem) === i  );
    this.uniqueVersion = versionArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueTitle = titleArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueCreatedOn = createdOnArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueUsJc = usjcArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );

    this.uniqueCreatedOn.sort();
    this.uniqueCreatedOn.reverse();
    this.createdOnFunction(this.uniqueCreatedOn);
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
    this.uniqueCreatedOnDate = tempArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
  }


}
