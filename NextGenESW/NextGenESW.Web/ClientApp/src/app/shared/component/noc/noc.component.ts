
import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTable } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from '../../../shared/records.service';

@Component({
  selector: 'app-noc',
  templateUrl: './noc.component.html',
  styleUrls: ['./noc.component.scss'],
})
export class NocComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() nextTab = new EventEmitter();
  @Output() updateNocData = new EventEmitter<string>();
  docStatus = ASSET_STATUSES.DRAFT;
  ASSET_STATUSES = ASSET_STATUSES;
  @Input() globalData;
  @Input() allowMedia = true;
  @Input() publishMode = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  criteriaGroupID;
  version:string;
  natureOfChangeData = [];
  currentDate: any;
  formatedDate: any;
  natureOfChangeObject = { version: null, definition: '' };
  displayedColumns: string[] = ['version', 'date', 'definition', 'delete'];
  loading = false;
  displayName1: string = '';
  contentOwner1: any ='';
  constructor(
    private dbService: NgxIndexedDBService,
    private criteriaGroupService: CriteriaGroupPageService,
    private rservice: RecordsService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.criteriaGroupID = param['contentId']
        ? param['contentId']
        : param['id']
        ? parseInt(param['id'])
        : '';
      // this.dbService.getAll('noc').subscribe((noc) => {
      //   this.natureOfChangeData = noc;

      // });

      const queryParams = this.route.snapshot.queryParams;
      this.version = param['version'] || queryParams['version'] || sessionStorage.getItem('documentversion') || '0';
    });

  }
  ngOnChanges(event) {
    console.log('kp noc this.globalData',this.globalData);
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatus;
        if ( !this.isEditableMode || this.publishMode) {
          this.displayedColumns.pop();
        } else {
          this.displayedColumns = [ 'version', 'date', 'definition', 'delete' ];
        }
        if ( !this.isEditableMode || this.publishMode) {
          // console.log('this.natureOfChangeData', this.natureOfChangeData);
          if(this.globalData.assetTypeId==13 || this.globalData.assetTypeId==14 ){
            this.displayedColumns = ['version', 'date', 'definition'];
            this.loadNatureOfChange();
          }
          else{
            this.bindNocData(event.globalData.currentValue.natureOfChange);
          }



        } else {
          this.loadNatureOfChange();
        }
        this.loading = false;
      }
    }
    //console.log(' this.globalData.contentOwnerId', this.globalData.contentOwnerId);
   // console.log(' in purpose displayName1 ngOnChanges',sessionStorage.getItem('displayName'));
   // console.log(' userMail',sessionStorage.getItem('userMail'));
   this.displayName1 = sessionStorage.getItem('userMail');
   this.contentOwner1 = this.globalData && this.globalData.contentOwnerId;
  }
  ngOnInit(): void {
    console.log('globalData',this.globalData);
  }
  loadNatureOfChange() {
    this.criteriaGroupService
      .getNOCList(this.globalData.contentId, this.globalData.assetTypeId)
      .subscribe(
        (data) => {
          var res = JSON.parse(JSON.stringify(data));
          if (res && res.length > 0) {
            this.natureOfChangeData = res;
            this.updateNocData.emit(JSON.stringify(this.natureOfChangeData));
            this.natureOfChangeData.forEach((el) => {
              if(el['nocdateTime']) {
                var splitTime = el['nocdateTime'].split('T', 1);
                var date = splitTime[0].split('-');
                return (el['nocdate'] = `${date[1]}/${date[2]}/${date[0]}`);
              }
            });
            this.natureOfChangeData.sort(function (a, b) {
              return b['version'] - a['version'];
            });
            if (this.globalData.contentType == 'KP') {

              if (this.displayName1 != this.contentOwner1) {

                if (this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.globalData.assetStatus !== ASSET_STATUSES.ARCHIVED && this.globalData.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.natureOfChangeData && this.natureOfChangeData.length > 0 && !this.publishMode) {
                  this.natureOfChangeData[0]['showAction'] = true;
                  //this.natureOfChangeData[0]['createMode'] = true;
                }

              }

              if (this.displayName1 == this.contentOwner1) {

                if ((this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData.assetStatus !== ASSET_STATUSES.ARCHIVED && this.globalData.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC) && this.natureOfChangeData && this.natureOfChangeData.length > 0 && !this.publishMode) {
                  this.natureOfChangeData[0]['showAction'] = true;
                  //this.natureOfChangeData[0]['createMode'] = true;
                }
              }

            }


            if ((this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData.assetStatus !== ASSET_STATUSES.ARCHIVED && this.globalData.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC) && this.globalData.contentType != 'KP' && this.natureOfChangeData && this.natureOfChangeData.length > 0 && !this.publishMode) {
              this.natureOfChangeData[0]['showAction'] = true;
              //this.natureOfChangeData[0]['createMode'] = true;
            }

          } else {
            this.natureOfChangeData = [];
          }
          this.loading = false;
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }
  onArrowClick() {
    this.nextTab.emit(4);
  }
  add() {
    var rowData = { ...this.natureOfChangeObject };
    const date = new Date();
    rowData['createdDate'] = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    rowData['createMode'] = true;
    rowData['createdDateTime'] = new Date().toISOString().substr(0, 19);
    this.natureOfChangeData.push(rowData);
    this.table.renderRows();
  }
  edit(row) {
    this.rservice.UpdateBroadcastMessage('true');
    row.createMode = true;
    // console.log("edit", row);
    // let editedlessonLearnedData = this.natureOfChangeData && this.natureOfChangeData.find((natureOfChangeData) => {
    //   return (natureOfChangeData.createMode == true)
    // });

    // !editedlessonLearnedData && (row.createMode = true); // Should edit only one row at a time
  }

  delete(i) {
    const data = i;
    this.loading = true;
    this.criteriaGroupService
      .DeleteNatureOfChange(data.criteriaGroupNatureOfChangeId)
      .subscribe(
        (data) => {
          this.loadNatureOfChange();
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }
  getInputText(event, text, i) {
    var rowData = this.natureOfChangeData[i];
    if (text == 'definition') {
      rowData[text] = event.target.innerHTML;
    } else if (text == 'version') {
      rowData[text] = event.target.value;
    }
  }

  //   guidGenerator() {
  //     var S4 = function() {
  //        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  //     };
  //     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  // }

  //   deleteNoc(item, index:number){
  //     this.dbService.delete('noc', index).subscribe((status) => {
  //       console.log("deleteNoc", status);
  //       this.natureOfChangeData = status;
  //     });
  //   }
  handleSave(item) {
    this.rservice.UpdateBroadcastMessage('false');
    var rowData = item;
    // console.log("handleSave", rowData);
    // item.createMode = false;
    // if(item.id) {
    //   this.dbService
    //   .update('noc', Object.assign({ id : item.id } ,rowData  ))
    //   .subscribe((storeData) => {
    //     this.natureOfChangeData = storeData;
    //   });
    // } else{
    //   this.dbService
    //   .add('noc',Object.assign({ id : this.guidGenerator() } ,rowData  )     )
    //   .subscribe((key) => {
    //     console.log('key: ', key);

    //   });
    //   this.dbService.getAll('noc').subscribe((noc) => {
    //     this.natureOfChangeData = noc;

    //   });
    // }

    this.criteriaGroupService.updateNatureOfChange(rowData).subscribe(
      (data) => {
        this.loading = true;
        this.loadNatureOfChange();
      },
      (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      }
    );
  }
  bindNocData(res) {
    if (res && res.length > 0) {
      this.natureOfChangeData = res;
      this.natureOfChangeData.forEach((el) => {
        var splitTime = el['nocdateTime'].split('T', 1);
        var date = splitTime[0].split('-');
        return (el['nocdate'] = `${date[1]}/${date[2]}/${date[0]}`);
      });
      this.natureOfChangeData.sort(function (a, b) {
        return b['version'] - a['version'];
      });
      this.natureOfChangeData.forEach((el) => {

        if (this.globalData.contentType == 'KP') {

          if (this.displayName1 != this.contentOwner1) {
            if ( (this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData.assetStatus !== ASSET_STATUSES.ARCHIVED && this.globalData.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC) && this.globalData.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && !this.publishMode) {
              if ( this.natureOfChangeData.length == 2 && el.version == 1 ) {
                return;
              }
              el['showAction'] = true;
              el['createMode'] = false;
            }

          }

          if (this.displayName1 == this.contentOwner1) {
            // el['showAction'] = true;
            // el['createMode'] = true;
            if (this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData.assetStatus !== ASSET_STATUSES.ARCHIVED  && this.globalData.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && !this.publishMode) {
              if (this.natureOfChangeData.length == 2 && el.version == 1) {
                return;
              }
              el['showAction'] = true;
              el['createMode'] = false;
            }
            else{
            el['showAction'] = true;
            el['createMode'] = true;
            }
          }

        }
        else {
          el['showAction'] = false;
          el['createMode'] = false;
        }

        if ((this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData.assetStatus !== ASSET_STATUSES.ARCHIVED && this.globalData.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC) && this.globalData.contentType != 'KP' && !this.publishMode) {
          if (this.natureOfChangeData.length == 2 && el.version == 1) {
            return;
          }
          el['showAction'] = true;
          el['createMode'] = false;
        } else {
          el['showAction'] = false;
          el['createMode'] = false;
        }


        return el;
      });
    } else {
      this.natureOfChangeData = [];
    }
  }

  public ngOnDestroy() {
    this.rservice.UpdateBroadcastMessage('false');
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}
