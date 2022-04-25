import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../admin.service';
import { FeedbackCommentsComponent } from '../feedback-comments/feedback-comments.component';


@Component({
  selector: 'app-open-feedback',
  templateUrl: './open-feedback.component.html',
  styleUrls: ['./open-feedback.component.scss']
})
export class OpenFeedbackComponent implements OnInit {

  dataValues = [];
  dataSourceFeedback;
  originalData;
  totalOpenFeedbackRecords: number = 0 ;
  pageRowCounters = [10,20,50,100];
  selectedElement;

  filterOn: boolean = false;
  filterActivityShow: boolean = false; 
  filterActivityForm: FormGroup;
  filterArray = [];
  dataLists = [];

  uniqueTitle = [];
  uniqueFeedbackFrom = [];
  uniqueFeedbackDate = [];
  uniqueEmail = [];
  uniqueStatus = [];
  uniqueModifiedBy = [];
  uniqueModifiedOn = [];
  uniqueAdminComments = [];

  // Output event
  @ViewChild(MatPaginator) paginations: MatPaginator;
  @ViewChild(MatSort) sorting: MatSort;
  
  displayActivitySearchColumns: string[] = [
    'title',
    'userId',
    'createdDateTime',
    'feedbackType',
    'actionsPart',
    'status'
  ];

  constructor(
    private adminService: AdminService,
    public dialogFeedbackMgmt: MatDialog
  ) { 
      this.filterActivityForm = new FormGroup({
          titleFilter: new FormControl(),
          userIdFilter: new FormControl(),
          createdDateTimeFilter: new FormControl(),
          createdUserFilter: new FormControl(),
          statusFilter: new FormControl(),
          lastUpdateUserFilter: new FormControl(),
          lastUpdateDateTimeFilter: new FormControl(),
          adminFeedbackFilter: new FormControl()
      });
  }

  ngOnInit(): void {
    this.loadFeedbackData();
  }

  
  loadFeedbackData(){
    this.dataValues = [];
    this.dataLists = [];
    this.adminService.getAllEKSFeedbacks().subscribe( (data) => {
      let apiData = data;
      Object.keys(apiData).forEach(key => {
        if (apiData[key].isActive === true && apiData[key].status != 'Closed') {
            this.dataLists.push(apiData[key]);
        }
      });

      let getData:any = this.dataLists;
      let pushData : any = [];
      getData.forEach(function(item: any){
        let tableModel: any = {
          adminFeedback: item.adminFeedback,
          comments: item.comments,
          createdDateTime: item.createdDateTime,
          createdUser: item.createdUser,
          effectiveFrom: item.effectiveFrom,
          effectiveTo: item.effectiveTo,
          helpId: item.helpId,
          helpType: (item.helpType == 'U ' || item.helpType == 'U') ? 'User Guides' : 'Help on this page',
          id: item.id,
          isActive: item.isActive,
          isEmailSent: item.isEmailSent,
          lastUpdateDateTime: item.lastUpdateDateTime,
          lastUpdateUser: item.lastUpdateUser,
          status: item.status,
          title: item.title,
          userId: item.userId,
          version: item.version,
        };
        pushData.push(tableModel);
      }.bind(this))

      this.dataLists = pushData;
      this.dataLists.reverse();
      this.dataSourceFeedback = new MatTableDataSource(this.dataLists);
      this.originalData = this.dataSourceFeedback.data;
      this.totalOpenFeedbackRecords = this.dataSourceFeedback.data.length;
      this.dataSourceFeedback.paginator = this.paginations;
      this.dataSourceFeedback.sort = this.sorting;
      this.filterActivityShow = false;
      this.uniqueFunctionFeedback();
    });
  }
  
  //Filter functions
  filterActivitypop(){
    this.filterActivityShow = true;
  }

  closeFilters(){
    this.filterActivityShow = false;
  }

  clearFilter() {
    this.dataSourceFeedback.filter = '';
  }

  resetFilters(){
    this.filterActivityForm.reset();
    this.dataSourceFeedback = new MatTableDataSource(this.originalData);
    this.dataSourceFeedback.paginator = this.paginations;
    this.dataSourceFeedback.sort = this.sorting;
  }

  
  applyActivityFilter(){

    let arrayData = [];
    this.filterArray = [];
    let dataholders = this.dataLists;
    
    dataholders.forEach(element => {
      let nonEmptyFlag = '';
      let conditionFlag = '';

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

      if( this.filterActivityForm.value.userIdFilter != '' && this.filterActivityForm.value.userIdFilter != undefined && this.filterActivityForm.value.userIdFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.userId === this.filterActivityForm.value.userIdFilter){
          conditionFlag = conditionFlag + '1';
        }else{
          conditionFlag = conditionFlag + '0';
        }
      }else{
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if( this.filterActivityForm.value.createdDateTimeFilter != '' && this.filterActivityForm.value.createdDateTimeFilter != undefined && this.filterActivityForm.value.createdDateTimeFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.createdDateTime){
          let tempDate = element.createdDateTime?.split("T",1);
          if(tempDate[0] === this.filterActivityForm.value.createdDateTimeFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }   
      }else{
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if( this.filterActivityForm.value.createdUserFilter != '' && this.filterActivityForm.value.createdUserFilter != undefined && this.filterActivityForm.value.createdUserFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.createdUser === this.filterActivityForm.value.createdUserFilter){
          conditionFlag = conditionFlag + '1';
        }else{
          conditionFlag = conditionFlag + '0';
        }
      }else{
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if( this.filterActivityForm.value.statusFilter != '' && this.filterActivityForm.value.statusFilter != undefined && this.filterActivityForm.value.statusFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.status === this.filterActivityForm.value.statusFilter){
          conditionFlag = conditionFlag + '1';
        }else{
          conditionFlag = conditionFlag + '0';
        }
      }else{
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if( this.filterActivityForm.value.lastUpdateUserFilter != '' && this.filterActivityForm.value.lastUpdateUserFilter != undefined && this.filterActivityForm.value.lastUpdateUserFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.lastUpdateUser === this.filterActivityForm.value.lastUpdateUserFilter){
          conditionFlag = conditionFlag + '1';
        }else{
          conditionFlag = conditionFlag + '0';
        }
      }else{
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if( this.filterActivityForm.value.lastUpdateDateTimeFilter != '' && this.filterActivityForm.value.lastUpdateDateTimeFilter != undefined && this.filterActivityForm.value.lastUpdateDateTimeFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.lastUpdateDateTime){
          let tempDate = element.lastUpdateDateTime?.split("T",1);
          if(tempDate[0] === this.filterActivityForm.value.lastUpdateDateTimeFilter){
            conditionFlag = conditionFlag + '1';
          }else{
            conditionFlag = conditionFlag + '0';
          }
        }   
      }else{
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if( this.filterActivityForm.value.adminFeedbackFilter != '' && this.filterActivityForm.value.adminFeedbackFilter != undefined && this.filterActivityForm.value.adminFeedbackFilter != null ){
        nonEmptyFlag = nonEmptyFlag + '1';
        if(element.adminFeedback === this.filterActivityForm.value.adminFeedbackFilter){
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

    arrayData = this.filterArray;
    this.dataSourceFeedback.data = arrayData;
    
    this.dataSourceFeedback.paginator = this.paginations;
    this.dataSourceFeedback.sort = this.sorting;

  }

  uniqueFunctionFeedback(){
    let listdata = this.dataLists;
    let titleArray = [];
    let feedbackFromArray = [];
    let feedbackDateArray = [];
    let emailArray = [];
    let statusArray = [];
    let modifiedByArray = [];
    let modifiedOnArray = [];
    let adminCommentsArray = []

    for(let i in listdata ){
      titleArray.push(listdata[i].title);
      feedbackFromArray.push(listdata[i].userId);
      feedbackDateArray.push(listdata[i].createdDateTime);
      emailArray.push(listdata[i].createdUser);
      statusArray.push(listdata[i].status);
      modifiedByArray.push(listdata[i].lastUpdateUser);
      modifiedOnArray.push(listdata[i].lastUpdateDateTime);
      adminCommentsArray.push(listdata[i].adminFeedback);
    }
    
    this.uniqueTitle = titleArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueFeedbackFrom = feedbackFromArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueFeedbackDate = feedbackDateArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueEmail = emailArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueStatus = statusArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueModifiedBy = modifiedByArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueModifiedOn = modifiedOnArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    this.uniqueAdminComments = adminCommentsArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    
    this.uniqueFeedbackDate.sort();
    this.uniqueFeedbackDate.reverse();
    this.uniqueFeedbackDate = this.createdOnFunction(this.uniqueFeedbackDate);

    this.uniqueModifiedOn.sort();
    this.uniqueModifiedOn.reverse();
    this.uniqueModifiedOn = this.createdOnFunction(this.uniqueModifiedOn);
  }

  createdOnFunction( CreatedOnDates ){
    let tempArray = [];
    let tempVar;
    let formattedDate;
    for( let j in CreatedOnDates ){
      if(CreatedOnDates[j] != null){
        tempVar = CreatedOnDates[j].split("T",1) ;
        tempArray.push( tempVar[0] );
      }
    }
    formattedDate = tempArray.filter( (elem, i, arr) => arr.indexOf(elem) === i );
    return formattedDate;
  }

  onFeedbackEdit(element){
    const dialogFeedbackManagement = this.dialogFeedbackMgmt.open(FeedbackCommentsComponent, {
      width: '40%',
      height: 'auto',
      data: {
        element: element,
        openView: 'OpenFeedback'
      }
    });
    dialogFeedbackManagement.afterClosed().subscribe((result) => {
    });
  }

}
