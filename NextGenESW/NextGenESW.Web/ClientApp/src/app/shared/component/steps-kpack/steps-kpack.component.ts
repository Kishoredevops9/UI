import { Component, Input, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StepkpackService } from './stepkpack.service';
import { ActivatedRoute } from '@angular/router';
import { ProcessMapsService } from '@app/process-maps/process-maps.service';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode, ASSET_STATUSES } from '@environments/constants';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { selectMetaDataDisciplineCode } from '@app/reducers/common-list.selector';
import { WiDisciplineDropDownList } from '@app/create-document/create-document.model';

import { ConfirmDeleteComponent } from "@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component"
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Store, select } from '@ngrx/store';
import { selectSelectedProcessMap } from '@app/reducers';
import { SharedService } from '@app/shared/shared.service';
import { compact, sortBy } from 'lodash';
import { RecordsService } from '@app/shared/records.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
export interface SearchData {
  contentid: any;
}
@Component({
  selector: 'app-steps-kpack',
  templateUrl: './steps-kpack.component.html',
  styleUrls: ['./steps-kpack.component.scss']
})
export class StepsKpackComponent implements OnInit {
  kpackResultTotalLength = 0;
  selectedKPacks: any[] = [];
  @Input() globalData: any;
  @Input() previewMode = false;
  @Input() publishMode = false;
  dataSourceActivitySearch: any;
  activeData: any;
  pageRowCounters = [10, 20, 50, 100];
  dataSource: any = [];
  sfId: any;
  contentsId: any;
  version: any;
  contentType: any;
  status: any;
  DisciplineTag = 0;
  showDisciplineDropDown = false;
  showDropDown = false;
  disciplineId: number;
  chipData: any[] = [];
  chipDisciplineData: any[] = [];
  chipDataUpdate: any[] = [];
  chipContainer: any = [];

  disciplineCode: any;
  selectedDisciplineCode: any;
  chipDisciplineContainer: any = [];
  discipline: any;
  selectedDisciplines = [];
  WIDisciplineCodeList: WiDisciplineDropDownList[];
  private subscription: Subscription;
  @ViewChild('toggleButton1') toggleButton1: ElementRef;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  searchItem: any =
    {
      contentid: "",
      title: "",
      disciplineCode: "",
      chipDisciplineData: ""
    };

  ASSET_STATUSES = ASSET_STATUSES;

  tempArrayVal: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayActivitySearchColumns: string[] = [
    'selectFields',
    'title',
    'id',
    'type',
    'disciplinescode'
  ];
  searchlen: any;
  ekssearchList: SearchData[] = [];
  constructor(public StepkpackService: StepkpackService,
    private route: ActivatedRoute,
    public processMapsService: ProcessMapsService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private mapStore: Store<any>,
    private sharedService: SharedService,
    private renderer: Renderer2,
    private createDocumentService: CreateDocumentService,
    private store: Store<any>,
    private rservice: RecordsService,
  ) {
  }


  goToKp($element) {

    console.log($element);

    // documentPath.publishViewPath,
    // element.documentType,
    // element.contentAssetId,


    window.open(
      documentPath.publishViewPath + "/KP/" + $element.contentAssetId,
      '_blank'
    );


  }
  ngOnChanges(event) {
  }

  //  searchSpecial(){

  //  }

  searchStep() {
    if (this.searchItem.contentid.trim() == "" && this.searchItem.title.trim() == "" && this.searchItem.disciplineCode.trim() == "") {
      this.resetSearch()

    }
    else {
      var localDataSource = [...this.dataSource].filter((node) => {
        return this.tempArrayVal.indexOf(node.contentid) < 0
      })


      let sData;
      if (this.searchItem.contentid && this.searchItem.title && this.searchItem.disciplineCode) {
        let contentid = this.searchItem.contentid.replace("*", "");
        let title = this.searchItem.title.replace("*", "");
        let disciplines = this.searchItem.disciplineCode.replace("*", "");
        sData = localDataSource.filter((node) => {
          if (node && node.disciplinecode) {
            return (
              node.contentid.trim().toLowerCase().includes(contentid.trim().toLowerCase()) && node.title.trim().toLowerCase().includes(title.trim().toLowerCase()) && node.disciplinecode.trim().toLowerCase().includes(disciplines.trim().toLowerCase())
            )
          }
        })
      } else if (this.searchItem.contentid && this.searchItem.title) {
        let contentid = this.searchItem.contentid.replace("*", "");
        let title = this.searchItem.title.replace("*", "");
        sData = localDataSource.filter((node) => {
          return (
            node.contentid.trim().toLowerCase().includes(contentid.trim().toLowerCase()) && node.title.trim().toLowerCase().includes(title.trim().toLowerCase())
          )
        })
      } else if (this.searchItem.contentid && this.searchItem.disciplineCode) {
        let contentid = this.searchItem.contentid.replace("*", "");
        let disciplines = this.searchItem.disciplineCode.replace("*", "");
        sData = localDataSource.filter((node) => {
          if (node && node.disciplinecode) {
            return (
              node.contentid.trim().toLowerCase().includes(contentid.trim().toLowerCase()) && node.disciplinecode.trim().toLowerCase().includes(disciplines.trim().toLowerCase())
            )
          }
        })
      } else if (this.searchItem.title && this.searchItem.disciplineCode) {
        let title = this.searchItem.title.replace("*", "");
        let disciplines = this.searchItem.disciplineCode.replace("*", "");
        sData = localDataSource.filter((node) => {
          if (node && node.disciplinecode) {
            return (
              node.title.trim().toLowerCase().includes(title.trim().toLowerCase()) && node.disciplinecode.trim().toLowerCase().includes(disciplines.trim().toLowerCase())
            )
          }
        })
      } else if (this.searchItem.contentid) {
        let contentid = this.searchItem.contentid.replace("*", "");
        sData = localDataSource.filter((node) => {
          return (
            node.contentid.trim().toLowerCase().includes(contentid.trim().toLowerCase())
          )

        })
      } else if (this.searchItem.title) {
        let title = this.searchItem.title.replace("*", "");
        sData = localDataSource.filter((node) => {
          return (
            node.title.trim().toLowerCase().includes(title.trim().toLowerCase())
          )
        })
      } else if (this.searchItem.disciplineCode) {
        let disciplines = this.searchItem.disciplineCode.replace("*", "");
        sData = localDataSource.filter((node) => {
          if (node && node.disciplinecode) {
            return (
              node.disciplinecode.trim().toLowerCase().includes(disciplines.trim().toLowerCase())
            )
          }
        })
      }

      console.log(localDataSource)

      this.dataSourceActivitySearch = new MatTableDataSource(sData);
      this.searchlen = this.dataSource.length;

    }

  }

  onApplyFilter() {
    this.loadServiceData(0, 5);
    this.paginator.pageIndex = 0;
  }

  resetSearch() {
    this.searchItem =
    {
      contentid: "",
      title: "",
      disciplineCode: ""
    };
    var localDataSource = [...this.dataSource].filter((node) => {
      return this.tempArrayVal.indexOf(node.contentid) < 0
    })

    this.dataSourceActivitySearch = new MatTableDataSource(localDataSource);
    this.searchlen = this.dataSource.length;
    this.selectedDisciplines = [];
  }

  onResetFilter() {
    this.searchItem = {
      contentid: '',
      title: '',
      disciplineCode: ''
    };
    this.loadServiceData(0, 5);
  }

  ngOnInit(): void {
    let contentType;
    this.route.params.subscribe((param) => {
      if (param['id']) {
        this.sfId = param['id'];
        this.version = this.route.snapshot.queryParams['version'];
        this.contentType = this.route.snapshot.queryParams['contentType'];
        this.status = this.route.snapshot.queryParams['status'];
      } else {
        this.contentsId = param['contentId'];
        contentType = param['contentId'].split('-');
        contentType = contentType[1] == 'P' ? 'SP' : 'SP';
        this.contentType = contentType;
        this.version = param['version'] ? param['version'] : '1';
        this.status = this.route.snapshot.queryParams['status'] ? this.route.snapshot.queryParams['status'] : 'published';
      }
      // this.mapStore
      // .pipe(select(selectSelectedProcessMap))
      // .subscribe((processMap) => {
      //   this.globalData = processMap;
      //   this.loadServiceData();
      //   console.log("step-kpack", processMap);
      // });

      // if(this.sfId){
      //   this.processMapsService.getProcessMap(this.sfId)
      //   .subscribe((data) => {
      //     this.globalData = data;
      //     this.loadServiceData();
      //   });
      // }


      // this.loadSteptreeData();

      console.log(":::::::::::::::")
      console.log(this.sfId);
      console.log(this.contentsId);
      console.log(":::::::::::::::")


      if (this.sfId) {
        this.processMapsService.getProcessMap(this.sfId, this.contentsId, this.contentType, this.status, this.version)
          .subscribe((data) => {
            this.globalData = data;
            this.getallKpack(this.globalData.contentId, this.globalData.version)
            //  this.loadServiceData();
          });
      } else {
        if (this.contentsId) {
          this.processMapsService.getProcessMapbycontentID(this.contentsId, this.contentType, this.version, this.status)
            .subscribe((data) => {
              this.globalData = data;
              this.getallKpack(this.globalData.contentId, this.globalData.version)
              //   this.loadServiceData();
            });
        }
      }
    });

    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target['parentElement'] &&
        e.target['parentElement'].id == 'btnId2'
      ) {
        this.DisciplineTag = 0;
        this.DisciplineTag = this.DisciplineTag + 1;
        this.showDisciplineDropDown = false;
      } else if (
        e.target['parentElement'] &&
        e.target['parentElement'].id == 'btnId'
      ) {
        this.DisciplineTag = 0;
        this.DisciplineTag = this.DisciplineTag - 1;
        this.showDropDown = false;
      }

      if (this.DisciplineTag < 0) {
        if (typeof this.toggleButton !== 'undefined') {
          this.showDropDown = false;
          if (e.target['parentElement'] !== this.toggleButton.nativeElement) {
            if ((e.target as any)?.closest('discipline')) {
              this.showDisciplineDropDown = true;
            } else {
              this.showDisciplineDropDown = false;
            }
          }
        }
      }
      if (this.DisciplineTag > 0) {
        if (typeof this.toggleButton1 !== 'undefined') {
          this.showDisciplineDropDown = false;
          if (e.target['parentElement'] !== this.toggleButton1.nativeElement) {
            if (e.target['parentElement'].className == 'mat-tree cdk-tree') {
              this.showDropDown = true;
            } else if (
              e.target['parentElement'].className == 'mat-checkbox-layout'
            ) {
              this.showDropDown = true;
            } else if (
              e.target['parentElement'].className == 'mat-button-wrapper'
            ) {
              this.showDropDown = true;
            } else {
              this.showDropDown = false;
            }
          }
        }
      }
    });

    this.subscription = this.createDocumentService
      .getAllMetaDiscipline()
      .subscribe((res) => {

        this.discipline = res;


      });

    this.subscription = this.store
      .select(selectMetaDataDisciplineCode)
      .subscribe((res) => {
        this.WIDisciplineCodeList = sortBy(res, 'code');
      });
  }
  setNodeValues(value) {
    this.createDocumentService.getDisciplineCode(value).subscribe((res) => {
      this.selectedDisciplineCode = res;
      this.searchItem.disciplineCode = this.selectedDisciplineCode.code;
    });

  }

  findNodeDisciplineHirerachical(node, disciplineId, prefix = '') {
    if (!node) {
      return null;
    }

    if (`${node.rowNo}` === `${disciplineId}`) {
      return {
        name: `${prefix}${prefix ? ' > ' : ''}${node.name}`,
        rowNo: node.rowNo
      };
    }

    const findingChildren = compact(node.children?.map(item => this.findNodeDisciplineHirerachical(item, disciplineId, `${prefix}${prefix ? ' > ' : ''}${item.name}`)));

    return findingChildren.length ? findingChildren[0] : null;
  }
  setDisciplineHirerachy(node) {
    // this.disciplineId = node.rowNo;
    this.chipDisciplineContainer = [];
    if (this.discipline.length > 0) {
      [].push.apply(this.chipDisciplineContainer, compact(this.discipline?.map(n => this.findNodeDisciplineHirerachical(n, node.rowNo))));
    }
  }
  // onChangeNewDisciplineCode(input: any) {
  //   if (typeof this.globalData !== 'undefined') {
  //     this.activityTabs.disciplineCodeId =
  //       this.propertiesFormData.controls.disciplineCode.value;
  //     this.draftViewData.disciplineCodeId =
  //       this.propertiesFormData.controls.disciplineCode.value;
  //   }
  // }

  setDisciplineData($event) {
    if ($event[0]) {
      this.disciplineId = $event[0].rowNo;
      this.setNodeValues($event[0].rowNo);
    }

    this.chipDisciplineData = $event;
    this.chipDisciplineContainer = $event;
    this.chipDisciplineContainer = [];
    if (this.chipDisciplineData && this.chipDisciplineData.length > 0) {
      // this.removeDisciplineChip(this.chipDisciplineContainer);
      this.chipDisciplineData.forEach((node) => {
        this.setDisciplineHirerachy(node);
      });
    }
  }
  deteteKpack(id) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '42%',
      data: {
        message: "Are you sure you want to delete?"
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.rservice.UpdateBroadcastMessage('true');
        this.StepkpackService.kpackDelete(id).subscribe((node) => {
          if (node) {
            this.rservice.UpdateBroadcastMessage('false');
            this.loadServiceData()

          }
        })
      }

    })

  }

  getallKpack($id, version) {
    this.StepkpackService.getAddedallkpack($id, version).subscribe((node: any) => {
      this.activeData = new MatTableDataSource(node);

      this.tempArrayVal = (node || []).map(item => item.contentAssetId);

      var localDataSource = [...this.dataSource].map((node) => ({
        ...node,
        checked: this.tempArrayVal.includes(node.contentid),
        selectable: !this.tempArrayVal.includes(node.contentid)
      }))

      this.dataSourceActivitySearch = new MatTableDataSource(localDataSource);
      this.searchlen = this.dataSource.length;

      this.ngxService.stopLoader("kpackloader");

    })

  }
  addToSelected() {
    console.log("Add to selected")
    console.log(this.globalData)
    console.log(this.dataSourceActivitySearch)

    const toSaveKPacks = this.selectedKPacks.map(item => ({
      parentContentAssetId: this.globalData.contentId,
      parentContentTypeId: 13,
      contentAssetId: item.contentid,
      version: this.globalData.version
    }))

    this.StepkpackService.addMultiKpack(toSaveKPacks).subscribe((node) => {
      this.selectedKPacks = [];
      this.loadServiceData();
      this.rservice.UpdateBroadcastMessage('false');
    })
  }

  loadServiceData(from = 0, size = 5, resetPagination = true) {
    const contentId = this.searchItem.contentid?.trim();
    const title = this.searchItem.title?.trim();
    const disciplineCode = this.searchItem.disciplineCode?.trim();
    this.ngxService.startLoader("kpackloader");

    this.StepkpackService.getKpack(from, size, { contentId, title, disciplineCode }).subscribe((data: any) => {
      let tempData = data['hits']['hits'];
      this.kpackResultTotalLength = data.hits?.total?.value || 0;
      this.dataSource = [];
      tempData.map((node) => {
        this.dataSource.push(node._source)
      })
      if (resetPagination && this.paginator) {
        this.paginator.pageIndex = 0;
      }

      this.getallKpack(this.globalData.contentId, this.globalData.version)

    })
  }

  onPageChanged($event: PageEvent) {
    const from = $event.pageIndex;
    const pageSize = $event.pageSize;
    const resetPagination = false;
    this.loadServiceData(from * pageSize, pageSize, resetPagination);
  }

  onSelectedKPacksChanged(kPack, $event: MatCheckboxChange) {
    $event.checked && this.selectedKPacks.push(kPack);
    !$event.checked && this.onRemoveSltKPack(kPack);
  }

  onRemoveSltKPack(kPack) {
    this.selectedKPacks = this.selectedKPacks
      .filter(item => item.contentid !== kPack.contentid)
  }

  isSelectedKPack(element) {
    return this.selectedKPacks.find(item => item.contentid === element.contentid);
  }

  isAlreadyUsed(kPack) {
    return this.tempArrayVal.includes(kPack.contentid);
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}
