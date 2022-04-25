import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  OnInit,
  Inject,
  AfterViewInit,
  ElementRef,
  AfterContentInit
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { forkJoin, Subscription } from 'rxjs';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { KPacksService } from '@app/k-packs/k-packs.service';
import { kPackPhysics, kPackPurpose } from '@app/k-packs/k-packs.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  Constants,
  documentPath,
  oldContentTypeCode,
  contentTypeCode,
} from '@environments/constants';
import { element } from 'protractor';
import { InsertVideoComponent } from '@app/shared/component/insert-video/insert-video.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExternalLinkComponent } from '@app/toc/toc-details/toc-toc/external-link/external-link.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteComponent } from "@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component"

import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';


@Component({
  selector: 'app-k-packs-purpose',
  templateUrl: './k-packs-purpose.component.html',
  styleUrls: ['./k-packs-purpose.component.scss'],
})
export class KPacksPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  public screenWidth: any;
  public screenHeight: any;
  safeSrc: SafeResourceUrl;
  safeSrc1: SafeResourceUrl;
  safeSrc2: SafeResourceUrl;
  @Input() disableForm: boolean;
  @Input() kPacksPropertiesData: any;
  selectedIndex = 0;
  kPackData = [];
  dataSource = new MatTableDataSource();
  loading = false;
  private subscription: Subscription;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('myTemplate') myTemplate: TemplateRef<any>;
  //@ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('myDiv', { static: false }) myDiv: ElementRef;
  @ViewChild('myDiv1', { static: false }) myDiv1: ElementRef;
  @ViewChild('myDiv5', { static: false }) myDiv5: ElementRef;
  isFormDirty: boolean = false;
  //@ViewChild('myDiv2', { static: false }) myDiv2: ElementRef;
  kPackObj = {
    layout: 1,
    kPackDesign: {
      kPackDesign1: '',
      kPackDesign2: '',
      kPackDesign3: '',
    },
    purposeId: 0,
    ContentForPurposeId: 0,
    knowledgePackId: 0,
  };
  type: any;
  layoutSet: any;
  title: any;
  description: any;
  PurposeId: number;
  knowledgePackId: number;
  layoutSelected: boolean = true;
  addTextSelected: boolean = true;
  addTextSelected1: boolean = true;
  addTextSelected2: boolean = true;
  //colarrow: boolean = true;
  addVideoSelected: boolean = true;
  addVideoSelected1: boolean = true;
  addVideoSelected2: boolean = true;
  array: any =''
  addVideohttp: boolean = true;
  addVideohttp1: boolean = true;
  addVideohttp2: boolean = true;
  ContentForPurposeId: any;
  KnowledgePackId;
  previousRecords: any;
  srcURL: string;
  tabCode: any = 'Purpose';
  currentTabData: any;
  demo3;
  demo1;
  demo2;
  dataID
  displayName1: string = '';
  contentOwner1: any ='';
  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private activityPageService: ActivityPageService,
    private kPacksService: KPacksService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<InsertVideoComponent>,
    private rservice: RecordsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public model = {
    editorData: '<p>Hello, world!</p>',
  };
  displayedColumns: string[] = ['kPackDesign'];
  items = ['EKS Addons'];
  contentSelected: boolean = false;
  htmlContent = '';
  layoutFormat = {
    layout1: 'Layout1',
    layout2: 'Layout2',
    layout3: 'Layout3',
  };
  config: AngularEditorConfig = {
    sanitize: true,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'indent',
        'insertHorizontalRule',
        'clearFormatting',
        'outdent',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'backgroundColorPicker',
        'insertVideo',
        'fontSize','fontName','removeFormat',

      ],
    ],
  };

  config1: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '235px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'indent',
        'insertHorizontalRule',
        'clearFormatting',
        'outdent',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'backgroundColorPicker',
        'insertVideo',
        'fontSize','fontName','removeFormat',
      ],
    ],
  };

  checkFocusOut(){
    this.rservice.UpdateBroadcastMessage('false');
 }

 checkValueChange(){
    this.rservice.UpdateBroadcastMessage('true');
  }

  textEditorValue($event){

    console.log("=====")
    console.log($event)
    console.log("=====")
  }
  ngOnInit(): void {
    this.contentSelected = false;
    let setlayout = 1;
    // this.kPackData.push(this.kPackObj);
    // this.dataSource.data = this.kPackData;
    // this.subscription = this.activityPageService
    //   .getActivityWICDDocList()
    //   .subscribe((res) => {
    //     this.tocWICDdocList = res;
    //   });

    this.route.params.subscribe((param) => {
      //this.KnowledgePackId = parseInt(param.id);
      this.KnowledgePackId =
        this.kPacksPropertiesData && this.kPacksPropertiesData.knowledgePackId
          ? this.kPacksPropertiesData.knowledgePackId
          : '';

    });
    // if (this.KnowledgePackId > 0) {
    //   this.loadKPackPurpose();
    // }
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnChanges(event) {
    //console.log(' in ngOnChanges', this.kPacksPropertiesData.contentOwnerId);
    //console.log(' in purpose displayName1 ngOnChanges',sessionStorage.getItem('displayName'));
    //console.log(' userMail',sessionStorage.getItem('userMail'));
    this.KnowledgePackId =
      this.kPacksPropertiesData && this.kPacksPropertiesData.knowledgePackId
        ? this.kPacksPropertiesData.knowledgePackId
        : '';
    if (
      event.kPacksPropertiesData.currentValue &&
      event.kPacksPropertiesData.previousValue !=
        event.kPacksPropertiesData.currentValue
    ) {
      if (!(Object.keys(this.kPacksPropertiesData).length === 0)) {
        this.kPacksPropertiesData.assetStatusId =
          event.kPacksPropertiesData.currentValue.assetStatusId;
          this.kPacksPropertiesData.assetStatus =
          event.kPacksPropertiesData.currentValue.assetStatus;
        if (this.KnowledgePackId > 0) {
          if (this.kPacksPropertiesData.assetStatus === ASSET_STATUSES.PUBLISHED || this.kPacksPropertiesData.assetStatus === ASSET_STATUSES.CURRENT || this.kPacksPropertiesData.assetStatusId == 3) {
            this.loadKPackPurposePublish();
          } else {
            this.loadKPackPurpose();
          }
        }
      }
    }

    this.displayName1 = sessionStorage.getItem('userMail');
    this.contentOwner1 = this.kPacksPropertiesData?.contentOwnerId;
  }

  editEditor(event) {
    console.log(event);
    console.log(event.target);
  }

  setLayout(layoutStyle) {
    this.layoutSet = layoutStyle;
    if (this.description) {
      this.layoutSelected = false;
    }
  }

  addtext() {
    //if (this.title || this.description) {
    //}
  }

  verifyHtml($html){
  //837
   return  this.sanitizer.bypassSecurityTrustHtml( $html);
  }

  getKPackContent() {
    this.loading = true;
    this.previousRecords = this.dataSource.data;
    this.tabCode = 'Purpose';
    this.kPacksService.getPurposeData(this.KnowledgePackId).subscribe(
      (data) => {
        this.currentTabData = data;
        this.currentTabData = this.currentTabData.contentCollection;
        //var res = JSON.parse(JSON.stringify(data));
        var res = this.currentTabData;
        this.onLoaddata(data)
        const a = [];
        res.forEach((el) => {
          const KPData = {
            // rowData: this.ContentForPurposeId === el['contentForPurposeId'] ? 'edit' : 'readonly',
            rowData: this.previousRecords.some((pr) => {
              const knowledgePCID =
                pr.knowledgePackContentId | pr.KnowledgePackContentId;
              return knowledgePCID == el.knowledgePackContentId;
            })
              ? this.previousRecords.filter((el2) => {
                  const knowledgePCID =
                    el2.knowledgePackContentId | el2.KnowledgePackContentId;
                  if (knowledgePCID == el.knowledgePackContentId) {
                    return el2.rowData;
                  }
                })[0].rowData
              : 'edit',
            kPackDesign: {
              kPackDesign1: el['contentFirst'],
              kPackDesign2: el['contentSecond'],
              kPackDesign3: el['contentThird'],
            },
            layout: el['layoutType'],
            purposeId: el['purposeId'],
            contentForPurposeId: el['knowledgePackContentId'],
            knowledgePackContentId: el['knowledgePackContentId'],
            knowledgePackId: el['knowledgePackId'],
          };
          return a.push(KPData);
        });
        this.dataSource.data = a;

        console.log('xxxxxxxxxxxxxxxxxxxxxxx')
        console.log(this.dataSource.data)

        console.log('xxxxxxxxxxxxxxxxxxxxxxx')

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('There was an error!', error);
      }
    );
  }



    deleteVideo(row, kPackDesign,index) {
      if(confirm("Once deleted, Video will be Lost ")) {
        //console.log("Implement delete functionality here");
      if (kPackDesign === 'kPackDesign1') {
       this.addTextSelected = true;
       this.addVideoSelected = true;
       this.safeSrc = '';
       row.kPackDesign.kPackDesign1 = '';
     } else if (kPackDesign === 'kPackDesign2') {
       this.addVideoSelected1 = true;
       this.addTextSelected1 = true;
       //this.colarrow = true;
       this.safeSrc1 = '';
       row.kPackDesign.kPackDesign2 ='';
     } else if (kPackDesign === 'kPackDesign3') {
       this.addTextSelected2 = true;
       this.addVideoSelected2 = true;
       //this.colarrow = true;
       this.safeSrc2 = '';
       row.kPackDesign.kPackDesign3 ='';
     }
      }


   }

  addVideo(row, kPackDesign) {
    //console.log('add video row',row);
    var temp: any = '';
    if ((this.myDiv.nativeElement.innerHTML != undefined) && (this.myDiv.nativeElement.innerHTML == 'Add Video')) {
      temp = "Once Video is added, Editor Text will be Lost";
    }
    //console.log('mydiv',this.myDiv);
      if (kPackDesign === 'kPackDesign1')
      {
          if (row.kPackDesign.kPackDesign1.length > 0) {
            if (confirm(temp)) {
              console.log("Implement add video functionality here on text change editor");
              let var1 = row;
              let var2 = kPackDesign;
              let var3;
              if (kPackDesign === 'kPackDesign1') {
                var3 = row.kPackDesign.kPackDesign1;
                row.kPackDesign.kPackDesign1 = ''
                this.addVideoSelected = false;
                this.addTextSelected = false;
              }
              // else if (kPackDesign === 'kPackDesign2') {
              //   var3 = row.kPackDesign.kPackDesign2;
              //   row.kPackDesign.kPackDesign2 = ''
              //   this.addVideoSelected1 = false;
              //   this.addTextSelected1 = false;
              // } else if (kPackDesign === 'kPackDesign3') {
              //   var3 = row.kPackDesign.kPackDesign3;
              //   row.kPackDesign.kPackDesign3 = ''
              //   this.addVideoSelected2 = false;
              //   this.addTextSelected2 = false;
              // }
              this.videoHandler(var1, var2, var3)
            }
          }
          else {
            console.log("Implement add video functionality here on blank text editor");
            let var1 = row;
            let var2 = kPackDesign;
            let var3;
            if (kPackDesign === 'kPackDesign1') {
              var3 = row.kPackDesign.kPackDesign1;
              row.kPackDesign.kPackDesign1 = ''
              this.addVideoSelected = false;
              this.addTextSelected = false;
            }
            // else if (kPackDesign === 'kPackDesign2') {
            //   var3 = row.kPackDesign.kPackDesign2;
            //   row.kPackDesign.kPackDesign2 = ''
            //   this.addVideoSelected1 = false;
            //   this.addTextSelected1 = false;
            // } else if (kPackDesign === 'kPackDesign3') {
            //   var3 = row.kPackDesign.kPackDesign3;
            //   row.kPackDesign.kPackDesign3 = ''
            //   this.addVideoSelected2 = false;
            //   this.addTextSelected2 = false;
            // }
            this.videoHandler(var1, var2, var3)
          }
      }

      if (kPackDesign === 'kPackDesign2')
      {
          if (row.kPackDesign.kPackDesign2.length > 0) {
            if (confirm(temp)) {
              console.log("Implement add video functionality here on text change editor");
              let var1 = row;
              let var2 = kPackDesign;
              let var3;
              // if (kPackDesign === 'kPackDesign1') {
              //   var3 = row.kPackDesign.kPackDesign1;
              //   row.kPackDesign.kPackDesign1 = ''
              //   this.addVideoSelected = false;
              //   this.addTextSelected = false;
              // } else
              if (kPackDesign === 'kPackDesign2') {
                var3 = row.kPackDesign.kPackDesign2;
                row.kPackDesign.kPackDesign2 = ''
                this.addVideoSelected1 = false;
                this.addTextSelected1 = false;
              }
              // else if (kPackDesign === 'kPackDesign3') {
              //   var3 = row.kPackDesign.kPackDesign3;
              //   row.kPackDesign.kPackDesign3 = ''
              //   this.addVideoSelected2 = false;
              //   this.addTextSelected2 = false;
              // }
              this.videoHandler(var1, var2, var3)
            }
          }
          else {
            console.log("Implement add video functionality here on blank text editor");
            let var1 = row;
            let var2 = kPackDesign;
            let var3;
            // if (kPackDesign === 'kPackDesign1') {
            //   var3 = row.kPackDesign.kPackDesign1;
            //   row.kPackDesign.kPackDesign1 = ''
            //   this.addVideoSelected = false;
            //   this.addTextSelected = false;
            // } else
            if (kPackDesign === 'kPackDesign2') {
              var3 = row.kPackDesign.kPackDesign2;
              row.kPackDesign.kPackDesign2 = ''
              this.addVideoSelected1 = false;
              this.addTextSelected1 = false;
            }
            // else if (kPackDesign === 'kPackDesign3') {
            //   var3 = row.kPackDesign.kPackDesign3;
            //   row.kPackDesign.kPackDesign3 = ''
            //   this.addVideoSelected2 = false;
            //   this.addTextSelected2 = false;
            // }
            this.videoHandler(var1, var2, var3)
          }
      }

      if (kPackDesign === 'kPackDesign3')
      {
          if (row.kPackDesign.kPackDesign3.length > 0) {
            if (confirm(temp)) {
              console.log("Implement add video functionality here on text change editor");
              let var1 = row;
              let var2 = kPackDesign;
              let var3;
              // if (kPackDesign === 'kPackDesign1') {
              //   var3 = row.kPackDesign.kPackDesign1;
              //   row.kPackDesign.kPackDesign1 = ''
              //   this.addVideoSelected = false;
              //   this.addTextSelected = false;
              // } else
              // if (kPackDesign === 'kPackDesign2') {
              //   var3 = row.kPackDesign.kPackDesign2;
              //   row.kPackDesign.kPackDesign2 = ''
              //   this.addVideoSelected1 = false;
              //   this.addTextSelected1 = false;
              // }  else
              if (kPackDesign === 'kPackDesign3') {
                var3 = row.kPackDesign.kPackDesign3;
                row.kPackDesign.kPackDesign3 = ''
                this.addVideoSelected2 = false;
                this.addTextSelected2 = false;
              }
              this.videoHandler(var1, var2, var3)
            }
          }
          else {
            console.log("Implement add video functionality here on blank text editor");
            let var1 = row;
            let var2 = kPackDesign;
            let var3;
            // if (kPackDesign === 'kPackDesign1') {
            //   var3 = row.kPackDesign.kPackDesign1;
            //   row.kPackDesign.kPackDesign1 = ''
            //   this.addVideoSelected = false;
            //   this.addTextSelected = false;
            // } else
            // if (kPackDesign === 'kPackDesign2') {
            //   var3 = row.kPackDesign.kPackDesign2;
            //   row.kPackDesign.kPackDesign2 = ''
            //   this.addVideoSelected1 = false;
            //   this.addTextSelected1 = false;
            // }  else
            if (kPackDesign === 'kPackDesign3') {
              var3 = row.kPackDesign.kPackDesign3;
              row.kPackDesign.kPackDesign3 = ''
              this.addVideoSelected2 = false;
              this.addTextSelected2 = false;
            }
            this.videoHandler(var1, var2, var3)
          }
      }
  }

 handleOnOkButton() {
  this.dialog.closeAll();
}

 changeVideo(row, kPackDesign,requestApprovalTemplate) {
   console.log('change video row',row);
  // const dialogRef = this.dialog.open(requestApprovalTemplate, {
  //   width: '42%',
  //   disableClose: true,
  //   panelClass: 'custom-dialog-container',
  // });
  var temp : any = '';
  if((this.myDiv1.nativeElement.innerHTML != undefined) &&  (this.myDiv1.nativeElement.innerHTML == 'Change Video')){
    temp = "Once Video is changed, Previous Video will be Lost" ;
  }
  if(confirm(temp)) {
    console.log("Implement change video functionality here");
    let var1 = row;
    let var2 = kPackDesign;
    let var3;
    if (kPackDesign === 'kPackDesign1') {
      var3 = row.kPackDesign.kPackDesign1;
      row.kPackDesign.kPackDesign1 = ''
     this.addVideoSelected = false;
     this.addTextSelected = false;
     console.log('var3',var3);
   } else if (kPackDesign === 'kPackDesign2') {
    var3 = row.kPackDesign.kPackDesign2;
    row.kPackDesign.kPackDesign2 = ''
     this.addVideoSelected1 = false;
     this.addTextSelected1 = false;
   } else if (kPackDesign === 'kPackDesign3') {
    var3 = row.kPackDesign.kPackDesign3;
    row.kPackDesign.kPackDesign3 = ''
    this.addVideoSelected2 = false;
    this.addTextSelected2 = false;
   }
    this.videoHandler(var1,var2,var3)
  }

}




  createKPack() {
     this.addVideoSelected2 = true;
     this.addVideoSelected1 = true;
     this.addVideoSelected = true;
     this.addTextSelected = true;
     this.addTextSelected1 = true;
     this.addTextSelected2 = true;
     //this.colarrow = true;

    this.safeSrc2 ='';
    this.safeSrc1 = '';
    this.safeSrc = '';

    var kPackData = { ...this.kPackObj };
    kPackData.layout = this.layoutSet;
    kPackData['rowData'] = 'edit';
    // this.table.renderRows();
    let kPackPurposeModel: kPackPurpose = new kPackPurpose();
    kPackPurposeModel.KnowledgePackId = this.KnowledgePackId;
    kPackPurposeModel.LayoutType = this.layoutSet;
    kPackPurposeModel.TabCode = this.tabCode;
    kPackPurposeModel.ContentFirst = '';
    kPackPurposeModel.ContentSecond = '';
    kPackPurposeModel.ContentThird = '';
    this.loading = true;
    this.kPacksService.addKnowledgePackContent(kPackPurposeModel).subscribe(
      (data) => {
        var res = JSON.parse(JSON.stringify(data));

        this.ContentForPurposeId = res.knowledgePackContentId;
        this.kPackData.push(kPackData);
        this.getKPackContent();
      },
      (error) => {
        this.loading = false;
        console.error('There was an error!', error);
      }
    );
  }

  saveCommonData() {
    let kPackPurposeModel: kPackPurpose = new kPackPurpose();
    kPackPurposeModel.purposeTitle = this.title;
    kPackPurposeModel.PurposeDescription = this.description;
    kPackPurposeModel.KnowledgePackId = this.KnowledgePackId;
    // this.loading = true;
    if (this.KnowledgePackId > 0) {
      this.kPacksService
        .updateTitleDetails(kPackPurposeModel)
        .subscribe((data) => {
          // console.log(data);
          // var res = JSON.parse(JSON.stringify(data));
          // this.kPacksPropertiesData.purposeTitle = res.purposeTitle;
          // this.kPacksPropertiesData.purposeDescription = res.purposeDescription;
          // this.loading = false;
        },(error) => {
          // this.loading = false;
        });
    }

    // if (!this.PurposeId) {
    //   this.kPacksService
    //     .updateTitleDetails(kPackPurposeModel)
    //     .subscribe((data) => {
    //       console.log(data);
    //       var res = JSON.parse(JSON.stringify(data));
    //       console.log("if data",data);
    //       //this.PurposeId = res;
    //       // this.router.navigate(['/activity-page/' + this.activityPageId]);
    //     });
    // } else {
    //   kPackPurposeModel.PurposeId = this.PurposeId;
    //   this.kPacksService
    //     .updateTitleDetails(kPackPurposeModel)
    //     .subscribe((data) => {
    //       console.log("else data",data);
    //       var res = JSON.parse(JSON.stringify(data));
    //       //this.PurposeId = res.purposeId;
    //       // this.router.navigate(['/activity-page/' + this.activityPageId]);
    //     });
    // }
  }

  editorUpdate(row, index) {
    console.log('row', row);
    let kPackPurposeModel: kPackPurpose = new kPackPurpose();
    kPackPurposeModel.KnowledgePackId = row.purposeId;
    kPackPurposeModel.KnowledgePackContentId = row.contentForPurposeId;
    //kPackPurposeModel.ContentId = row.layout;
    //kPackPurposeModel.LayoutId = row.layout;
    kPackPurposeModel.LayoutType = row.layout;
    kPackPurposeModel.TabCode = 'Purpose';
    kPackPurposeModel.ContentFirst = row.kPackDesign.kPackDesign1;
    kPackPurposeModel.ContentSecond = row.kPackDesign.kPackDesign2;
    kPackPurposeModel.ContentThird = row.kPackDesign.kPackDesign3;

    this.kPacksService
      .addKnowledgePackContent(kPackPurposeModel)
      .subscribe((data) => {
        var res = JSON.parse(JSON.stringify(data));
      });
  }

  // editorUpdate(row, index) {
  //   let kPackPurposeModel: kPackPurpose = new kPackPurpose();
  //   kPackPurposeModel.PurposeId = row.purposeId;
  //   kPackPurposeModel.ContentForPurposeId = row.contentForPurposeId;
  //   kPackPurposeModel.LayoutType = row.layout;
  //   kPackPurposeModel.TabID = 'Purpose';
  //   kPackPurposeModel.ContentHTML1 = row.kPackDesign.kPackDesign1;
  //   kPackPurposeModel.ContentHTML2 = row.kPackDesign.kPackDesign2;
  //   kPackPurposeModel.ContentHTML3 = row.kPackDesign.kPackDesign3;

  //   this.kPacksService
  //     .updateContentForPurpose(kPackPurposeModel)
  //     .subscribe((data) => {
  //       var res = JSON.parse(JSON.stringify(data));
  //     });
  // }

//   insertHtml(html) {
//     const isHTMLInserted = this.doc.execCommand('insertHTML', false, html);
//     if (!isHTMLInserted) {
//         throw new Error('Unable to perform the operation');
//     }
// }

//   createLink(url) {
//     if (!url.includes('http')) {
//       const newUrl = '<a href="https://' + url + '" target="_blank">' + this.selectedText + '</a>';
//       this.insertHtml(newUrl);
//     }
//     else {
//         const newUrl = '<a href="' + url + '" target="_blank">' + this.selectedText + '</a>';
//         this.insertHtml(newUrl);
//     }
// }


  // addExternalAddOns(type, row, kPackDesign) {
  //   const dialogRef = this.dialog.open(ExternalLinkComponent, {
  //     width: "50%",
  //     height: "38%",
  //     maxWidth: this.screenWidth + "px",
  //     maxHeight: this.screenHeight + "px",
  //     disableClose: true,
  //     data: {
  //       isHeader: type
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     //let baseURL = window.location.origin +'/view-document';
  //     if (result && result !== 'No') {
  //       //console.log(' result', result);

  //       if (kPackDesign === 'kPackDesign1') {

  //         if (result.contentUrl.includes('http')) {
  //          // if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.kPackDesign1 =
  //               row.kPackDesign.kPackDesign1 +
  //               '<a href="' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //          // }

  //         }
  //         if (!result.contentUrl.includes('http')) {
  //           if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.kPackDesign1 =
  //               row.kPackDesign.kPackDesign1 +
  //               '<a href="https://' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //           }
  //           else {
  //             //(error) => {
  //             //this.loading = false;
  //             console.error('There was an error!');
  //             this._snackBar.open("'Error Please Give correct link", 'x', {
  //               duration: 5000,
  //             });
  //             //return false;
  //             //}

  //           }

  //         }
  //         //console.log('row.kPackDesign.kPackDesign1 addExternalAddOns', row.kPackDesign.kPackDesign1);

  //       } else if (kPackDesign === 'kPackDesign2') {

  //         if (result.contentUrl.includes('http')) {
  //           //if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.kPackDesign2 =
  //               row.kPackDesign.kPackDesign2 +
  //               '<a href="' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //          // }

  //         }
  //         if (!result.contentUrl.includes('http')) {
  //           if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.kPackDesign2 =
  //               row.kPackDesign.kPackDesign2 +
  //               '<a href="https://' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //           }
  //           else {
  //             console.error('There was an error!');
  //             this._snackBar.open("'Error Please Give correct link", 'x', {
  //               duration: 5000,
  //             });
  //           }

  //         }

  //       } else {

  //         if (result.contentUrl.includes('http')) {
  //           //if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.kPackDesign3 =
  //               row.kPackDesign.kPackDesign3 +
  //               '<a href="' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //          // }

  //         }
  //         if (!result.contentUrl.includes('http')) {
  //           if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.kPackDesign3 =
  //               row.kPackDesign.kPackDesign3 +
  //               '<a href="https://' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //           }
  //           else {
  //             console.error('There was an error!');
  //             this._snackBar.open("'Error Please Give correct link", 'x', {
  //               duration: 5000,
  //             });
  //           }

  //         }

  //       }

  //     }
  //   });
  // }

  navigateTo(contentType, id) {
    console.log('navigateTo', contentType, id);
    let contentTypeValue =
      contentType == 'I'
        ? 'WI'
        : contentType == 'G'
        ? 'GB'
        : contentType == 'S'
        ? 'DS'
        : contentType == 'A'
        ? 'AP'
        : contentType == 'C'
        ? 'CG'
        : contentType == 'K'
        ? 'KP'
        : contentType == 'R'
        ? 'RC'
        : contentType == 'T'
        ? 'TOC'
        : '';
    sessionStorage.setItem('componentType', contentTypeValue);
    sessionStorage.setItem('contentNumber', id);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (
      contentType === 'WI' ||
      contentType === 'I' ||
      contentType === 'DS' ||
      contentType === 'S' ||
      contentType === 'GB' ||
      contentType === 'G'
    ) {
      this.router.navigate([documentPath.publishViewPath, id]);
    } else {
      this.router.navigate([
        documentPath.publishViewPath,
        contentTypeValue,
        id,
      ]);

      //   this.router.navigate(['/activity-page', id]);
      // } else if (contentType === 'CG') {
      //   this.router.navigate(['/criteria-group', id]);
      // } else if (contentType === 'ToC') {
      //   this.router.navigate(['/related-content', id]);
      // } else if (contentType === 'RC') {
      //   this.router.navigate(['/toc', id]);
      // } else if (contentType === 'DS') {
      //   this.router.navigate(['/design-standards', id]);
    }
  }

  deleteItem(row, index) {
    this.rservice.UpdateBroadcastMessage('false');
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '42%',
      data: {
        message: "Are you sure you want to delete!",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
       if (result=='Yes'){
        if (typeof row.KnowledgePackContentId === 'undefined') {
          row.KnowledgePackContentId = row.knowledgePackContentId;
        } else {
          row.KnowledgePackContentId = row.KnowledgePackContentId;
        }
        this.loading = true;
        this.kPackData.splice(index, 1);
        this.kPacksService
          .deleteKPackContent(row.KnowledgePackContentId)
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.getKPackContent();
            //this.loading = false;
          });

       }
    });


  }

  loadKPackPurposePublish() {
    this.loading = true;
      // var data = this.kPacksPropertiesData;
      // if(data){
      //   this.knowledgePackId = this.kPacksPropertiesData.knowledgePackId;
      //     this.title = data.purposeTitle;
      //     this.description = data.purposeDescription;
      //     this.currentTabData = data.contentCollection;
      //             var res = this.currentTabData;
      //             const a = [];
      //             res.forEach((el) => {

      //               if(el['tabCode']=="Purpose"){

      //                 const KPData = {
      //                   rowData: 'readonly',
      //                   kPackDesign: {
      //                     // kPackDesign1: el.kPackDesign['contentFirst'] ? el.kPackDesign['contentFirst'] : el.kPackDesign['kPackDesign1'],
      //                     // kPackDesign2: el.kPackDesign['contentSecond'] ? el.kPackDesign['contentSecond'] : el.kPackDesign['kPackDesign2'],
      //                     // kPackDesign3: el.kPackDesign['contentThird'] ? el.kPackDesign['contentThird'] : el.kPackDesign['kPackDesign3']
      //                     kPackDesign1: el['contentFirst'],
      //                     kPackDesign2: el['contentSecond'],
      //                     kPackDesign3: el['contentThird']
      //                   },
      //                   layout: el['layoutType'],
      //                   purposeId: el['purposeId'],
      //                   contentForPurposeId: el['knowledgePackContentId'],
      //                   KnowledgePackContentId: el['knowledgePackContentId'],
      //                   knowledgePackId: el['knowledgePackId'],
      //                 };
      //                 return a.push(KPData);


      //               }

      //             });
      //             this.dataSource.data= a;
      //             this.loading = false;
      // }

      this.kPacksService.getPurposeData(this.KnowledgePackId).subscribe(
        (data) => {
          if (data) {
            this.knowledgePackId = data['knowledgePackId'];
            this.PurposeId = data['purposeId'];
            this.title = data['title'];
            this.description = data['description'];
            this.currentTabData = data;
            this.currentTabData = this.currentTabData.contentCollection;
            var res = this.currentTabData;
            this.onLoaddata(data)
            const a = [];
            res.forEach((el) => {
              if ( el['contentFirst'].indexOf('https') === -1) {
                el['contentFirst'] = el['contentFirst'].replace('http', 'https')
                //console.log(' el[contentFirst]', el['contentFirst']);
              }

              if ( el['contentSecond'].indexOf('https') === -1) {
                el['contentSecond'] = el['contentSecond'].replace('http', 'https')
                //console.log(' el[contentSecond]', el['contentSecond']);
              }


              if ( el['contentThird'].indexOf('https') === -1) {
                el['contentThird'] = el['contentThird'].replace('http', 'https')
                //console.log(' el[contentThird]', el['contentThird']);
              }
              const KPData = {
                rowData: 'readonly',
                kPackDesign: {
                  kPackDesign1: el['contentFirst'],
                  kPackDesign2: el['contentSecond'],
                  kPackDesign3: el['contentThird'],
                },
                layout: el['layoutType'],
                purposeId: el['purposeId'],
                contentForPurposeId: el['knowledgePackContentId'],
                KnowledgePackContentId: el['knowledgePackContentId'],
                knowledgePackId: el['knowledgePackId'],
              };
              return a.push(KPData);
            });
            this.dataSource.data = a;
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
          console.error('There was an error!', error);
        }
      );
  }

  onLoaddata(data:any=0,ctd:any=0){
    this.loading = true;
    this.knowledgePackId = data['knowledgePackId'];
    this.PurposeId = data['purposeId'];
    this.title = data['title'];
    this.description = data['description'];
    this.currentTabData = data;
    this.currentTabData = this.currentTabData.contentCollection;
    var res = this.currentTabData;
    if(ctd==0){
      this.array = res;
    }
    else{
      this.array = ctd;
    }
    //this.array = res;
    //console.log(" onLoaddata ctd check this.array", this.array);
    const a = [];
    this.array.forEach((el) => {
      const KPData = {
        rowData: 'readonly',
        kPackDesign: {
          kPackDesign1: el['contentFirst'],
          kPackDesign2: el['contentSecond'],
          kPackDesign3: el['contentThird'],
        },
        layout: el['layoutType'],
        purposeId: el['purposeId'],
        contentForPurposeId: el['knowledgePackContentId'],
        KnowledgePackContentId: el['knowledgePackContentId'],
        knowledgePackId: el['knowledgePackId'],
      };
      return a.push(KPData);
    });
    this.dataSource.data = a;
    this.loading = false;
  }

  moveUpSimple(element,index: number) {
    if ( index >= 1 ) {
      this.loading = true;
      forkJoin([
        this.updateKPackPhysics(this.array[index], this.array[index - 1].knowledgePackContentId),
        this.updateKPackPhysics(this.array[index - 1], this.array[index].knowledgePackContentId)
      ]).subscribe(() => {
        // this.swapStatus(index, index - 1);
        this.getKPackContent();
      }, () => {
      });
    }
 }

 moveDownSimple(element,index: number) {
    if ( index < this.array.length - 1 ) {
      const data = this.dataSource.data as any;
      this.loading = true;
      forkJoin([
        this.updateKPackPhysics(this.array[index], this.array[index + 1].knowledgePackContentId),
        this.updateKPackPhysics(this.array[index + 1], this.array[index].knowledgePackContentId)
      ]).subscribe(() => {
        this.swapStatus(index, index + 1);
        this.getKPackContent();
      }, () => {
      });
    }
 }

  private swapStatus(index1, index2) {
    const index1Item = this.dataSource.data[index1] as any;
    const index2Item = this.dataSource.data[index2] as any;
    if ( index1Item && index2Item ) {
      const index2ItemStatus = index2Item.rowData;
      index2Item.rowData = index1Item.rowData;
      index1Item.rowData = index2ItemStatus;
    }
 }


  loadKPackPurpose() {
    this.loading = true;
    this.kPacksService.getPurposeData(this.KnowledgePackId).subscribe(
      (data) => {
        if (data) {
          console.log('data',data);
          this.dataID = data;
          //console.log('this.dataID',this.dataID);
          this.knowledgePackId = data['knowledgePackId'];
          this.PurposeId = data['purposeId'];
          this.title = data['title'];
          this.description = data['description'];
          this.currentTabData = data;
          this.currentTabData = this.currentTabData.contentCollection;
          var res = this.currentTabData;
          this.onLoaddata(data)
          const a = [];
          res.forEach((el) => {

            if ( el['contentFirst'].indexOf('https') === -1) {
              el['contentFirst'] = el['contentFirst'].replace('http', 'https')
              //console.log(' el[contentFirst]', el['contentFirst']);
            }

            if ( el['contentSecond'].indexOf('https') === -1) {
              el['contentSecond'] = el['contentSecond'].replace('http', 'https')
              //console.log(' el[contentSecond]', el['contentSecond']);
            }


            if ( el['contentThird'].indexOf('https') === -1) {
              el['contentThird'] = el['contentThird'].replace('http', 'https')
              //console.log(' el[contentThird]', el['contentThird']);
            }

            const KPData = {
              rowData: 'readonly',
              kPackDesign: {
                kPackDesign1: el['contentFirst'],
                kPackDesign2: el['contentSecond'],
                kPackDesign3: el['contentThird'],
              },
              layout: el['layoutType'],
              purposeId: el['purposeId'],
              contentForPurposeId: el['knowledgePackContentId'],
              KnowledgePackContentId: el['knowledgePackContentId'],
              knowledgePackId: el['knowledgePackId'],
            };
            console.log('on load KPData',KPData);
            return a.push(KPData);
          });
          this.dataSource.data = a;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        console.error('There was an error!', error);
      }
    );
  }

  handleOnClick(row) {
    //this.colarrow = false;
    row.rowData = 'edit';
    console.log(' row edit', row);
    if (row.kPackDesign.kPackDesign1) {
      if (row.kPackDesign.kPackDesign1.indexOf("http://") == 0 || row.kPackDesign.kPackDesign1.indexOf("https://") == 0) {

        if ( row.kPackDesign.kPackDesign1.indexOf('https') === -1) {
          row.kPackDesign.kPackDesign1 =  row.kPackDesign.kPackDesign1.replace('http', 'https')
          //console.log(' row.kPackDesign.kPackDesign1 onhandelclick', row.kPackDesign.kPackDesign1);
        }

        var loadedvideo = JSON.parse(JSON.stringify(row.kPackDesign.kPackDesign1))
        //console.log(' loadedvideo',loadedvideo);
        this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(loadedvideo);
        //console.log(' in handleOnClick',this.safeSrc);
        this.addVideohttp = false;
        this.addVideoSelected = false;
        this.addTextSelected = false;
      }
      else {
        this.addVideohttp = true;
        this.addTextSelected = true;
        this.addVideoSelected = true;
        this.safeSrc = '';
      }
    }

    if (row.kPackDesign.kPackDesign2) {
      if (row.kPackDesign.kPackDesign2.indexOf("http://") == 0 || row.kPackDesign.kPackDesign2.indexOf("https://") == 0) {

        if ( row.kPackDesign.kPackDesign2.indexOf('https') === -1) {
          row.kPackDesign.kPackDesign2 =  row.kPackDesign.kPackDesign2.replace('http', 'https')
          //console.log(' row.kPackDesign.kPackDesign2 onhandelclick', row.kPackDesign.kPackDesign2);
        }

        var loadedvideo1 = JSON.parse(JSON.stringify(row.kPackDesign.kPackDesign2))
        //console.log(' loadedvideo1',loadedvideo1);
        this.safeSrc1 =  this.sanitizer.bypassSecurityTrustResourceUrl(loadedvideo1);
        //console.log(' in handleOnClick1',this.safeSrc1);
        this.addVideohttp1 = false;
        this.addVideoSelected1 = false;
        this.addTextSelected1 = false;
      }
      else {
        this.safeSrc1 = '';
        this.addVideohttp1 = true;
        this.addTextSelected1 = true;
        this.addVideoSelected1 = true;
      }
    }

    if (row.kPackDesign.kPackDesign3) {
      if (row.kPackDesign.kPackDesign3.indexOf("http://") == 0 || row.kPackDesign.kPackDesign3.indexOf("https://") == 0) {

        if ( row.kPackDesign.kPackDesign3.indexOf('https') === -1) {
          row.kPackDesign.kPackDesign3 =  row.kPackDesign.kPackDesign3.replace('http', 'https')
          //console.log(' row.kPackDesign.kPackDesign3 onhandelclick', row.kPackDesign.kPackDesign3);
        }

        var loadedvideo2 = JSON.parse(JSON.stringify(row.kPackDesign.kPackDesign3))
        //console.log(' loadedvideo2',loadedvideo2);
        this.safeSrc2 =  this.sanitizer.bypassSecurityTrustResourceUrl(loadedvideo2);
        //console.log(' in handleOnClick2',this.safeSrc2);
        this.addVideohttp2 = false;
        this.addVideoSelected2 = false;
        this.addTextSelected2 = false;
      }
      else {
        this.safeSrc2 = '';
        this.addVideohttp2 = true;
        this.addTextSelected2 = true;
        this.addVideoSelected2 = true;
      }
    }
  }

  nonEditableMode(row) {
    this.rservice.UpdateBroadcastMessage('false');
    console.log('row nonEditableMode clicked',row)
    //row.kPackDesign.kPackDesign1 = row.kPackDesign.kPackDesign1.replace(/\\/g, '');
    this.previousRecords = this.dataSource.data;
    console.log('this.previousRecords',this.previousRecords);
    row.rowData = 'readonly';
    let kPackPurposeModel: kPackPurpose = new kPackPurpose();
    //kPackPurposeModel.KnowledgePackId = row.purposeId;
    kPackPurposeModel.KnowledgePackId = this.KnowledgePackId;
    kPackPurposeModel.KnowledgePackContentId =
      row.KnowledgePackContentId | row.knowledgePackContentId;
    //kPackPurposeModel.ContentId = row.layout;
    //kPackPurposeModel.LayoutId = row.layout;
    kPackPurposeModel.LayoutType = row.layout;
    kPackPurposeModel.TabCode = 'Purpose';

    // if ((row.kPackDesign.kPackDesign1.includes("http://") ||
    //      row.kPackDesign.kPackDesign1.includes("https://") ||
    //      row.kPackDesign.kPackDesign1.includes("www"))  && (!row.kPackDesign.kPackDesign1.includes("embed")) ) {

    //    alert('1');

    //   if ( !row.kPackDesign.kPackDesign1.includes('https') && !row.kPackDesign.kPackDesign1.includes("www")) {
    //     alert('2');
    //     row.kPackDesign.kPackDesign1 =  row.kPackDesign.kPackDesign1.replace('http', 'https')
    //     console.log('row.kPackDesign.kPackDesign1 nonEditableMode', row.kPackDesign.kPackDesign1);
    //   }

    //   if (!row.kPackDesign.kPackDesign1.includes("https://www")) {

    //   if (row.kPackDesign.kPackDesign1.includes("www")) {
    //     alert('3');
    //     row.kPackDesign.kPackDesign1 =  row.kPackDesign.kPackDesign1.replace('www', 'https://www')


    //     row.kPackDesign.kPackDesign1 = row.kPackDesign.kPackDesign1.split(" ")
    //     console.log('row.kPackDesign.kPackDesign1 nonEditableMode', row.kPackDesign.kPackDesign1);

    //   }
    // }

    // }


    kPackPurposeModel.ContentFirst = row.kPackDesign.kPackDesign1
      ? row.kPackDesign.kPackDesign1
      : '';
    kPackPurposeModel.ContentSecond = row.kPackDesign.kPackDesign2
      ? row.kPackDesign.kPackDesign2
      : '';
    kPackPurposeModel.ContentThird = row.kPackDesign.kPackDesign3
      ? row.kPackDesign.kPackDesign3
      : '';

    this.loading = true;
    this.kPacksService.addKnowledgePackContent(kPackPurposeModel).subscribe(
      (data) => {
        // this.loadKPackPurpose();
        const KPData = {
          rowData: 'readonly',
          kPackDesign: {
            kPackDesign1: kPackPurposeModel.ContentFirst,
            kPackDesign2: kPackPurposeModel.ContentSecond,
            kPackDesign3: kPackPurposeModel.ContentThird,
          },
          layout: kPackPurposeModel.LayoutType,
          purposeId: kPackPurposeModel.PurposeId,
          contentForPurposeId: kPackPurposeModel.KnowledgePackContentId,
          knowledgePackContentId: kPackPurposeModel.KnowledgePackContentId,
          knowledgePackId: kPackPurposeModel.KnowledgePackId,
        };
        this.previousRecords.forEach((element) => {
          if (
            kPackPurposeModel.KnowledgePackContentId ==
            element.contentForPurposeId
          ) {
            element.rowData = 'readonly';
            element.kPackDesign.ContentFirst = kPackPurposeModel.ContentFirst;
            element.kPackDesign.ContentSecond = kPackPurposeModel.ContentSecond;
            element.kPackDesign.ContentThird = kPackPurposeModel.ContentThird;
            element.layout = kPackPurposeModel.LayoutType;
            element.purposeId = kPackPurposeModel.PurposeId;
            element.contentForPurposeId =
              kPackPurposeModel.KnowledgePackContentId;
            element.knowledgePackContentId =
              kPackPurposeModel.KnowledgePackContentId;
          }
        });

        this.dataSource.data = this.previousRecords;
        this.kPacksPropertiesData.contentCollection = this.previousRecords;
        this.loading = false;
        this.getKPackContent();
        // if ((this.myDiv5.nativeElement.innerHTML != undefined) && (this.myDiv5.nativeElement.innerHTML == 'Create')) {
        //   this.createKPack();
        // }

      },
      (error) => {
        this.loading = false;
        console.error('There was an error!', error);
      }
    );
  }

  // nonEditableMode(row) {
  //   this.previousRecords = this.dataSource.data;
  //   row.rowData = 'readonly'
  //   let kPackPurposeModel: kPackPurpose = new kPackPurpose();
  //   kPackPurposeModel.PurposeId = row.purposeId;
  //   kPackPurposeModel.ContentForPurposeId = row.contentForPurposeId;
  //   kPackPurposeModel.LayoutType = row.layout;
  //   kPackPurposeModel.TabID = 'Purpose';
  //   kPackPurposeModel.ContentHTML1 = row.kPackDesign.kPackDesign1;
  //   kPackPurposeModel.ContentHTML2 = row.kPackDesign.kPackDesign2;
  //   kPackPurposeModel.ContentHTML3 = row.kPackDesign.kPackDesign3;
  //   this.loading = true;
  //   this.kPacksService
  //     .updateContentForPurpose(kPackPurposeModel)
  //     .subscribe((data) => {
  //       // this.loadKPackPurpose();
  //       const KPData = {
  //         rowData: 'readonly',
  //         kPackDesign: {
  //           kPackDesign1: kPackPurposeModel.ContentHTML1,
  //           kPackDesign2: kPackPurposeModel.ContentHTML2,
  //           kPackDesign3: kPackPurposeModel.ContentHTML3,
  //         },
  //         layout: kPackPurposeModel.LayoutType,
  //         purposeId: kPackPurposeModel.PurposeId,
  //         contentForPurposeId: kPackPurposeModel.ContentForPurposeId,
  //       };

  //       this.previousRecords.forEach(element => {
  //         if (kPackPurposeModel.ContentForPurposeId == element.contentForPurposeId) {
  //           element.rowData = 'readonly';
  //           element.kPackDesign.kPackDesign1 = kPackPurposeModel.ContentHTML1;
  //           element.kPackDesign.kPackDesign2 = kPackPurposeModel.ContentHTML2;
  //           element.kPackDesign.kPackDesign3 = kPackPurposeModel.ContentHTML3;
  //           element.layout = kPackPurposeModel.LayoutType;
  //           element.purposeId = kPackPurposeModel.PurposeId;
  //           element.contentForPurposeId = kPackPurposeModel.ContentForPurposeId;
  //         }
  //       });
  //       this.dataSource.data = this.previousRecords;
  //     },
  //       (error) => {
  //         this.loading = false;
  //         console.error('There was an error!', error);
  //       });
  // }

  handleSave(item) {}

  videoHandler(row, kPackDesign,old:any=0) {
    let video;
    let video1;
    let video2;
    let dialogRef = this.dialog.open(InsertVideoComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '')
      {
            if (result.indexOf('https') === -1) {
              result = result.replace('http', 'https')
              //console.log(' result', result);
            }
            //console.log('result before', result);

            if (result.indexOf('https://www.youtube.com/watch?v=') == 0) {
              result = result.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')
            }

            if (result.indexOf('https://youtu.be/') == 0) {
              result = result.replace('https://youtu.be/', 'https://www.youtube.com/embed/')
            }

            if (result.includes("/watch?v=")) {
              result = result.replace('/watch?v=', '/embed/')
            }

            if (result.includes("sharevideo/")) {
              result = result.replace('sharevideo/', 'embed?id=')
            }

            //console.log('result after', result);
            if (kPackDesign === 'kPackDesign1') {
              this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              var a1: any = result;
              video = {
                source: result
              };
              var v = JSON.parse(JSON.stringify(video));
              //console.log('v', v.source);

            }
            else if (kPackDesign === 'kPackDesign2') {
              this.safeSrc1 = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              var a2: any = result;
              video1 = {
                source: result
              };
              var z = JSON.parse(JSON.stringify(video1));
              //console.log('z', z.source);

            }
            else if (kPackDesign === 'kPackDesign3') {
              this.safeSrc2 = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              var a3: any = result;
              video2 = {
                source: result
              };
              var y = JSON.parse(JSON.stringify(video2));
              //console.log('y', y.source);

            }


            //console.log('video 1st', video);
            //console.log('video1 JSON.stringify', JSON.stringify(video));
            this.srcURL = result + '#t=0.3';
            //console.log('srcURL', this.srcURL);
            var videoPlayer = `<video width='400' preload="metadata" controls="controls" x-webkit-airplay="allow" src=${this.srcURL}>
            </video>
            <br/>
          `;

            if (kPackDesign === 'kPackDesign1') {
              row.kPackDesign.kPackDesign1 =
                row.kPackDesign.kPackDesign1 === undefined
                  ? '' + v.source
                  : '' + v.source;
            } else if (kPackDesign === 'kPackDesign2') {
              row.kPackDesign.kPackDesign2 =
                row.kPackDesign.kPackDesign2 === undefined
                  ? '' + z.source
                  : '' + z.source;
            } else if (kPackDesign === 'kPackDesign3') {
              row.kPackDesign.kPackDesign3 =
                row.kPackDesign.kPackDesign3 === undefined
                  ? '' + y.source
                  : '' + y.source;
            }
      }
      else{
            console.log('old.length',old.length);
         if(old.length == 0 )
        {

            if (kPackDesign === 'kPackDesign1') {
              row.kPackDesign.kPackDesign1 = old;
              this.addVideoSelected = true;
              this.addTextSelected = true;
            } else if (kPackDesign === 'kPackDesign2') {
              row.kPackDesign.kPackDesign2 = old;
              this.addVideoSelected1 = true;
              this.addTextSelected1 = true;
            } else if (kPackDesign === 'kPackDesign3') {
              row.kPackDesign.kPackDesign3 = old;
              this.addVideoSelected2 = true;
              this.addTextSelected2 = true;
            }

        }
        else if ((!old.includes("https")) && (old.length > 0))
        {
          if (kPackDesign === 'kPackDesign1') {
            row.kPackDesign.kPackDesign1 = old;
            this.addVideoSelected = true;
            this.addTextSelected = true;
          } else if (kPackDesign === 'kPackDesign2') {
            row.kPackDesign.kPackDesign2 = old;
            this.addVideoSelected1 = true;
            this.addTextSelected1 = true;
          } else if (kPackDesign === 'kPackDesign3') {
            row.kPackDesign.kPackDesign3 = old;
            this.addVideoSelected2 = true;
            this.addTextSelected2 = true;
          }
        }
        else if((old.includes("https")) && (old.length > 0))
        {
            if (kPackDesign === 'kPackDesign1') {
              console.log('old',old);
              this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(old);
              video = {
                source: old
              };
              var v = JSON.parse(JSON.stringify(video));
              console.log('v', v.source);
              row.kPackDesign.kPackDesign1 =
                    row.kPackDesign.kPackDesign1 === undefined
                      ? '' + v.source
                      : '' + v.source;
            this.addVideoSelected = false;
            this.addTextSelected = false;

          } else if (kPackDesign === 'kPackDesign2') {
            console.log('old',old);
            this.safeSrc1 = this.sanitizer.bypassSecurityTrustResourceUrl(old);
            video1 = {
              source: old
            };
            var z = JSON.parse(JSON.stringify(video1));
            console.log('z', z.source);
            row.kPackDesign.kPackDesign2 =
                row.kPackDesign.kPackDesign2 === undefined
                  ? '' + z.source
                  : '' + z.source;
            this.addVideoSelected1 = false;
            this.addTextSelected1 = false;
          } else if (kPackDesign === 'kPackDesign3') {
            console.log('old',old);
            this.safeSrc2 = this.sanitizer.bypassSecurityTrustResourceUrl(old);
              video2 = {
                source: old
              };
              var y = JSON.parse(JSON.stringify(video2));
              console.log('y', y.source);
            row.kPackDesign.kPackDesign3 =
                row.kPackDesign.kPackDesign3 === undefined
                  ? '' + y.source
                  : '' + y.source;
            this.addVideoSelected2 = false;
            this.addTextSelected2 = false;
          }

      }


      }




    });
  }

  onSwap1(element) {
    if (element.layout == "Layout2" || element.layout == "Layout3") {
      this.demo2 = element.kPackDesign.kPackDesign1;
      //console.log(' this.demo2', this.demo2);
      element.kPackDesign.kPackDesign1 = element.kPackDesign.kPackDesign2;
      element.kPackDesign.kPackDesign2 = this.demo2;
    }
  }

  onSwap2(element) {
    if (element.layout == "Layout3") {
      this.demo3 = element.kPackDesign.kPackDesign3;
      element.kPackDesign.kPackDesign3 = element.kPackDesign.kPackDesign2;
      element.kPackDesign.kPackDesign2 = this.demo3;
    }
  }


  private updateKPackPhysics(row, knowledgePackContentId?) {
    const kPackPhysicsModel: kPackPhysics = new kPackPhysics();
    kPackPhysicsModel.knowledgePackContentId = knowledgePackContentId || row.knowledgePackContentId;
    kPackPhysicsModel.layoutType = row.layoutType;
    kPackPhysicsModel.contentFirst = row.contentFirst;
    kPackPhysicsModel.contentSecond = row.contentSecond;
    kPackPhysicsModel.contentThird = row.contentThird;

    kPackPhysicsModel.KnowledgePackId = this.KnowledgePackId;
    kPackPhysicsModel.CreatedDateTime = new Date();
    kPackPhysicsModel.LastUpdateDateTime = new Date();
    kPackPhysicsModel.TabCode = this.tabCode;

    return this.kPacksService.createKPackContent(kPackPhysicsModel);
  }
}
