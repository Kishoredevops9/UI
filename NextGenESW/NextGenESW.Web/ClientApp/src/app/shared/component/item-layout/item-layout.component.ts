import { Component, OnInit, Input, ViewChild,ElementRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { forkJoin, Subscription } from 'rxjs';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { KPacksService } from '@app/k-packs/k-packs.service';
import { kPackPhysics } from '@app/k-packs/k-packs.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InsertVideoComponent } from '../insert-video/insert-video.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExternalLinkComponent } from '@app/toc/toc-details/toc-toc/external-link/external-link.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteComponent } from "@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component"
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';

@Component({
  selector: 'app-item-layout',
  templateUrl: './item-layout.component.html',
  styleUrls: ['./item-layout.component.scss'],
})
export class ItemLayoutComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  public screenWidth: any;
  public screenHeight: any;
  dataID
  safeSrc: SafeResourceUrl;
  safeSrc1: SafeResourceUrl;
  safeSrc2: SafeResourceUrl;
  @ViewChild('myDiv', { static: false }) myDiv: ElementRef;
  @ViewChild('myDiv1', { static: false }) myDiv1: ElementRef;
  @Input() disableForm: boolean;
  @Input() kPacksPropertiesData: any;
  @Input() allowMedia = true;
  @Input() tabCode: string;
  selectedIndex = 0;
  kPackData = [];
  dataSource = new MatTableDataSource();
  loading = false;
  private subscription: Subscription;
  previousRecords: any;
  @ViewChild(MatTable) table: MatTable<any>;
  kPackObj = {
    layoutType: 1,
    kPackDesign: {
      contentFirst: '',
      contentSecond: '',
      contentThird: '',
    },
    knowledgePackContentId: 0,
  };
  type: any;
  layoutSet: any;
  title: any;
  description: any;
  layoutSelected: boolean = true;
  KnowledgePackContentId: any;
  KnowledgePackId;
  currentTabData: any;
  srcURL: string;

  addTextSelected: boolean = true;
  addTextSelected1: boolean = true;
  addTextSelected2: boolean = true;
  addVideoSelected: boolean = true;
  addVideoSelected1: boolean = true;
  addVideoSelected2: boolean = true;
  array: any =''
  addVideohttp: boolean = true;
  addVideohttp1: boolean = true;
  addVideohttp2: boolean = true;
  demo3;
  demo1;
  demo2;
  displayName1: string = '';
  contentOwner1: any ='';
  constructor(
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private activityPageService: ActivityPageService,
    private kPacksService: KPacksService,
    private route: ActivatedRoute,
    private router: Router,
    private rservice: RecordsService,
  ) {}

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
    sanitize: false,
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

  ngOnInit(): void {
    this.contentSelected = false;
    let setlayout = 1;

    this.route.params.subscribe((param) => {
      this.KnowledgePackId =
        this.kPacksPropertiesData && this.kPacksPropertiesData.knowledgePackId
          ? this.kPacksPropertiesData.knowledgePackId
          : '';
    });
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
        this.currentTabData = event.kPacksPropertiesData.currentValue;
        if (this.KnowledgePackId > 0) {
          this.kPacksService
            .getKnowledgePackContent(this.KnowledgePackId, this.tabCode)
            .subscribe(
              (data) => {
                var res = JSON.parse(JSON.stringify(data));

                this.currentTabData = res;
                this.loadKPackPhysics();
              },
              (error) => {
                this.loading = false;
                console.error('There was an error!', error);
              }
            );

          // this.currentTabData = this.kPacksPropertiesData.contentCollection.filter((child) => {
          //   if (child.tabCode && child.tabCode.toLowerCase() === this.tabCode.toLowerCase()) {
          //     return child;
          //   }
          // });

          // if (!this.kPacksPropertiesData.modeChange) {
          //   this.loadKPackPhysics();
          // }
        }
      }
    }
    this.displayName1 = sessionStorage.getItem('userMail');
    this.contentOwner1 = this.kPacksPropertiesData?.contentOwnerId;
  }

  setLayout(layoutStyle) {
    this.layoutSet = layoutStyle;
    this.layoutSelected = false;
  }

  createKPack() {

    this.addVideoSelected2 = true;
    this.addVideoSelected1 = true;
    this.addVideoSelected = true;
    this.addTextSelected = true;
    this.addTextSelected1 = true;
    this.addTextSelected2 = true;

   this.safeSrc2 ='';
   this.safeSrc1 = '';
   this.safeSrc = '';

    var kPackData = { ...this.kPackObj };
    kPackData.layoutType = this.layoutSet;
    kPackData['rowData'] = 'edit';
    this.table.renderRows();

    let kPackPhysicsModel: kPackPhysics = new kPackPhysics();
    kPackPhysicsModel.layoutType = this.layoutSet;
    kPackPhysicsModel.knowledgePackContentId = 0;
    kPackPhysicsModel.KnowledgePackId = this.KnowledgePackId;
    kPackPhysicsModel.Title = '';
    kPackPhysicsModel.Description = '';
    kPackPhysicsModel.CreatedDateTime = new Date();
    kPackPhysicsModel.LastUpdateDateTime = new Date();
    kPackPhysicsModel.contentFirst = '';
    kPackPhysicsModel.contentSecond = '';
    kPackPhysicsModel.contentThird = '';
    kPackPhysicsModel.FrameNumber = 0;
    kPackPhysicsModel.FrameType = '';
    kPackPhysicsModel.Heading = '';
    kPackPhysicsModel.TabCode = this.tabCode;
    this.loading = true;
    this.kPacksService.createKPackContent(kPackPhysicsModel).subscribe(
      (data) => {
        var res = JSON.parse(JSON.stringify(data));

        this.KnowledgePackContentId = res.knowledgePackContentId;
        kPackData.layoutType = res.knowledgePackContentId;
        this.kPackData.push(kPackData);

        let records = this.dataSource.data;
        const KPData = {
          rowData: 'edit',
          kPackDesign: {
            contentFirst: res.contentFirst,
            contentSecond: res.contentSecond,
            contentThird: res.contentThird,
          },
          layoutType: res.layoutType,
          knowledgePackContentId: res.knowledgePackContentId,
        };
        records.push(KPData);
        this.dataSource.data = records;
        this.getKPackContent();
      },
      (error) => {
        this.loading = false;
        console.error('There was an error!', error);
      }
    );
  }

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
  //       //console.log('Kpack result', result);

  //       if (kPackDesign === 'contentFirst') {

  //           if (!result.contentUrl.includes('http')) {
  //             row.kPackDesign.contentFirst =
  //             row.kPackDesign.contentFirst +
  //             '<a href="https://' + result.contentUrl + '" target="_blank">' + result.title  + '</a>'
  //           }
  //           else{
  //             row.kPackDesign.contentFirst =
  //             row.kPackDesign.contentFirst +
  //             '<a href="' + result.contentUrl + '" target="_blank">' + result.title  + '</a>'
  //           }

  //            //console.log('row.kPackDesign.contentFirst addExternalAddOns', row.kPackDesign.contentFirst);

  //       }else if (kPackDesign === 'contentSecond') {
  //           if (!result.contentUrl.includes('http')) {
  //             row.kPackDesign.contentSecond =
  //             row.kPackDesign.contentSecond +
  //             '<a href="https://' + result.contentUrl + '" target="_blank">' + result.title  + '</a>'
  //           }
  //           else{
  //             row.kPackDesign.contentSecond =
  //             row.kPackDesign.contentSecond +
  //             '<a href="' + result.contentUrl + '" target="_blank">' + result.title  + '</a>'
  //           }


  //       } else {


  //           if (!result.contentUrl.includes('http')) {
  //             row.kPackDesign.contentThird =
  //             row.kPackDesign.contentThird +
  //             '<a href="https://' + result.contentUrl + '" target="_blank">' + result.title  + '</a>'
  //           }
  //           else{
  //             row.kPackDesign.contentThird =
  //             row.kPackDesign.contentThird +
  //             '<a href="' + result.contentUrl + '" target="_blank">' + result.title  + '</a>'
  //           }

  //       }

  //     }

  //   });
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

  //       if (kPackDesign === 'contentFirst') {

  //         if (result.contentUrl.includes('http')) {
  //           //if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.contentFirst =
  //               row.kPackDesign.contentFirst +
  //               '<a href="' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //           //}

  //         }
  //         if (!result.contentUrl.includes('http')) {
  //           if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.contentFirst =
  //               row.kPackDesign.contentFirst +
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

  //       } else if (kPackDesign === 'contentSecond') {

  //         if (result.contentUrl.includes('http')) {
  //           //if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.contentSecond =
  //               row.kPackDesign.contentSecond +
  //               '<a href="' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //          // }

  //         }
  //         if (!result.contentUrl.includes('http')) {
  //           if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.contentSecond =
  //               row.kPackDesign.contentSecond +
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
  //             row.kPackDesign.contentThird =
  //               row.kPackDesign.contentThird +
  //               '<a href="' + result.contentUrl + '" target="_blank">' + result.title + '</a>'
  //          // }

  //         }
  //         if (!result.contentUrl.includes('http')) {
  //           if (result.contentUrl.includes('www.')) {
  //             row.kPackDesign.contentThird =
  //               row.kPackDesign.contentThird +
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

  checkContentType(contentType) {
    if (contentType === 'WI' || contentType === 'I') {
      return 'draged-list-wi';
    } else if (contentType === 'AP' || contentType === 'A') {
      return 'draged-list-ap';
    } else if (contentType === 'CG' || contentType === 'C') {
      return 'draged-list-cg';
    } else if (contentType === 'GB' || contentType === 'G') {
      return 'draged-list-gb';
    } else if (contentType === 'RC' || contentType === 'R') {
      return 'draged-list-rc';
    } else if (contentType === 'DS' || contentType === 'D' || contentType === 'S') {
      return 'draged-list-ds';
    } else if (contentType === 'M' || contentType === 'P') {
      return 'draged-list-m';
    } else if (contentType === 'ToC' || contentType === 'TOC' || contentType === 'T') {
      return 'draged-list-toc';
    } else if (contentType === 'KP' || contentType === 'K') {
      return 'draged-list-kp';
    }else if (contentType === 'F' || contentType === 'SP') {
      return 'draged-list-sf';
    }
    return '';
  }

  navigateTo(contentType, id) {
    if (contentType === 'WI') {
      this.router.navigate(['/create-document', id]);
    } else if (contentType === 'AP') {
      this.router.navigate(['/activity-page', id]);
    } else if (contentType === 'CG') {
      this.router.navigate(['/criteria-group', id]);
    } else if (contentType === 'DS') {
      this.router.navigate(['/design-standards', id]);
    } else if (contentType === 'GB') {
      this.router.navigate(['/guide-book', id]);
    } else if (contentType === 'ToC') {
      this.router.navigate(['/related-content', id]);
    } else if (contentType === 'RC') {
      this.router.navigate(['/toc', id]);
    } else if (contentType === 'DS') {
      this.router.navigate(['/design-standards', id]);
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

  getKPackContent() {
    this.previousRecords = this.dataSource.data;
    this.kPacksService
      .getAllKPackContent(this.KnowledgePackId, this.tabCode)
      .subscribe(
        (data) => {
          var res = JSON.parse(JSON.stringify(data));
          this.onLoaddata(data)
          const a = [];
          res.forEach((el) => {
            const KPData = {
              rowData: this.previousRecords.some((pr) => {
                return pr.knowledgePackContentId == el.knowledgePackContentId;
              })
                ? this.previousRecords.filter((el2) => {
                    if (
                      el2.knowledgePackContentId == el.knowledgePackContentId
                    ) {
                      return el2.rowData;
                    }
                  })[0].rowData
                : 'readonly',
              kPackDesign: {
                contentFirst: el['contentFirst'],
                contentSecond: el['contentSecond'],
                contentThird: el['contentThird'],
              },
              layoutType: el['layoutType'],
              knowledgePackContentId: el['knowledgePackContentId'],
            };
            return a.push(KPData);
          });
          this.dataSource.data = a;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          console.error('There was an error!', error);
        }
      );
  }

  loadKPackPhysics() {
    this.dataID = this.currentTabData;
    this.onLoaddata(this.currentTabData);
    console.log('current tab data',this.currentTabData);
    var res = JSON.parse(JSON.stringify(this.currentTabData));
    const a = [];
    if (res) {
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
            contentFirst: el['contentFirst'],
            contentSecond: el['contentSecond'],
            contentThird: el['contentThird'],
          },
          layoutType: el['layoutType'],
          knowledgePackContentId: el['knowledgePackContentId'],
        };
        return a.push(KPData);
      });
      this.dataSource.data = a;
      this.loading = false;
    }
  }

  // handleOnClick(row) {
  //   row.rowData = 'edit';
  // }

  handleOnClick(row) {
    //this.colarrow = false;
    row.rowData = 'edit';
    console.log(' row edit', row);
    if (row.kPackDesign.contentFirst) {
      if (row.kPackDesign.contentFirst.indexOf("http://") == 0 || row.kPackDesign.contentFirst.indexOf("https://") == 0) {

        if ( row.kPackDesign.contentFirst.indexOf('https') === -1) {
          row.kPackDesign.contentFirst =  row.kPackDesign.contentFirst.replace('http', 'https')
          //console.log(' row.kPackDesign.contentFirst onhandelclick', row.kPackDesign.contentFirst);
        }

        var loadedvideo = JSON.parse(JSON.stringify(row.kPackDesign.contentFirst))
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

    if (row.kPackDesign.contentSecond) {
      if (row.kPackDesign.contentSecond.indexOf("http://") == 0 || row.kPackDesign.contentSecond.indexOf("https://") == 0) {

        if ( row.kPackDesign.contentSecond.indexOf('https') === -1) {
          row.kPackDesign.contentSecond =  row.kPackDesign.contentSecond.replace('http', 'https')
          //console.log(' row.kPackDesign.contentSecond onhandelclick', row.kPackDesign.contentSecond);
        }

        var loadedvideo1 = JSON.parse(JSON.stringify(row.kPackDesign.contentSecond))
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

    if (row.kPackDesign.contentThird) {
      if (row.kPackDesign.contentThird.indexOf("http://") == 0 || row.kPackDesign.contentThird.indexOf("https://") == 0) {

        if ( row.kPackDesign.contentThird.indexOf('https') === -1) {
          row.kPackDesign.contentThird =  row.kPackDesign.contentThird.replace('http', 'https')
          //console.log(' row.kPackDesign.contentThird onhandelclick', row.kPackDesign.contentThird);
        }

        var loadedvideo2 = JSON.parse(JSON.stringify(row.kPackDesign.contentThird))
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
    row.rowData = 'readonly';
    this.previousRecords = this.dataSource.data;
    let kPackPhysicsModel: kPackPhysics = new kPackPhysics();
    kPackPhysicsModel.knowledgePackContentId = row.knowledgePackContentId;
    kPackPhysicsModel.layoutType = row.layoutType;
    kPackPhysicsModel.contentFirst = row.kPackDesign.contentFirst;
    kPackPhysicsModel.contentSecond = row.kPackDesign.contentSecond;
    kPackPhysicsModel.contentThird = row.kPackDesign.contentThird;

    kPackPhysicsModel.KnowledgePackId = this.KnowledgePackId;
    kPackPhysicsModel.CreatedDateTime = new Date();
    kPackPhysicsModel.LastUpdateDateTime = new Date();
    kPackPhysicsModel.TabCode = this.tabCode;
    this.loading = true;
    this.kPacksService.createKPackContent(kPackPhysicsModel).subscribe(
      (data) => {
        this.kPacksService
          .getAllKPackContent(this.KnowledgePackId, this.tabCode)
          .subscribe(
            (data) => {
              const KPData = {
                rowData: 'readonly',
                kPackDesign: {
                  kPackDesign1: kPackPhysicsModel.contentFirst,
                  kPackDesign2: kPackPhysicsModel.contentSecond,
                  kPackDesign3: kPackPhysicsModel.contentThird,
                },
                layout: kPackPhysicsModel.layoutType,
                // purposeId: kPackPhysicsModel.PurposeId,
                contentForPurposeId: kPackPhysicsModel.knowledgePackContentId,
              };

              this.previousRecords.forEach((element) => {
                if (
                  kPackPhysicsModel.knowledgePackContentId ==
                  element.knowledgePackContentId
                ) {
                  element.rowData = 'readonly';
                  element.kPackDesign.kPackDesign1 =
                    kPackPhysicsModel.contentFirst;
                  element.kPackDesign.kPackDesign2 =
                    kPackPhysicsModel.contentSecond;
                  element.kPackDesign.kPackDesign3 =
                    kPackPhysicsModel.contentThird;
                  element.layout = kPackPhysicsModel.layoutType;
                  // element.purposeId = kPackPhysicsModel.PurposeId;
                  element.contentForPurposeId =
                    kPackPhysicsModel.knowledgePackContentId;
                }
              });
              this.dataSource.data = this.previousRecords;
              // var res = JSON.parse(JSON.stringify(data));
              // const a = [];
              // res.forEach((el) => {
              //   const KPData = {
              //     rowData: 'readonly',
              //     kPackDesign: {
              //       contentFirst: el['contentFirst'],
              //       contentSecond: el['contentSecond'],
              //       contentThird: el['contentThird'],
              //     },
              //     layoutType: el['layoutType'],
              //     knowledgePackContentId: el['knowledgePackContentId'],
              //   };
              //   return a.push(KPData);
              // });
              // this.dataSource.data = a;
              this.loading = false;
              this.getKPackContent();
            },
            (error) => {
              this.loading = false;
              console.error('There was an error!', error);
            }
          );
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
    if (kPackDesign === 'contentFirst') {
     this.addTextSelected = true;
     this.addVideoSelected = true;
     this.safeSrc = '';
     row.kPackDesign.contentFirst = '';
   } else if (kPackDesign === 'contentSecond') {
     this.addVideoSelected1 = true;
     this.addTextSelected1 = true;
     //this.colarrow = true;
     this.safeSrc1 = '';
     row.kPackDesign.contentSecond ='';
   } else if (kPackDesign === 'contentThird') {
     this.addTextSelected2 = true;
     this.addVideoSelected2 = true;
     //this.colarrow = true;
     this.safeSrc2 = '';
     row.kPackDesign.contentThird ='';
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
    if (kPackDesign === 'contentFirst')
    {
        if (row.kPackDesign.contentFirst.length > 0) {
          if (confirm(temp)) {
            console.log("Implement add video functionality here on text change editor");
            let var1 = row;
            let var2 = kPackDesign;
            let var3;
            if (kPackDesign === 'contentFirst') {
              var3 = row.kPackDesign.contentFirst;
              row.kPackDesign.contentFirst = ''
              this.addVideoSelected = false;
              this.addTextSelected = false;
            }
            this.videoHandler(var1, var2, var3)
          }
        }
        else {
          console.log("Implement add video functionality here on blank text editor");
          let var1 = row;
          let var2 = kPackDesign;
          let var3;
          if (kPackDesign === 'contentFirst') {
            var3 = row.kPackDesign.contentFirst;
            row.kPackDesign.contentFirst = ''
            this.addVideoSelected = false;
            this.addTextSelected = false;
          }
          this.videoHandler(var1, var2, var3)
        }
    }

    if (kPackDesign === 'contentSecond')
    {
        if (row.kPackDesign.contentSecond.length > 0) {
          if (confirm(temp)) {
            console.log("Implement add video functionality here on text change editor");
            let var1 = row;
            let var2 = kPackDesign;
            let var3;
            if (kPackDesign === 'contentSecond') {
              var3 = row.kPackDesign.contentSecond;
              row.kPackDesign.contentSecond = ''
              this.addVideoSelected1 = false;
              this.addTextSelected1 = false;
            }
            this.videoHandler(var1, var2, var3)
          }
        }
        else {
          console.log("Implement add video functionality here on blank text editor");
          let var1 = row;
          let var2 = kPackDesign;
          let var3;
          if (kPackDesign === 'contentSecond') {
            var3 = row.kPackDesign.contentSecond;
            row.kPackDesign.contentSecond = ''
            this.addVideoSelected1 = false;
            this.addTextSelected1 = false;
          }
          this.videoHandler(var1, var2, var3)
        }
    }

    if (kPackDesign === 'contentThird')
    {
        if (row.kPackDesign.contentThird.length > 0) {
          if (confirm(temp)) {
            console.log("Implement add video functionality here on text change editor");
            let var1 = row;
            let var2 = kPackDesign;
            let var3;
            if (kPackDesign === 'contentThird') {
              var3 = row.kPackDesign.contentThird;
              row.kPackDesign.contentThird = ''
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
          if (kPackDesign === 'contentThird') {
            var3 = row.kPackDesign.contentThird;
            row.kPackDesign.contentThird = ''
            this.addVideoSelected2 = false;
            this.addTextSelected2 = false;
          }
          this.videoHandler(var1, var2, var3)
        }
    }
}

changeVideo(row, kPackDesign,requestApprovalTemplate) {
  console.log('change video row',row);
 var temp : any = '';
 if((this.myDiv1.nativeElement.innerHTML != undefined) &&  (this.myDiv1.nativeElement.innerHTML == 'Change Video')){
   temp = "Once Video is changed, Previous Video will be Lost" ;
 }
 if(confirm(temp)) {
   console.log("Implement change video functionality here");
   let var1 = row;
   let var2 = kPackDesign;
   let var3;
   if (kPackDesign === 'contentFirst') {
     var3 = row.kPackDesign.contentFirst;
     row.kPackDesign.contentFirst = ''
    this.addVideoSelected = false;
    this.addTextSelected = false;
    console.log('var3',var3);
  } else if (kPackDesign === 'contentSecond') {
   var3 = row.kPackDesign.contentSecond;
   row.kPackDesign.contentSecond = ''
    this.addVideoSelected1 = false;
    this.addTextSelected1 = false;
  } else if (kPackDesign === 'contentThird') {
   var3 = row.kPackDesign.contentThird;
   row.kPackDesign.kPackDesign3 = ''
   this.addVideoSelected2 = false;
   this.addTextSelected2 = false;
  }
   this.videoHandler(var1,var2,var3)
 }

}

  videoHandler(row, kPackDesign, old:any=0) {
    let video;
    let video1;
    let video2;
    let dialogRef = this.dialog.open(InsertVideoComponent);

    dialogRef.afterClosed().subscribe((result) => {

      // if (kPackDesign === 'contentFirst') {
      //   row.kPackDesign.contentFirst =
      //     row.kPackDesign.contentFirst === undefined
      //       ? '' + videoPlayer
      //       : row.kPackDesign.contentFirst + videoPlayer;
      // } else if (kPackDesign === 'contentSecond') {
      //   row.kPackDesign.contentSecond =
      //     row.kPackDesign.contentSecond === undefined
      //       ? '' + videoPlayer
      //       : row.kPackDesign.contentSecond + videoPlayer;
      // } else if (kPackDesign === 'contentThird') {
      //   row.kPackDesign.contentThird =
      //     row.kPackDesign.contentThird === undefined
      //       ? '' + videoPlayer
      //       : row.kPackDesign.contentThird + videoPlayer;
      // }

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
            if (kPackDesign === 'contentFirst') {
              this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              var a1: any = result;
              video = {
                source: result
              };
              var v = JSON.parse(JSON.stringify(video));
              //console.log('v', v.source);

            }
            else if (kPackDesign === 'contentSecond') {
              this.safeSrc1 = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              var a2: any = result;
              video1 = {
                source: result
              };
              var z = JSON.parse(JSON.stringify(video1));
              //console.log('z', z.source);

            }
            else if (kPackDesign === 'contentThird') {
              this.safeSrc2 = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              var a3: any = result;
              video2 = {
                source: result
              };
              var y = JSON.parse(JSON.stringify(video2));
              //console.log('y', y.source);

            }


            //console.log('video1', video);
            //console.log('video1 JSON.stringify', JSON.stringify(video));
            this.srcURL = result + '#t=0.3';
            //console.log('srcURL', this.srcURL);
            var videoPlayer = `<video width='400' preload="metadata" controls="controls" x-webkit-airplay="allow" src=${this.srcURL}>
            </video>
            <br/>
          `;

            if (kPackDesign === 'contentFirst') {
              row.kPackDesign.contentFirst =
                row.kPackDesign.contentFirst === undefined
                  ? '' + v.source
                  : '' + v.source;
            } else if (kPackDesign === 'contentSecond') {
              row.kPackDesign.contentSecond =
                row.kPackDesign.contentSecond === undefined
                  ? '' + z.source
                  : '' + z.source;
            } else if (kPackDesign === 'contentThird') {
              row.kPackDesign.contentThird =
                row.kPackDesign.contentThird === undefined
                  ? '' + y.source
                  : '' + y.source;
            }
      }
      else{
            console.log('old.length',old.length);
         if(old.length == 0 )
        {

            if (kPackDesign === 'contentFirst') {
              row.kPackDesign.contentFirst = old;
              this.addVideoSelected = true;
              this.addTextSelected = true;
            } else if (kPackDesign === 'contentSecond') {
              row.kPackDesign.contentSecond = old;
              this.addVideoSelected1 = true;
              this.addTextSelected1 = true;
            } else if (kPackDesign === 'contentThird') {
              row.kPackDesign.contentThird = old;
              this.addVideoSelected2 = true;
              this.addTextSelected2 = true;
            }

        }
        else if ((!old.includes("https")) && (old.length > 0))
        {
          if (kPackDesign === 'contentFirst') {
            row.kPackDesign.contentFirst = old;
            this.addVideoSelected = true;
            this.addTextSelected = true;
          } else if (kPackDesign === 'contentSecond') {
            row.kPackDesign.contentSecond = old;
            this.addVideoSelected1 = true;
            this.addTextSelected1 = true;
          } else if (kPackDesign === 'contentThird') {
            row.kPackDesign.contentThird = old;
            this.addVideoSelected2 = true;
            this.addTextSelected2 = true;
          }
        }
        else if((old.includes("https")) && (old.length > 0))
        {
            if (kPackDesign === 'contentFirst') {
              console.log('old',old);
              this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(old);
              video = {
                source: old
              };
              var v = JSON.parse(JSON.stringify(video));
              console.log('v', v.source);
              row.kPackDesign.contentFirst =
                    row.kPackDesign.contentFirst === undefined
                      ? '' + v.source
                      : '' + v.source;
            this.addVideoSelected = false;
            this.addTextSelected = false;

          } else if (kPackDesign === 'contentSecond') {
            console.log('old',old);
            this.safeSrc1 = this.sanitizer.bypassSecurityTrustResourceUrl(old);
            video1 = {
              source: old
            };
            var z = JSON.parse(JSON.stringify(video1));
            console.log('z', z.source);
            row.kPackDesign.contentSecond =
                row.kPackDesign.contentSecond === undefined
                  ? '' + z.source
                  : '' + z.source;
            this.addVideoSelected1 = false;
            this.addTextSelected1 = false;
          } else if (kPackDesign === 'contentThird') {
            console.log('old',old);
            this.safeSrc2 = this.sanitizer.bypassSecurityTrustResourceUrl(old);
              video2 = {
                source: old
              };
              var y = JSON.parse(JSON.stringify(video2));
              console.log('y', y.source);
            row.kPackDesign.contentThird =
                row.kPackDesign.contentThird === undefined
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
    if ( element.layoutType == 'Layout2' || element.layoutType == 'Layout3' ) {
      this.demo2 = element.kPackDesign.contentFirst;
      element.kPackDesign.contentFirst = element.kPackDesign.contentSecond;
      element.kPackDesign.contentSecond = this.demo2;
    }
  }

  onSwap2(element) {
    if ( element.layoutType == 'Layout3' ) {
      this.demo3 = element.kPackDesign.contentThird;
      element.kPackDesign.contentThird = element.kPackDesign.contentSecond;
      element.kPackDesign.contentSecond = this.demo3;
    }
  }

  onLoaddata(data:any=0,ctd:any=0){
    this.loading = true;
    this.currentTabData = data;
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
          contentFirst: el['contentFirst'],
          contentSecond: el['contentSecond'],
          contentThird: el['contentThird'],
        },
        layoutType: el['layoutType'],
        KnowledgePackContentId: el['knowledgePackContentId'],
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
        this.swapStatus(index, index - 1);
        this.getKPackContent();
      }, () => {
      });
    }
 }

  moveDownSimple(element, index: number) {
    if ( index < this.array.length - 1 ) {
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
