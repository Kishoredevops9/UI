import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessMapsService } from '../process-maps.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService

@Component({
  selector: 'app-create-from-existing-search-map',
  templateUrl: './create-from-existing-search-map.component.html',
  styleUrls: ['./create-from-existing-search-map.component.scss']
})
export class CreateFromExistingSearchMapComponent implements OnInit,AfterViewInit {
  @Output() myOutput:EventEmitter<string>=new EventEmitter<string>();
  dataSourceActivitySearch;
  originalData;
  totalActivitySearchRecords: number = 0 ;
  pageRowCounters = [10,20,50,100];
  selectedElement;
  inputFieldValue = new FormControl();


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

  constructor(
    private route: ActivatedRoute,
    private activityService: ProcessMapsService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sharedService: SharedService 
    ) { 
      this.ngxService.startBackground();
    }

  ngOnInit(): void {
    this.loadServiceData();
  }

  ngAfterViewInit(){

  }

  loadServiceData(){ 
   
    this.activityService.getAllProcessMap().subscribe(
      (data) => {
        //this.dataSourceActivitySearch = data ;
        this.dataSourceActivitySearch = new MatTableDataSource(data);
        this.originalData = this.dataSourceActivitySearch.data;
        this.dataSourceActivitySearch.paginator = this.paginations;
        //this.rowCount();
        this.dataSourceActivitySearch.sort = this.sorting;
        this.ngxService.stopBackground();
      }
    );  
  }
  
  rowCount(){

    this.pageRowCounters.pop();
    this.pageRowCounters.pop();
    this.pageRowCounters.pop();
    this.pageRowCounters.pop();
    this.pageRowCounters.pop();
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

  
  // Update Collaborate To do List
  updateSelection(element: any, event) {
    this.dataSourceActivitySearch.data.map(function(node){ 
      if (element.id!=node.id)node['checkbox'] = false;
      })
  this.selectedElement = this.dataSourceActivitySearch.data.find((node)=>{ 
    return node.checkbox == true;
  })
   console.log(this.selectedElement)
}

  searchContents(){
    this.dataSourceActivitySearch.data = this.originalData;
    let inputValue = this.inputFieldValue.value;
    let currentValue: string;
    let currentId: number;
    let filteredData = [];
  
    this.dataSourceActivitySearch.data.forEach(element => {
      currentId = element.id;
      if( currentId == inputValue ){
        filteredData.push(element);
      }
    });

    this.dataSourceActivitySearch.data.forEach(element => {
      currentValue = element.title;
      this.dataSourceActivitySearch.data.forEach(element => {
        currentValue = element.title;
        if(currentValue){
          currentValue = currentValue.toLowerCase();
          inputValue = inputValue.toLowerCase();
          if( currentValue.startsWith(inputValue) ){
            console.log(element);
            filteredData.push(element);
          }
        }
       
      });
    });
    
    this.dataSourceActivitySearch.data = filteredData;

  }
  onClick():void{
    this.sharedService.setExistingMapData(this.selectedElement);
    this.router.navigate(['/process-maps/create-progressmap']);

  }


}

