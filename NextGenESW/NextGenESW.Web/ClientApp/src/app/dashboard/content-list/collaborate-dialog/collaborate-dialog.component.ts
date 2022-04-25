import { Component, OnInit, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollaborateDialogService } from './collaborate-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map, finalize } from 'rxjs/operators';
import { User, DialogData } from '../content-list.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SharedService } from '@app/shared/shared.service';
import { Constants } from '@environments/constants'
import { ContextService } from '../../../shared/component/global-panel/context/context.service';


@Component({
  selector: 'app-collaborate',
  templateUrl: './collaborate-dialog.component.html',
  styleUrls: ['./collaborate-dialog.component.scss'],
})
export class CollaborateDialogComponent implements OnInit {
  filter = '';
  saveRequest: any;
  users: User[] = [];
  askToCoAuthorRequest: any;

  currentUserEmail;
  //$filteredUsers: Observable<User[]>;

  filterControl = new FormControl();

  selectedUsers: User[];
  // selectedUser: User;
  selectedAction: string;

  docTitle: string;
  docId: number;
  docUrl: string;
  contentType: string;
  userNames: string[] = [];
  userEmails: string[] = [];
  filteredCoauthor: Observable<any[]>;
  coauthors: any = [];
  coAuthorResponse: any;
  userActiveDirectory: any;
  collaborateUserForm: FormGroup;
  message = 'Invite Someone to Collaborate';
  contentTypes: any;
  email: any;
  name: any;

  /* New  */
  userLists: User[];

  formControls = {
    coauthor: '',
    description: '',
    permission: ''
  }
  displayedColumns: string[] = ['user', 'delete', 'permission'];
  getCoauthorList: any = [];
  coauthorList$: any = [];
  coauthorListData$: any = [];
  outsourceable: any;
  exportAuthorityId: any;
  contentData: any;
  selectedcontentOwner: any;
  globalContent: any;
  userDisplayName: any;
  constructor(
    private collaborateService: CollaborateDialogService,
    public dialogRef: MatDialogRef<CollaborateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private sharedData: SharedService,
    private contextService: ContextService,

  ) {

    console.log("collaborate", data);
    this.docTitle = data.doc.title;
    this.docId = data.doc.id;
    this.docUrl = data.doc.url;
    this.contentType = data.doc.contentType;
    this.outsourceable = data.doc.outsourceable ? ((data.doc.outsourceable == 'Yes') || (data.doc.outsourceable == true)) : false;
    this.exportAuthorityId = data.doc.exportAuthorityId ? data.doc.exportAuthorityId : '';
    this.contentData = (data.doc.contentData) ? data.doc.contentData : '';
    this.collaborateUserForm = this.fb.group(this.formControls);
    collaborateService.retrieveUsers().subscribe((res) => {
      // this.message = '';
      this.userLists = res;
    });
    this.userDisplayName = (sessionStorage.getItem('displayName')) ? sessionStorage.getItem('displayName') : ''
    this.currentUserEmail = sessionStorage.getItem('userMail');
  }

  ngOnInit(): void {
    if (this.contentType === 'WI' || this.contentType === 'DS' || this.contentType === 'GB') {
      this.getActiveDirectoryUser();
    }
      let tempAuthorList = [];
      this.collaborateService.getUserLists(this.contentData.contentId, sessionStorage.userMail, this.userDisplayName, this.docId).subscribe((response) => {
        //console.log(response)
        this.getCoauthorList.push(response);
        this.coauthorList$ = this.getCoauthorList[0];

        this.coauthorListData$ = this.getCoauthorList[0].filter((node) => {
         if(node.actionName !="comment") {
           return node
         }
        });
        //console.log("collaborate", this.coauthorList$);
      })
  }

  getActiveDirectoryUser() {
    this.collaborateService.getUserListsActiveDirectory(this.docId, this.contentType).subscribe((response) => {
      this.userActiveDirectory = response;
      console.log(response)
      if (this.userActiveDirectory && this.userActiveDirectory.length) {
        let updatedRes = []
        this.userActiveDirectory.forEach(val => {
          let user = {};
          user['actionName'] = val.userPermission.toLowerCase();
          user['userName'] = val.userName;
          user['userEmail'] = val.userEmail;
          user['itemId'] = val.itemId;
          user['documentType'] = this.contentType;
          console.log(val.userPermission.toLowerCase())
          updatedRes.push(user);
        })
        // this.getCoauthorList = updatedRes;
        // this.coauthorList$ = updatedRes;
      }
    });
  }

  //WIP - Post
  doPost() {
    var formData = {
      docId: this.docId,
      docUrl: this.docUrl,
      docName: this.docTitle,
      docAction: this.selectedAction,
      // userName: this.selectedUser.userName, //for single user
      // userEmail: this.selectedUser.userEmail, //for single user
      users: this.selectedUsers, //for multiple users
    };
    this.message = 'Sharing, Please Wait';
    this.collaborateService.shareDoc(formData).subscribe((res) => {
      this.dialogRef.close();
      this.dialogRef.afterClosed().subscribe((result) => {
        this._snackBar.open("'" + this.docTitle + "' shared", 'x', {
          duration: 5000,
        });
      });
    });
  }

  changePermission(event, element) {
    element.actionName = event;
    this.collaborateService.updateUserPermission(element).subscribe((response) => {
      console.log(response);
    });
  }

  deletePermission(element) {
    if (this.contentType === 'WI' || this.contentType === 'DS' || this.contentType === 'GB') {
      this.sharedData.getUserProfileByEmail(element.user, Constants.apiQueryString).subscribe((userProfileData) => {
        const payload ={
          AADid: userProfileData.aadId,
          itemId: this.docId,
          documentType: this.contentType,
          userEmail: element.user
        }
        console.log("delete payload----->", payload);
        this.collaborateService.deleteActiveDirectoryUserPermission(payload).subscribe(() => {
          this.getActiveDirectoryUser();
        });
      });
    } else {
      this.collaborateService.deleteUserPermission(element).subscribe(()=>{
        this.collaborateService.getUserLists(this.contentData.contentId, sessionStorage.userMail, this.userDisplayName, this.docId).subscribe((response) => {
          this.coauthorList$ = response;
          this.coauthorListData$ = response;
        });
      });
    }

  }

  hasDupsCoauthorDuplicate(array) {
    return array.map(value => value.userName)
      .some(function (value, index, a) {
        return a.indexOf(value) !== a.lastIndexOf(value);
      });
  }

  onChange() {
    const { coauthor: user, permission: actionName } = this.collaborateUserForm.value;
    let pushData = this.coauthorList$;
    if(user && actionName) {
      const data = {
        "actionName" : actionName,
        "userName": user
      }
      pushData =  pushData.concat(data);
      let hasDupsCoauthor= this.hasDupsCoauthorDuplicate(pushData);
      if(hasDupsCoauthor) {
         this.collaborateUserForm.controls['permission'].setErrors({'incorrect': true});
         pushData = pushData.slice(-1);
      } else {
        pushData = pushData.slice(-1);
        this.collaborateUserForm.controls['coauthor'].setErrors(null);
        this.collaborateUserForm.controls['permission'].setErrors(null);
      }
    }
  }

  filterCoauthor(name) {

    if (name?.length == 3) {
      this.collaborateService.retrieveCoauthor(name, this.exportAuthorityId, this.outsourceable).subscribe((response) => {
        this.coAuthorResponse = response;
        this.coauthors = this.coAuthorResponse;
        // this.coauthors = this.validateCoAuthors(this.coauthors);
        // console.log("this.coauthors", this.coauthors);
        //this.filteredCoauthor = of(this.coAuthorResponse.value);
        this.filteredCoauthor = of(this.coauthors);
        this.loadServices();
      });
    } else if (name?.length < 3) {
      this.filteredCoauthor = of([]);
    }

    if (typeof name !== 'object') {
      return this.coauthors.filter(coauthor =>
        coauthor.displayName.toLowerCase().indexOf(name.toLowerCase()) > -1);
    }

  }

  setUser(user) {
    this.email = user.email;
    this.name = user.displayName;
  }

  loadServices() {
    this.filteredCoauthor = this.collaborateUserForm.controls.coauthor.valueChanges
      .pipe(startWith(''),
        map(coauthor => coauthor ? this.filterCoauthor(coauthor) : this.coauthors.slice()));
  }

  validateCoAuthors(coAuthorObj) {
    let initialObj = coAuthorObj;
    let obj1 = [];
    let finalObj = [];
    let flag;
    initialObj.forEach(element => {
      if (element.displayName && element.email && (!element.displayName.includes("@hcl.com"))) {
        if (element.email != this.currentUserEmail) {
          obj1?.push(element);
        }
      }
    });
    let currentVal = this.coauthorList$;
    Object.keys(obj1).forEach(element => {
      flag = 0;
      Object.keys(currentVal).forEach(val => {
        if (currentVal[val]?.userName == obj1[element]?.displayName) {
          flag = flag + 1;
        }
      });
      if (flag == 0) {
        finalObj.push(obj1[element]);
      }
    });

    return finalObj;
  }
  displayCoAuthor(coAuthor?: string) {
    return coAuthor ? coAuthor : '';
  }

  //  getNameFromEID(name){
  //   this.selectedcontentOwner = name;
  //    this.sharedData.getUserProfileByEmail(this.selectedcontentOwner, Constants.apiQueryString).subscribe((userProfileData) => {
  //     return of(userProfileData['displayName']);
  //   });
  // }

  sendInvite() {
    //  let contentAuthName: any = '';
    //  let contentOwnName: any = ''
    //  this.sharedData.getUserProfileByEmail(this.contentData.author, Constants.apiQueryString).subscribe((userProfileData) => {
    //   contentAuthName = userProfileData['displayName'];
    // });

    let content;
    let tempName = this.collaborateUserForm.value.coauthor;
    let currentSelection;
    let repeatedName = 0
    if (tempName) {
      currentSelection = this.coauthors.filter(coauthor => coauthor.displayName.toLowerCase().indexOf(tempName.toLowerCase()) > -1);
    }
    // if (currentSelection) {
    //   this.coauthorList$.forEach(element => {
    //     if (element.userName == this.name) {
    //       repeatedName = repeatedName + 1;
    //     }
    //   });
    //   if (repeatedName != 0) {
    //     return;
    //   }
    // }
    // this.sharedData.getUserProfileByEmail(this.contentData.contentOwnerId, Constants.apiQueryString).subscribe((userProfileData) => {
    //   console.log(' owner nme',userProfileData['displayName']);
    //   contentOwnName = userProfileData['displayName'];
    // });
    this.collaborateService.getContentTypes().subscribe((res) => {
      //console.log(res);
      this.contentTypes = res;

      content = this.contentTypes.filter((child) => {
        let contentType = this.contentType ? this.contentType.toLowerCase() : '';
        let childCode = child.code ? child.code.toLowerCase() : '';
        if (child.code &&  contentType === childCode) {
          return child.contentTypeId;
        }
      });
      if (this.contentType === 'K' || this.contentType === 'KP') {
        content = [{
          contentTypeId: 9
        }];
        // content[0].contentTypeId = 9;
      }
      //console.log("this.contentData",this.contentData);
      /* Ask to Author api call start here */
      const selectedCoAuthor = this.coauthors.filter(el => el.displayName == this.collaborateUserForm.controls.coauthor.value);

      this.askToCoAuthorRequest = {

        id: (this.docId) ? this.docId : '',
        contentId: (this.contentData.contentId) ? this.contentData.contentId : '',
        documentType: (this.contentType == "ToC") ? "TOC" : (this.contentType) ? this.contentType : '',
        title: (this.docTitle) ? this.docTitle : '',
        contentAuthorName: (this.contentData.author) ? this.contentData.author : this.contentData.creatorClockId,
        contentAuthorEmail: (this.contentData.author) ? this.contentData.author : this.contentData.creatorClockId,
        invitedCoAuthorName: (selectedCoAuthor[0]['displayName']) ? selectedCoAuthor[0]['displayName'] : '',
        invitedCoAuthorEmail: (selectedCoAuthor[0]['email']) ? selectedCoAuthor[0]['email'] : '',
        eswDiscipline: (this.contentData.disciplineCode) ? this.contentData.disciplineCode : '',
        //contentOwnerName: (this.contentData.contentOwnerName) ? this.contentData.contentOwnerName : (this.contentData.contentOwnerId) ? (this.contentData.contentOwnerId) : '',
        contentOwnerName: (this.contentData.contentOwnerMail) ? this.contentData.contentOwnerMail : (this.contentData.contentOwnerId) ? (this.contentData.contentOwnerId) : '',
        contentOwnerEmail: (this.contentData.contentOwnerMail) ? this.contentData.contentOwnerMail : (this.contentData.contentOwnerId) ? (this.contentData.contentOwnerId) : '',
        contentAuthorComments: "NA"
      }
      /* Ask to Author api call end here */
      console.log('this.contentData',this.contentData);
      this.saveRequest = {
        docId: this.docId,
        docUrl: this.docUrl,
        docName: this.docTitle,
        docAction: this.collaborateUserForm.controls.permission.value,
        permission: this.collaborateUserForm.controls.permission.value,
        user: {
          UserName: this.name,
          UserEmail: this.email
        },
        contentTypeId: content[0].contentTypeId,
        contentType: this.contentType,
        createdOn: new Date(),
        creatorClockId: sessionStorage.userMail,
        contentId: this.contentData.contentId,
        assetStatusId: this.contentData.assetStatusId,
        version: this.contentData?.versionNumber || this.contentData?.version
      }
      if (this.contentType === 'WI' || this.contentType === 'DS' || this.contentType === 'GB') {
        const selectedCoAuthor = this.coauthors.filter(el => el.displayName == this.collaborateUserForm.controls.coauthor.value);
        /* Ask to Author api call start here */
        this.collaborateService.askToCoAuthor(this.askToCoAuthorRequest).subscribe((res) => {
          //console.log("askToCoAuthorRequest res", res);
        });
        /* Ask to Author api call end here */
        this.collaborateService.shareWeb(this.saveRequest).subscribe((res) => {
          this.collaborateService.getUserLists(this.contentData.contentId, sessionStorage.userMail, this.userDisplayName, this.docId).subscribe((response) => {
            this.coauthorList$ = response;
          });
        });
        this.sharedData.getUserProfileByEmail(this.email, Constants.apiQueryString).subscribe((userProfileData) => {
          this.saveRequest.AADid = userProfileData.aadId;
          this.collaborateService.shareWebActiveDirectory(this.saveRequest).subscribe((res) => {
            this.getActiveDirectoryUser();
          });
        });
      } else if (this.contentType === 'CD' || this.contentType === 'AP' || this.contentType === 'CG' || this.contentType === 'KP' || this.contentType === 'ToC' || this.contentType === 'RC' || this.contentType === 'SF' || this.contentType === 'TOC' || this.contentType === 'SP' ) {
        const selectedCoAuthor = this.coauthors.filter(el => el.displayName == this.collaborateUserForm.controls.coauthor.value);

        /* Ask to Author api call start here */
        this.collaborateService.askToCoAuthor(this.askToCoAuthorRequest).subscribe((res) => {
          //console.log("askToCoAuthorRequest res", res);
        });
        /* Ask to Author api call end here */
        //console.log("this save request", this.saveRequest);
        this.collaborateService.shareWeb(this.saveRequest).subscribe((res) => {
          this.collaborateService.getUserLists(this.contentData.contentId, sessionStorage.userMail, this.userDisplayName, this.docId).subscribe((response) => {
            this.coauthorList$ = response;
          });
        });
      }
      // else if (this.contentType === 'Map' || this.contentType === 'M' || this.contentType === 'm' || this.contentType === 'map' || this.contentType === 'ProcessMaps' || this.contentType === 'processmaps') {

      //   this.saveRequest = {
      //     docId: this.docId,
      //     docUrl: this.docUrl,
      //     docName: this.docTitle,
      //     docAction: this.collaborateUserForm.controls.permission.value,
      //     permission: this.collaborateUserForm.controls.permission.value,
      //     user: {
      //       UserName: this.name,
      //       UserEmail: this.email
      //     },
      //     contentTypeId: content[0].contentTypeId,
      //     contentType: this.contentType,
      //     createdOn: new Date(),
      //     creatorClockId: sessionStorage.userMail
      //   }
      //   // console.log(this.saveRequest);
      //   if (this.saveRequest) {
      //     if (this.saveRequest.user.UserName == undefined) {
      //       console.log("Undefined Name found");
      //       return;
      //     }
      //     if (this.saveRequest.user.UserEmail == undefined) {
      //       console.log("Undefined Email found");
      //       return;
      //     }
      //   }
      //   this.collaborateService.shareWeb(this.saveRequest).subscribe((res) => {
      //     this.collaborateService.getUserLists(this.contentData.contentId, sessionStorage.userMail, this.userDisplayName).subscribe((response) => {
      //       this.coauthorList$ = response;
      //     });
      //   });
      // }
      this.collaborateUserForm.reset();

      setTimeout(() => {
        this.dialogRef.close();
      }, 3000);

    });
  }
}
