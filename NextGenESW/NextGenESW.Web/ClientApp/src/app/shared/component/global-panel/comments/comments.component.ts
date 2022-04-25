import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  loading = false;
  displayedColumns: string[] = ['comments'];
  messageList$: any = [];
  comment: any;
  commetsData: any;
  isShowCommets: boolean = false;
  addComments = '';
  finalInitial: string = '';
  email = "";
  childCommentData = '';

  overlayRef;

  date = new Date();

  b = {
  };
  childComments: string[] = [];
  lessonLearnedDataCopy = {
    comments: '',


  };
  status;
  isApprove;
  currentDate = new Date();
  dateFormate: string = "";
  displayName: string = "";
  propertiesFormData: FormGroup;
  showIcon: boolean = false;
  formControls = {
    addComments: '',
    childCommentData: ''
  }
  author;
  constructor(private globalService: GlobalService, private fb: FormBuilder) { }
  @Input() globalData: any;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatTable) table: MatTable<any>;
  ngOnInit(): void {
    this.propertiesFormData = this.fb.group(this.formControls);
    this.displayName = sessionStorage.getItem('displayName');
     this.email = sessionStorage.getItem('userMail');
   // alert(email);
    this.createInitials(this.displayName);
    console.log(this.displayName);
    //this.showIcon = this.globalData && this.globalData.contentOwnerId == this.email && this.globalData.assetStatusId == 3;
    if (this.globalData &&  this.globalData.author &&  this.globalData.createdUser) {
      this.createInitials(this.globalData.author ? this.globalData.author : this.globalData.createdUser);
      this.author = this.globalData.author ? this.globalData.author : this.globalData.createdUser;
    }
    //this.dateFormate = this.currentDate.toLocaleString([], { hour12: true });
    var today = new Date();
    var time = today.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
   // alert(time);

    this.dateFormate = today.toLocaleDateString()+" "+time;
    // let date =  this.formatAMPM(this.dateFormate);
    //  this.dateFormate = this.dateFormate +" "+ date;
    console.log("Date: ",this.dateFormate);
    if (this.globalData) {
      let globalId:number;
      let globalAsstetId:number;
      if(this.globalData.assetStatus === ('Current' || 'Published' )) {
        globalId = this.globalData.knowledgeAssetId;
        globalAsstetId = 2
      } else {
        globalId = this.globalData.id;
        globalAsstetId = this.globalData.originalAssetStatusId
      }
      this.globalService.fetchComments(this.globalData.contentType, globalId, globalAsstetId).subscribe((res) => {
        this.commetsData = res;

  
        this.messageList$ = res;
        //  this.messageList$ = this.messageList$.userid.replaceAll(' ','');

        this.messageList$ = this.messageList$.reverse();
        if (this.messageList$.childList) {
          this.messageList$.childList = this.messageList$.childList.reverse();
        }
        // this.messageList$ = this.commetsData;
        this.dataSource = new MatTableDataSource(this.messageList$);
        console.log("globalData------");
        console.log(this.messageList$);
      });
    }
  }

  addComment() {
    console.log("Add comments", this.propertiesFormData.value.addComments);
    console.log("comments:::globalData", this.globalData);
    if (this.globalData) {
      let comReq = {
        resourceType: this.globalData.contentType,
        resourceId: this.globalData.assetStatus === ('Current' || 'Published' ) ? this.globalData.knowledgeAssetId : this.globalData.id,
        Comments: this.propertiesFormData.value.addComments,
        ParentId: "0",
        Status: "Open",
        user: this.displayName,
        assetStatusId: this.globalData.originalAssetStatusId,
        version: this.globalData.version,
        //CreatedOn: this.date.getFullYear()+"/ "+this.date.getDate()+"/ "+this.date.getDay()+": "+this.date.getHours()+": "+this.date.getMinutes(),
        CreatedOn: this.dateFormate,
        CreatorClockId: this.email,
        assetStatus: this.globalData.assetStatus
      }
      let globalId:number;
      let globalAsstetId:number;
      if(this.globalData.assetStatus === ('Current' || 'Published' )) {
        globalId = this.globalData.knowledgeAssetId;
        globalAsstetId = 2
      } else {
        globalId = this.globalData.id;
        globalAsstetId = this.globalData.originalAssetStatusId
      }
      this.globalService.addComments(comReq).subscribe((res) => {
        this.globalService.fetchComments(this.globalData.contentType, globalId, globalAsstetId).subscribe((res) => {
          const data = JSON.parse(JSON.stringify(res));
          console.log(data);
          this.messageList$ = res;
          //    this.messageList$ = this.messageList$.userid.replaceAll(' ','');
          this.messageList$ = this.messageList$.reverse();
          if (this.messageList$.childList) {
            this.messageList$.childList = this.messageList$.childList.reverse();
          }
          console.log(this.messageList$);
          this.addComments = "";
        });
        this.addComments = "";
      });
      //this.addComments = '';
      this.propertiesFormData.reset();
    }

    // var copyInputObj = { ...this.lessonLearnedDataCopy };
    // copyInputObj['isCreate'] = true;
    //this.messageList$.push(copyInputObj);

    this.b['comment'] = this.addComments;
    this.b['isEdit'] = true;
    this.messageList$.push({ ...this.b });
    this.table.renderRows();
    // this.dataSource.data.unshift(copyInputObj);

  }
  childReply() {
    this.childComments['comment'] = this.childCommentData;
    this.messageList$.push({ ...this.childComments });
    this.table.renderRows();
  }
  cancelComment() {
    this.comment = '';
  }
  showCommets(): void {
    if (this.isShowCommets) {
      this.isShowCommets = false;
    } else {
      this.isShowCommets = true;
    }
  }

  reply(element: any) {
    this.childComments.push(this.propertiesFormData.value.childCommentData);
    console.log(element);
    if (this.globalData) {

      let comReq = {
        resourceType: this.globalData.contentType,
        resourceId: this.globalData.assetStatus === ('Current' || 'Published' ) ? this.globalData.knowledgeAssetId : this.globalData.id,
        //  childList: this.childComments,
        Comments: this.propertiesFormData.value.childCommentData,
        ParentId: element.contentCollaborationCommentsId,
        Status: "Open",
        user: this.displayName,
        assetStatusId: this.globalData.originalAssetStatusId,
        version: this.globalData.version,
        //CreatedOn: this.date.getFullYear()+"/ "+this.date.getDate()+"/ "+this.date.getDay()+": "+this.date.getHours()+": "+this.date.getMinutes(),
        CreatedOn: this.dateFormate,
        CreatorClockId: this.email,
        assetStatus : this.globalData.assetStatus
      }
      let globalId:number;
      let globalAsstetId:number;
      if(this.globalData.assetStatus === ('Current' || 'Published' )) {
        globalId = this.globalData.knowledgeAssetId;
        globalAsstetId = 2
      } else {
        globalId = this.globalData.id;
        globalAsstetId = this.globalData.originalAssetStatusId
      }
      this.globalService.addComments(comReq).subscribe((res) => {
        this.globalService.fetchComments(this.globalData.contentType, globalId, globalAsstetId).subscribe((res) => {
          this.commetsData = res;


          this.messageList$ = res;
          //  this.messageList$ = this.messageList$.userid.replaceAll(' ','');

          this.messageList$ = this.messageList$.reverse();
          if (this.messageList$.childList) {
            this.messageList$.childList = this.messageList$.childList.reverse();
          }
          // this.messageList$ = this.commetsData;
          this.dataSource = new MatTableDataSource(this.messageList$);
          console.log("globalData------");
          console.log(this.messageList$);
        });
      });
      this.comment = '';
    }
  }
  edit(row) {
    if (row.isEdit) {
      row.isEdit = false;
    } else {
      row.isEdit = true;
    }

  }

  createInitials(UserName) {

    let firstIntial = UserName.slice(0, 1);
    let secondvalue = UserName.split(' ')[1];
    let secondIntial = secondvalue ? secondvalue.slice(0, 1) : '';
    this.finalInitial = firstIntial + secondIntial;
    console.log("this.finalInitia :", this.finalInitial);



    // this.displayName = this.finalInitial;
  }
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  CloseCommentsBox():void{
    this.overlayRef.detach();
     // this.showComponent = null;
  }
  handleOnRequestApproval(el) {
    this.isApprove = el == 'approve';
    this.loading = true;
    const payload = { 
      resourceType: el.contentType,
      resourceId: el.id,
      user: el.createdUser,
      comments: this.comment,
      parentId: 0,
      status: "Open",
      createdOn: el.createdDateTime,
      creatorClockId: el.createdUser,
      assetStatusId: el.assetStatusId,
      version: el.version
    }
    this.globalService.sendApprovalRequest(this.isApprove, payload).subscribe((res) => {
      if(this.isApprove){
        this.status='Approved';
      }
      this.loading = false;
  },(error) => {
    console.error('There was an error!', error);
    this.loading = false;
  })
}
}
