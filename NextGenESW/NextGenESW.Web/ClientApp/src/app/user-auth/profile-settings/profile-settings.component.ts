import { environment } from './../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
//import { User, DialogData } from '../content-list.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  filter = '';

  //users: User[] = [];

  //$filteredUsers: Observable<User[]>;

  filterControl = new FormControl();

  //selectedUsers: User[];
  //selectedUser: User;
  selectedAction: string;

  docName: string;
  docTitle: string;
  docId;
  docMail: string;
  docPhone;
  userNames: string[] = [];
  userEmails: string[] = [];
  surname: string;
  givenName: string;
  aadId;
  clockId;
  departmentName
  displayName
  eksgroupMembership;
  email;
  firstName;
  globalUId;
  isPWEmployee;
  lastName;
  ldapId;
  majorBusinessUnitName;
  majorDepartmentName;
  nationality;
  rtxId;
  telephoneNumber;
  workDayId;

  //doc: { id: profileUsers.id, title: profileUsers.jobTitle, mail: profileUsers.mail, phone: profileUsers.mobilePhone  },

  message = 'Loading Users, Please Wait';
  memberShipGroup: string;

  userTypes = [
    {
      name: 'Content Creator',
      isChecked: false,
    },
    {
      name: 'Content Owner/Approver',
      isChecked: false,
    },
    {
      name: 'Task Creator',
      isChecked: false,
    },
    {
      name: 'Task Execution User',
      isChecked: false,
    },
    // {
    //   name: 'Deviation Approver',
    //   isChecked: false,
    // },
    {
      name: 'System Administrator',
      isChecked: false,
    },
  ];

  /* New  */
  //userLists: User[];

  constructor(
    public dialogRef: MatDialogRef<ProfileSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _snackBar: MatSnackBar
  ) {
    this.docTitle = data.doc.title;
    this.docId = data.doc.id;
    this.docMail = data.doc.mail;
    this.docPhone = data.doc.phone;
    this.docName = data.doc.name;
    this.surname = data.doc.surname;
    this.givenName = data.doc.givenName;

    this.aadId = data.doc.aadId;
    this.clockId = data.doc.clockId;
    this.departmentName = data.doc.departmentName;
    this.displayName = data.doc.displayName;
    this.eksgroupMembership = data.doc.eksgroupMembership;
    this.email = data.doc.email;
    this.firstName = data.doc.firstName;
    this.globalUId = data.doc.globalUId;
    this.lastName = data.doc.lastName;
    this.ldapId = data.doc.ldapId;
    this.majorBusinessUnitName = data.doc.majorBusinessUnitName;
    this.majorDepartmentName = data.doc.majorDepartmentName;
    this.nationality = data.doc.nationality;
    this.rtxId = data.doc.rtxId;
    this.isPWEmployee = data.doc.isPWEmployee;
    this.telephoneNumber = data.doc.telephoneNumber;
    this.workDayId = data.doc.workDayId;


    this.userTypes.map(function (item) {
      let userProfileData = JSON.parse(
        sessionStorage.getItem('userProfileData')
      );

      let groups = userProfileData.eksgroupMembership;

      let groupsArray = groups.split(',');

      if (
        groupsArray.indexOf(environment.eksContentManagementGroup) !== -1 &&
        item.name === 'Content Creator'
      ) {
        item.isChecked = true;
      }

      if (
        groupsArray.indexOf(environment.eksGroup) !== -1 &&
        item.name === 'Content Owner/Approver'
      ) {
        item.isChecked = true;
      }

      if (
        groupsArray.indexOf(environment.eksAdminGroup) !== -1 &&
        item.name === 'System Administrator'
      ) {
        item.isChecked = true;
      }
    });
  }

  ngOnInit(): void {
    //console.log(' in profile',this.data);
  }

  //WIP - Post
  doPost() {
    //console.log(this.selectedUsers);
    var formData = {
      docId: this.docId,
      docMail: this.docMail,
      docName: this.docTitle,
      docAction: this.selectedAction,
      // userName: this.selectedUser.userName, //for single user
      // userEmail: this.selectedUser.userEmail, //for single user
      //users: this.selectedUsers, //for multiple users
    };
    this.message = 'Sharing, Please Wait';
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
