
import { HostListener } from '@angular/core';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from "../admin.service";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-tooltip',
  templateUrl: './admin-tooltip.component.html',
  styleUrls: ['./admin-tooltip.component.scss']
})
export class AdminTooltipComponent implements AfterViewInit {
  displayedColumns: string[] = ["pageHeader", "tokenId", "title", "description", "isHidden", "lastUpdateDateTime", "lastUpdateUser", "edit"];
  ELEMENT_DATA: any = [ ];
  totalRecords: number = 0;
  pageRowCounts = [25, 50, 75, this.totalRecords];
  dataSource = new MatTableDataSource<object>();

  filterPopShow: boolean = false;
  contentFilterForm: FormGroup;
  taskDataSource:any;
  taskDatalen:number = 0;
  currentdate = new Date();
  contentFilterArray = [];
  uniqueModifiDate = [];
  uniqueModifiUser = [];
  uniquePosted = [];
  uniqueExpirtaion = [];
  uniqueTooltipName = [];
  uniqueStatus = [];
  uniquePageName = [];
  uniqueControlId = [];
  uniqueTipText = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.adminService.getAllToolTip().subscribe((data) => {  
      this.ELEMENT_DATA = data;
      this.ELEMENT_DATA.map((node) => {
        node.edit = true
      }) 
      this.taskDataSource = this.ELEMENT_DATA;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 
      this.dataSource.paginator = this.paginator; 
      this.totalRecords = this.dataSource.data.length;
      if(this.totalRecords > 25) {
        this.rowCounters();
      } else if (this.totalRecords == 25){
           this.pageRowCounts = [25];
      } else {
        this.pageRowCounts = [this.totalRecords];
      }
      this.uniqueFunction();
    })
  }

  constructor(public adminService: AdminService) {

    this.contentFilterForm = new FormGroup({
      adminPageTitle: new FormControl(),
      adminStatus: new FormControl(),
      adminModifiDate: new FormControl(),
      adminModifiBy: new FormControl(),
      adminToottipName: new FormControl(),
      adminTipText: new FormControl(),
      adminControlId: new FormControl(),
    });   
    
  }
  
 @HostListener("window:scroll", ["$event"])
 onWindowScroll() {
  if (document.body.scrollTop > 140 ||     
  document.documentElement.scrollTop > 140) {
    // document.getElementById('subTitle').classList.add('red');
    // document.getElementById('paragraph').classList.add('green');
    document.querySelector(".fixBox").classList.add('active');
  }
  else { 
  document.querySelector(".fixBox").classList.remove('active');


  }

 

}


  updateItem(item) {
    let $item ={
      createdUser: item.createdUser,
      description: item.description,
      id: item.id,
      isHidden: item.isHidden,
      lastUpdateUser:  sessionStorage.getItem("userMail"),
      pageHeader: item.pageHeader,
      title: item.title,
      tokenId: item.tokenId }  
      this.adminService.updateTooltip($item).subscribe((data) => { 
      console.log(data) 
    })



  }


  // Filter related Code  
  uniqueFunction() {
    let tasklistdata = this.taskDataSource;
    let updateModifiDateArray = [];
    let updateModifiUserArray = [];
    let uniqueTooltipNameArray = [];
    let uniqueStatusArray = [];
    let uniquePageNameArray = [];
    let uniqueControlIdArray = [];
    let uniqueTipTextArray = [];
    
    for (let i in tasklistdata) {
      updateModifiDateArray.push(tasklistdata[i].lastUpdateDateTime);
      updateModifiUserArray.push(tasklistdata[i].lastUpdateUser);
      uniqueTooltipNameArray.push(tasklistdata[i].title);
      uniqueStatusArray.push(tasklistdata[i].isHidden);
      uniquePageNameArray.push(tasklistdata[i].pageHeader);
      uniqueControlIdArray.push(tasklistdata[i].tokenId);
      uniqueTipTextArray.push(tasklistdata[i].description);
    }

    this.uniqueModifiDate = updateModifiDateArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueModifiDate.sort();
    this.uniqueModifiDate.reverse();
    
    this.uniqueModifiUser = updateModifiUserArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueModifiUser.sort();
    
    this.uniqueTooltipName = uniqueTooltipNameArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueTooltipName.sort();

    this.uniqueStatus = uniqueStatusArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueStatus.sort();

    this.uniquePageName = uniquePageNameArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniquePageName.sort();

    this.uniqueControlId = uniqueControlIdArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueControlId.sort();

    this.uniqueTipText = uniqueTipTextArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueTipText.sort();

  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  filterpop() {
    this.filterPopShow = !this.filterPopShow;
  }

  closeFilterPop() {
    this.dataSource.filter = '';
    this.filterPopShow = false;
  }

  rowCounters() {
    console.log("rowCounters", this.totalRecords);
    let countData;
    this.pageRowCounts = [];
    for(var i=25; i<=this.totalRecords; i = i+25) {
      console.log("rowCounters:i", i);
      this.pageRowCounts.push(i)
    }
    console.log("rowCounters:pageRowCounts", this.pageRowCounts);
    if(this.pageRowCounts[this.pageRowCounts.length-1] < this.totalRecords) {
      this.pageRowCounts.push(this.totalRecords)
    }
    console.log("rowCounters:pageRowCounts:2", this.pageRowCounts);   

  }


  applyContentFilter() {
    let arrayContentData = [];
    this.contentFilterArray = [];
    let dataholders = this.taskDataSource;

    dataholders.forEach((element) => {
      let emptyFlag = '';
      let checkingFlag = '';

      if (
        this.contentFilterForm.value.adminStatus != '' &&
        this.contentFilterForm.value.adminStatus != undefined &&
        this.contentFilterForm.value.adminStatus != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.isHidden === this.contentFilterForm.value.adminStatus) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.adminPageTitle != '' &&
        this.contentFilterForm.value.adminPageTitle != undefined &&
        this.contentFilterForm.value.adminPageTitle != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.pageHeader === this.contentFilterForm.value.adminPageTitle) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      
      if (
        this.contentFilterForm.value.adminControlId != '' &&
        this.contentFilterForm.value.adminControlId != undefined &&
        this.contentFilterForm.value.adminControlId != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.tokenId === this.contentFilterForm.value.adminControlId) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }


      if (
        this.contentFilterForm.value.adminToottipName != '' &&
        this.contentFilterForm.value.adminToottipName != undefined &&
        this.contentFilterForm.value.adminToottipName != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.title === this.contentFilterForm.value.adminToottipName) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.adminTipText != '' &&
        this.contentFilterForm.value.adminTipText != undefined &&
        this.contentFilterForm.value.adminTipText != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.description === this.contentFilterForm.value.adminTipText) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }


      if (
        this.contentFilterForm.value.adminModifiDate != '' &&
        this.contentFilterForm.value.adminModifiDate != undefined &&
        this.contentFilterForm.value.adminModifiDate != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.lastUpdateDateTime === this.contentFilterForm.value.adminModifiDate) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.adminModifiBy != '' &&
        this.contentFilterForm.value.adminModifiBy != undefined &&
        this.contentFilterForm.value.adminModifiBy != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.lastUpdateUser === this.contentFilterForm.value.adminModifiBy) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      
      if (emptyFlag == checkingFlag) {
        this.contentFilterArray.push(element);
      }
    });

    arrayContentData = this.contentFilterArray;
    this.dataSource.data = arrayContentData;
    this.dataSource.paginator = this.paginator;
    this.filterPopShow = false;
  }

  resetFilterPop() {
    this.contentFilterForm.reset();
    this.dataSource = new MatTableDataSource(this.taskDataSource);
    this.dataSource.paginator = this.paginator;
  }


}
