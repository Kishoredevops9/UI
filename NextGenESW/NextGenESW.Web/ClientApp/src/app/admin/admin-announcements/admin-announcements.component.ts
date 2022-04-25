import { Component, OnInit , ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalFormPopupComponent } from '../../../app/shared/component/global-form-popup/global-form-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { announceTableList, announceFormModal } from './admin-announcements.model';
import { AdminService } from "../admin.service";
import { DatePipe } from '@angular/common';
import { objAndSameType } from '@ngx-formly/core/lib/utils';
let datePipe = new DatePipe("en-US");

const USER_SCHEMA = {
  "title": "text",
  "type": "text",
  "status": "dropdown",
  "description": "textarea",
  "dateofpost": "date",
  "expirationdate": "date",
  "CreatedModifiedDate": "noedit",
  "CreatedModifiedBy": "noedit"
}

interface status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin-announcements',
  templateUrl: './admin-announcements.component.html',
  styleUrls: ['./admin-announcements.component.scss']
})
export class AdminAnnouncementsComponent implements OnInit {
  columnsConfig: Array<any> = [
    { header: 'Title', value: 'title', action:'text', formControlName: 'adminTitle'},
    { header: 'Type', value: 'type', action:'dropdownType', formControlName: 'adminType'},
    { header: 'Status', value: 'status', action:'dropdown', formControlName: 'adminStatus'},
    { header: 'Created/Modified Date', value: 'lastUpdateDateTime', action:'noedit'},
    { header: 'Created/Modified By', value: 'lastUpdateUser' , action:'noedit'},
    { header: 'Description', value: 'description', action:'textarea', formControlName: 'adminDescription'},
    { header: 'Date of post', value: 'effectiveFrom', action:'date', formControlName: 'adminPosted' },
    { header: 'Expiration date', value: 'effectiveTo', action:'date', formControlName: 'adminExpirtaion'},
    { header: 'Link', value: 'announcementUrl', action:'link', formControlName: 'adminLink'},
    { header: 'Edit', value: 'editIcon', action:'edit'},
    { header: 'Delete', value: 'deleteIcon', action:'delete'},
    // { header: 'Preview', value: 'previewIcon', action:'preview'}
  ];
  dataSource: MatTableDataSource<announceTableList>;
  dataSchema = USER_SCHEMA;
  selectedValue:any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selected = 'exact';
  displayedColumnKeys: string[];
  filterPopShow: boolean = false;
  contentFilterForm: FormGroup;
  announceFormModal:any[] = announceFormModal;
  dialogConfig:any;
  isShowSpinner: boolean = false;
  currentLoggedUser:any ='';
  taskDataSource:any;
  taskDatalen:number = 0;
  currentdate = new Date();
  contentFilterArray = [];
  uniqueModifiDate = [];
  uniqueModifiUser = [];
  uniquePosted = [];
  uniqueExpirtaion = [];
  minDate:Date = new Date();
  maxDate:Date = new Date(9999, 11, 31);
  addItemForm: FormGroup;
  elementIsEdit:boolean;
  //Error Display
  error:any={isError:false,errorMessage:''};
  announceType:any;
  isValidDate:any;
  isValidEm:any;
  constructor(public dialog: MatDialog,
    public adminService : AdminService,) {
    this.displayedColumnKeys = this.columnsConfig.map(col => col.value);
    this.contentFilterForm = new FormGroup({
      adminTitle: new FormControl(),
      adminStatus: new FormControl(),
      adminModifiDate: new FormControl(),
      adminModifiBy: new FormControl(),
      adminPosted: new FormControl(),
      adminExpirtaion: new FormControl(),
    });

    this.addItemForm = new FormGroup({
      adminLink: new FormControl(),
      adminTitle: new FormControl(),
      adminType: new FormControl(),
      adminStatus: new FormControl(),
      adminPosted: new FormControl(),
      adminExpirtaion: new FormControl(),
      adminDescription: new FormControl(),
    });
    console.log("constructor");
    this.loadGetAnnouncementsType();
  }

  ngOnInit(): void {
    console.log("ngOnInit");
    this.currentLoggedUser = sessionStorage.getItem('displayName');    
  }

  loadFilterData(data) {
    for(const obj of this.announceFormModal) {
      switch(obj.column) {
        case 'Type':
          obj.value = data;
      }
    }

  }

  loadGetAnnouncements(){
    this.isShowSpinner = true;
    this.adminService.getAnnouncements().subscribe((data) =>{
      let getData:any = data;
      let pushData : any = [];
      getData.forEach(function(item: any){
        if(item.isActive) {
          let status:string = item.isHidden;
          if(!status){
            status = 'Show'
          } else{
            status = 'Hide'
            }
          let tableModel: any = {
            id: item.id,
            title : item.title,
            //type : this.populateDropDownCode(this.announceType, item.typeId, "name", "id"),
            type : this.populateDropDownCode(this.announceType, item.typeId, "name", "id"),
            status : status,
            createdDateTime : item.createdDateTime,
            createdUser : item.createdUser,
            description : item.description,
            lastUpdateDateTime: datePipe.transform(item.lastUpdateDateTime, 'MM/dd/yyyy'),
            lastUpdateUser: item.lastUpdateUser,
            effectiveFrom : item.effectiveFrom,
            effectiveTo : item.effectiveTo,
            announcementUrl: item.announcementUrl,
            previewIcon: item.announcementUrl
          };
          pushData.push(tableModel);
        }
      }.bind(this))

      var lastupdateDdata = pushData.sort(function(a, b){
        var dateA:any = new Date(a.lastUpdateDateTime), dateB:any = new Date(b.lastUpdateDateTime)
        return dateB-dateA 
      })

      this.taskDataSource = lastupdateDdata;
      this.taskDatalen = this.taskDataSource.length;
      this.dataSource = new MatTableDataSource(lastupdateDdata);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isShowSpinner = false;
      this.uniqueFunction();
      // const dddd = this.populateDropDownCode(this.announceType, 1, "name", "id");
    });



  }

  loadGetAnnouncementsType(){
    this.isShowSpinner = true;
    this.adminService.getAnnouncementsType().subscribe((data) =>{
      this.announceType = data;
      this.loadFilterData(data);
      this.loadGetAnnouncements();
    });
  }

  editData(item:any) {
    console.log("editData");
    this.elementIsEdit = true;
  }

  isValidURL(url){
    if(!this.isValidEm){
      this.isValidEm = document.createElement('input');
      this.isValidEm.setAttribute('type', 'url');
    }
    this.isValidEm.value = url;
    return this.isValidEm.validity.valid;
  }

  updateData(item:any) {
    this.elementIsEdit = false;
    const effectiveFrom = datePipe.transform(item.effectiveFrom, 'MM/dd/yyyy');
    const effectiveTo = datePipe.transform(item.effectiveTo, 'MM/dd/yyyy');
    this.isShowSpinner = true;
    const saveData:any = {
      id: item.id,
      title: item.title,
      typeId : this.populateDropDownCode(this.announceType, item.type, "id", "name"),
      isHidden: this.addItemForm.controls['adminStatus'].value === "Show" ? false : true,
      isActive: true,
      version: 1,
      createdDateTime : item.createdDateTime,
      createdUser : item.createdUser,
      description : item.description,
      effectiveFrom : effectiveFrom,
      effectiveTo : effectiveTo,
      announcementUrl: this.isValidURL(item.announcementUrl) ? item.announcementUrl : "http://"+item.announcementUrl,
      lastUpdateDateTime: this.currentdate,
      lastUpdateUser: this.currentLoggedUser
    }
    const effectiveFrom_test = datePipe.transform(this.addItemForm.controls['adminPosted'].value, 'MM/dd/yyyy');
    const effectiveTo_test = datePipe.transform(this.addItemForm.controls['adminExpirtaion'].value, 'MM/dd/yyyy');

    //this.isValidDate = this.validateDates(effectiveFrom_test, effectiveTo_test);
    this.isValidDate = true;
    if(this.isValidDate) {
      this.isShowSpinner = true;
      this.adminService.updateAnnouncements(saveData).subscribe( (data) => {
        this.isShowSpinner = false;
        this.loadGetAnnouncements();
      });
    } else{
      this.dialogConfig = {
        header: 'Error',
        action: 'errorPopup',
        message: this.error
      }
      const dialogRef = this.dialog.open(GlobalFormPopupComponent, {
        width: '681px',
        data: this.dialogConfig
      });

      dialogRef.afterClosed().subscribe((result) => {

      });
    }

  }


  validateDates(sDate: string, eDate: string){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
      this.error={isError:true,errorMessage:'Date of Post and Expiration date are required.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      this.error={isError:true,errorMessage:'Expiration date should be greater then Date of Post.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  uniqueFunction() {
    let tasklistdata = this.taskDataSource;
    let updateModifiDateArray = [];
    let updateModifiUserArray = [];
    let uniquePostedArray = [];
    let uniqueExpirtaionArray = [];
    for (let i in tasklistdata) {
      updateModifiDateArray.push(tasklistdata[i].lastUpdateDateTime);
      updateModifiUserArray.push(tasklistdata[i].lastUpdateUser);
      uniquePostedArray.push(tasklistdata[i].effectiveFrom);
      uniqueExpirtaionArray.push(tasklistdata[i].effectiveTo);
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
    this.uniqueModifiUser.reverse();

    this.uniquePosted = uniquePostedArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniquePosted.sort();
    this.uniquePosted.reverse();

    this.uniqueExpirtaion = uniqueExpirtaionArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueExpirtaion.sort();
    this.uniqueExpirtaion.reverse();

  }

  // ngAfterViewInit() {
  //   this.loadGetAnnouncements();
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  applyFilter(filterValue: string) {
    this.dataSource.filter = '';
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.toString().trim().toLowerCase();
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
        if (element.status === this.contentFilterForm.value.adminStatus) {
          console.log("adminStatus", this.contentFilterForm.value.adminStatus);
          console.log("element.status", element.status);
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.adminTitle != '' &&
        this.contentFilterForm.value.adminTitle != undefined &&
        this.contentFilterForm.value.adminTitle != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.title === this.contentFilterForm.value.adminTitle) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }


      if (
        this.contentFilterForm.value.adminPosted != '' &&
        this.contentFilterForm.value.adminPosted != undefined &&
        this.contentFilterForm.value.adminPosted != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.effectiveFrom === this.contentFilterForm.value.adminPosted) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.adminExpirtaion != '' &&
        this.contentFilterForm.value.adminExpirtaion != undefined &&
        this.contentFilterForm.value.adminExpirtaion != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.effectiveTo === this.contentFilterForm.value.adminExpirtaion) {
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
    this.taskDatalen = arrayContentData.length;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterPopShow = false;
  }

  resetFilterPop() {
    this.contentFilterForm.reset();

    this.dataSource = new MatTableDataSource(this.taskDataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addNew(): void {
    this.dialogConfig = {
      header: 'ADD NEW ANNOUNCEMENTS',
      formData: this.announceFormModal,
      action: 'addEditPopup'
    }
    const dialogRef = this.dialog.open(GlobalFormPopupComponent, {
      width: '681px',
      data: this.dialogConfig
    });

    const subscribeDialog = dialogRef.componentInstance.buttonEvent.subscribe((data) => {
      const addFormData = data.form.value;
      const effectiveFromData = datePipe.transform(addFormData.dateofpost, 'MM/dd/yyyy');
      const effectiveToData = datePipe.transform(addFormData.expirtaiondate, 'MM/dd/yyyy');
      const addElement = {
        title: addFormData.title,
        typeId: addFormData.type,
        description: addFormData.description,
        announcementUrl: this.isValidURL(addFormData.link) ? addFormData.link : "http://"+addFormData.link,
        isHidden: addFormData.status === "Show" ? false : true,
        isActive: true,
        version: 1,
        effectiveFrom: effectiveFromData,
        effectiveTo: effectiveToData,
        createdDateTime: this.currentdate,
        createdUser : this.currentLoggedUser,
        lastUpdateDateTime: this.currentdate,
        lastUpdateUser: this.currentLoggedUser
      }
      this.isShowSpinner = true;
      this.adminService.addAnnouncements(addElement).subscribe( (data) => {
        this.isShowSpinner = false;
        if(data){
          this.loadGetAnnouncements();
        }
      });
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  deleteData(item:any){
    this.dialogConfig = {
      action: 'deletePopup'
    }
    const dialogRef = this.dialog.open(GlobalFormPopupComponent, {
      data: this.dialogConfig
    });

    dialogRef.afterClosed().subscribe((result) => {
      if( result == 'Yes'){
        this.isShowSpinner = true;
        this.adminService.removeAnnouncements(item.id).subscribe( (data) => {
          this.isShowSpinner = false;
          if(data){
            this.loadGetAnnouncements();
          }
        });
      }
    });

  }

  populateDropDownCode(eName:any, eValue:any, eType: string, exType: string) {
    if(eValue && eName != undefined){
      if(exType === 'name') {
        const code = eName.filter(record => record[exType].toLowerCase() === eValue.toLocaleLowerCase())
        .map(record => record[eType]);
        return code[0]
      }
      else{
        const code = eName.filter(record =>  record[exType] === eValue)
        .map(record => record[eType]);
        return code[0];
      }
    }

  }

}
