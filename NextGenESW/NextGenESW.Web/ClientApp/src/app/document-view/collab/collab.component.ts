import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CollabService } from './collab.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';

export interface DialogData {
  users: User[];
  doc: { id: number; title: string; url: string };
}

export interface User {
  userName: string;
  userEmail: string;
}

export interface Doc {
  type?: any;
  id: number;
  name: string;
  status?: any;
  jc?: any;
  comments?: string[];
  updated?: Date;
  docUrl: string;
}

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.scss'],
})
export class CollabComponent implements OnInit {
  filter = '';

  users: User[] = [];

  $filteredUsers: Observable<User[]>;

  filterControl = new FormControl();

  selectedUsers: User[];
  selectedUser: User;
  selectedAction: string;

  docTitle: string;
  docId: number;
  docUrl: string;
  userNames: string[] = [];
  userEmails: string[] = [];

  message = 'Loading Users, Please Wait';

  constructor(
    private collabService: CollabService,
    public dialogRef: MatDialogRef<CollabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.docTitle = data.doc.title;
    //Retrive the list of Documents
    collabService.retrieveDocs().subscribe((response) => {
      var list = JSON.parse(response);
      for (var doc of list) {
        if (doc.title == this.docTitle) {
          this.docId = doc.id;
          this.docUrl = doc.docurl;
        }
      }
      console.log(this.docId);
      console.log(this.docUrl);
    });

    //Retrive the list of users
    collabService.retrieveUsers().subscribe((response) => {
      var list = JSON.parse(response);
      for (var user of list) {
        this.users.push({ userName: user.UserName, userEmail: user.UserEmail });
      }
      this.message = '';
      this.$filteredUsers = this.filterControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.userName)),
        map((userName) =>
          userName ? this._filter(userName) : this.users.slice()
        )
      );
    });
  }

  ngOnInit(): void {}

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(
      (user) => user.userName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  clearFilter() {
    this.filter = '';
  }

  //WIP - Post
  // On Submit Function to share doc
  doPost() {
    var obj = {
      docId: this.docId,
      docUrl: this.docUrl,
      docName: this.docTitle,
      docAction: this.selectedAction,
      users: this.selectedUsers, //for multiple users
    };
    this.message = 'Sharing, Please Wait';
    this.collabService.shareDoc(obj).subscribe((res) => {
      this.dialogRef.close();
    });
  }
}
