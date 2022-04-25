import { Component, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GlobalFormPopupComponent } from '../../../app/shared/component/global-form-popup/global-form-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from "../admin.service";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface Profile {
  firstname: string;
  lastname: string;
  clockId: any;
  userData: any;
}

export interface announceTableList {
  Title: string;
  Type: string;
  Status: string;
  CreatedModifiedDate: number;
  CreatedModifiedBy: string;
  description: string;
  dateofpost: string;
  expirationdate: string;
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'Department',
    children: [
      { name: 'EDSI' },
      { name: 'Finance' }
    ]
  },
  {
    name: 'Business Unit',
    children: [
      { name: 'Name Sound Like' },
      { name: 'Azure ID' }
    ]
  },
  {
    name: 'Roles',
    children: []
  },
  {
    name: 'Permission Roles',
    children: []
  },
  {
    name: 'Country',
    children: []
  },
  {
    name: 'Site Location',
    children: [
      { name: 'Export Controlled' },
      { name: 'Classifier' },
      { name: 'ACL' },
      { name: 'Employer' },
      { name: 'Employment Status' }
    ]
  },
];



@Component({
  selector: 'app-admin-master-search',
  templateUrl: './admin-master-search.component.html',
  styleUrls: ['./admin-master-search.component.scss']
})
export class AdminMasterSearchComponent implements OnInit {

  columnsConfig: Array<any> = [
    { header: 'Select', value: 'selectID', action: 'checkbox', sorting: 'none' },
    { header: 'Clock ID', value: 'clockId', action: 'text' },
    { header: 'First Name', value: 'firstName', action: 'text' },
    { header: 'Last Name', value: 'lastName', action: 'text' },
    { header: 'Display Name', value: 'displayName', action: 'text' },
    { header: 'Department', value: 'departmentName', action: 'text' },
    { header: 'Email', value: 'email', action: 'text' },
    //{ header: 'Role', value: 'role', action:'text'},
    { header: 'View', value: 'previewIcon', action: 'preview', sorting: 'none' }
  ];
  basicSearchConfig: Array<any> = [
    { header: 'Clock ID', value: 'clockId', formControlName: 'clockId' },
    { header: 'Display Name', value: 'displayName', formControlName: 'displayName' },
    { header: 'First Name', value: 'firstName', formControlName: 'firstName' },
    { header: 'Last Name', value: 'lastName', formControlName: 'lastName' },
    { header: 'Email', value: 'email', formControlName: 'email' }
  ];
  masterSearchConfig: Array<any> = [
    { header: 'Clock ID', value: 'clockid', formControlName: 'EDSI' },
    { header: 'Display Name', value: 'displayname', formControlName: 'Finance' },
    { header: 'First Name', value: 'firstname', formControlName: 'Name Sound Like' },
    { header: 'Last Name', value: 'lastname', formControlName: 'Azure ID' },
    { header: 'Phone No', value: 'phoneno', formControlName: 'Export Controlled' },
    { header: 'Email', value: 'email', formControlName: 'Classifier' },
    { header: 'Last Name', value: 'lastname', formControlName: 'ACL' },
    { header: 'Phone No', value: 'phoneno', formControlName: 'Employer' },
    { header: 'Email', value: 'email', formControlName: 'Employment Status' }
  ];
  dataSourceList: MatTableDataSource<announceTableList>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('formBasicDirective') private formBasicDirective: NgForm;
  @ViewChild('formAdvanceDirective') private formAdvanceDirective: NgForm;
  displayedColumnKeys: string[];
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  scheduleUpdateForm: FormGroup;
  masterBasicSearchForm: FormGroup;
  masterAdvanceSearchForm: FormGroup;
  profileList: Profile[] = [];
  showselected: boolean;
  dialogConfig: any;
  masterSearchProfile: boolean;
  masterProfileList: boolean;
  selected = -1;
  isShowSpinner: boolean = false;
  searchInput: any = '';
  contentFilterArray = [];
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  pushData1: any = [];
  constructor(public dialog: MatDialog,
    public adminService: AdminService,
    private formBuilder: FormBuilder) {
    this.getAllUserData();
    this.dataSource.data = TREE_DATA;


    this.displayedColumnKeys = this.columnsConfig.map(col => col.value);

    let basicSearch = {};
    for (let i = 0; i < this.basicSearchConfig.length; i++) {
      basicSearch[this.basicSearchConfig[i].formControlName] = new FormControl('');
    }
    this.masterBasicSearchForm = new FormGroup(basicSearch);
    let advanceSearch = {};
    for (let i = 0; i < this.masterSearchConfig.length; i++) {
      advanceSearch[this.masterSearchConfig[i].formControlName] = new FormControl('');
    }
    this.masterAdvanceSearchForm = new FormGroup(advanceSearch);
    this.masterSearchProfile = true;
  }



  ngOnInit(): void { }


  getAllUserData() {
    this.isShowSpinner = true;
    this.adminService.getAllUserProfile().subscribe((data) => {
      this.pushData1 = data;
      this.dataSourceList = new MatTableDataSource(this.pushData1);
      this.dataSourceList.paginator = this.paginator;
      this.dataSourceList.sort = this.sort;
      let group = {};
      for (let i = 0; i < this.pushData1.length; i++) {
        group['clockID_' + this.pushData1[i].clockId] = new FormControl('');
      }
      this.scheduleUpdateForm = new FormGroup(group);
      this.isShowSpinner = false;
    });
  }

  onSearchSubmit() {
    this.profileList = [];
    this.showselected = false;
    this.masterSearchProfile = true;
    this.masterProfileList = false;
    this.scheduleUpdateForm.reset();
    console.log("this.masterBasicSearchForm.value", this.masterBasicSearchForm.value);
    let formclockId = this.masterBasicSearchForm.value.clockId;
    let formdisplayName = this.masterBasicSearchForm.value.displayName;
    let formfirstName = this.masterBasicSearchForm.value.firstName;
    let formlastName = this.masterBasicSearchForm.value.lastName;
    let formemail = this.masterBasicSearchForm.value.email;
    this.dataSourceList.data = [];
    let arrayContentData = [];
    this.contentFilterArray = [];
    let dataholders = this.pushData1;
    if(this.searchInput.length > 0){
      dataholders.forEach((element) => {
        let emptyFlag = '';
        let checkingFlag = '';
        console.log("this.searchInput", this.searchInput);
        if ((formclockId == null || formclockId == '') &&
          (formdisplayName == null || formdisplayName == '') &&
          (formfirstName == null || formfirstName == '') &&
          (formlastName == null || formlastName == '') &&
          (formemail == null || formemail == '')) {
  
          let userDataList: any = [element];
          let userClockId = userDataList.filter(user => user.clockId.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          let userDisplayName = userDataList.filter(user => user.displayName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          let userFirstName = userDataList.filter(user => user.firstName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          let userLastName = userDataList.filter(user => user.lastName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          let userdepartmentName = userDataList.filter(user => user.departmentName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          let userEmail = userDataList.filter(user => user.email.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          let userNationality = userDataList.filter(user => user.nationality.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase());
          if (userClockId.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else if (userDisplayName.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else if (userFirstName.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else if (userLastName.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else if (userdepartmentName.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else if (userEmail.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else if (userNationality.length > 0) {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '1';
          } else {
            emptyFlag = emptyFlag + '1';
            checkingFlag = checkingFlag + '0';
          }
  
        }
  
        else {
  
          if (formclockId) {
            emptyFlag = emptyFlag + '1';
            if (element.clockId.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase()) {
              checkingFlag = checkingFlag + '1';
            } else {
              checkingFlag = checkingFlag + '0';
            }
  
          } else {
            emptyFlag = emptyFlag + '0';
            checkingFlag = checkingFlag + '0';
          }
  
          if (formdisplayName) {
            emptyFlag = emptyFlag + '1';
            if (element.displayName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase()) {
              checkingFlag = checkingFlag + '1';
            } else {
              checkingFlag = checkingFlag + '0';
            }
          } else {
            emptyFlag = emptyFlag + '0';
            checkingFlag = checkingFlag + '0';
          }
  
          if (formfirstName) {
            emptyFlag = emptyFlag + '1';
            if (element.firstName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase()) {
              checkingFlag = checkingFlag + '1';
            } else {
              checkingFlag = checkingFlag + '0';
            }
          } else {
            emptyFlag = emptyFlag + '0';
            checkingFlag = checkingFlag + '0';
          }
  
          if (formlastName) {
            emptyFlag = emptyFlag + '1';
            if (element.lastName.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase()) {
              checkingFlag = checkingFlag + '1';
            } else {
              checkingFlag = checkingFlag + '0';
            }
          } else {
            emptyFlag = emptyFlag + '0';
            checkingFlag = checkingFlag + '0';
          }
  
          if (formemail) {
            emptyFlag = emptyFlag + '1';
            if (element.email.trim().replace(" ", "").toLowerCase() === this.searchInput.trim().replace(" ", "").toLowerCase()) {
              checkingFlag = checkingFlag + '1';
            } else {
              checkingFlag = checkingFlag + '0';
            }
          } else {
            emptyFlag = emptyFlag + '0';
            checkingFlag = checkingFlag + '0';
          }
  
  
        }
  
        if (emptyFlag == checkingFlag) {
          this.contentFilterArray.push(element);
        }
  
  
  
      });
  
      arrayContentData = this.contentFilterArray;
      this.dataSourceList = new MatTableDataSource(arrayContentData);
      this.dataSourceList.paginator = this.paginator;
      this.dataSourceList.sort = this.sort;
    } else{
      this.dataSourceList = new MatTableDataSource(this.pushData1);
      this.dataSourceList.paginator = this.paginator;
      this.dataSourceList.sort = this.sort;
    }
    
  }

  resetFilterPop() {
    this.searchInput = '';
    this.masterBasicSearchForm.reset();
    this.dataSourceList = new MatTableDataSource(this.pushData1);
    this.dataSourceList.paginator = this.paginator;
    this.dataSourceList.sort = this.sort;
  }

  addUserList(event: MatCheckboxChange, elementData): void {
    const dataList: any = elementData;
    const checked = event.checked;
    if (dataList && checked) {
      this.profileList.push({
        firstname: dataList.firstName,
        lastname: dataList.lastName,
        clockId: dataList.clockId,
        userData: dataList
      });
    } else {
      this.removeUserList(dataList);
    }
    if (this.profileList.length > 0) {
      this.showselected = true;
    }

  }

  removeUserList(profile: any): void {
    const clockid = 'clockID_';
    const controlName = clockid.concat(profile.clockId);
    this.scheduleUpdateForm.controls[controlName].setValue("")
    const index = this.profileList.findIndex((element, index) => {
      if (element.clockId === profile.clockId) {
        return true
      }
    })
    if (index >= 0) {
      this.profileList.splice(index, 1);
    }
    if (this.profileList.length > 0) {
      this.showselected = true;
    } else {
      this.showselected = false;
    }
  }

  resetSearchForm(formName: string) {

    if (formName == 'masterAdvanceSearchForm') {
      this.masterBasicSearchForm.reset();
    } else {
      this.masterAdvanceSearchForm.reset();
      this.masterBasicSearchForm.reset();
    }
  }

  showSelectedUser() {
    this.masterSearchProfile = false;
    this.masterProfileList = true;
  }

  backSelectedUser() {
    this.masterSearchProfile = true;
    this.masterProfileList = false;
    this.scheduleUpdateForm.reset();
    this.searchInput = '';
    this.masterBasicSearchForm.reset();
    this.masterAdvanceSearchForm.reset();
    this.profileList = [];
    if (this.profileList.length > 0) {
      this.showselected = true;
    } else {
      this.showselected = false;
    }
    this.getAllUserData();

  }

  viewProfileUser(item: any) {
    this.dialogConfig = {
      header: 'PROFILE DETAILS',
      formData: item,
      action: 'viewPopup'
    }
    const dialogRef = this.dialog.open(GlobalFormPopupComponent, {
      width: '681px',
      data: this.dialogConfig
    });


    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onProfileExportXls() {
    let getData: any = this.profileList;
    let exportData: any = [];
    getData.forEach(function (item: any) {
      exportData.push(item.userData.globalUid);
    }.bind(this))
    this.adminService.getUserProfileExportXls(exportData)
      .subscribe((resultBlob: Blob) => {
        const downloadURL = URL.createObjectURL(resultBlob);
        window.open(downloadURL);
      });
  }



}