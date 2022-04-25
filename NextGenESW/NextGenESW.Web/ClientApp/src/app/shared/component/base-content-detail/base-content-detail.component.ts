import { AfterViewInit, Injectable, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ASSET_STATUSES } from '@environments/constants';

import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SharedService } from '@app/shared/shared.service';
import { BaseComponent } from '@app/shared/component/base/base.component';

@Injectable()
export class BaseContentDetailComponent extends BaseComponent implements AfterViewInit {
  ASSET_STATUSES = ASSET_STATUSES;

  currentTabList: MatTab[] = [];
  tabs: QueryList<MatTab>;
  tabGroup: MatTabGroup;
  changeToPreviewStatusChecking = false;

  get selectedIndex() {
    return this.tabGroup?.selectedIndex;
  }

  set selectedIndex(value) {
    // this.tabGroup?.selectedIndex = value;
  }

  _globalData;
  globalDataBuf;
  currentDocumentTitle = '';
  id: number;
  contentIds = '';
  version: string;
  contentType: string;
  status: string;
  documentStatus: string;
  isPreview: boolean;
  isCheckingPreview = false;
  isCheckingRevision = false;
  revise = false;
  previewMode: boolean;

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected sharedService: SharedService) {
    super();
    this.interceptSetter();
    this.computeRouteValue();
    this.listenToOwnerEdit();
  }

  handleOnPreviewClick(value?) {
    this.addQueryParamToCurrentRouter({
      preview: !value
    });
  }

  handleOnRevisionClick(value) {

  }

  ngAfterViewInit(): void {
  }

  onTabChanged($event): void {
    // this.selectedIndex = $event.index;
    // const currentTabName = $event.tab.textLabel.trim();
    // this.addQueryParamToCurrentRouter({
    //   tab: currentTabName
    // });
    this.computeActiveIndex();
    this.computeDocumentTitle();
  }

  computeActiveIndex(tabName?): void {
    if ( this.currentTabList && this.tabGroup ) {
      let tab = this.currentTabList[this.tabGroup.selectedIndex];
      if ( tabName ) {
        const activeIndex = this.getActiveTabByName(tabName);
        if ( activeIndex !== this.tabGroup.selectedIndex ) {
          this.tabGroup.selectedIndex = activeIndex;
        }
        tab = this.currentTabList[activeIndex];
      }
      if ( tab ) {
        const currentTabName = tab.textLabel.trim();
        this.addQueryParamToCurrentRouter({
          tab: currentTabName
        });
      }
    }
    this.computeDocumentTitle();
  }

  addQueryParamToCurrentRouter(params: { [key: string]: any }): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  getActiveTabByName(activeTabName: string): number {
    if ( !activeTabName || !this.currentTabList?.length ) {
      return -1;
    }
    return this.currentTabList.findIndex(tab => tab.textLabel.trim().toLowerCase() === activeTabName.toLowerCase());
  }

  interceptSetter(): void {
    Object.defineProperty(this, 'tabs', {
      set(value) {
        if ( this.isTabChanged(value.toArray()) ) {
          this.currentTabList = value.toArray();
          const { tab } = this.route.snapshot.queryParams;
          this.computeActiveIndex(tab?.trim());
        }
      }
    });
    Object.defineProperty(this, 'globalData', {
      set(value) {
        this.globalDataBuf = JSON.parse(JSON.stringify(value));
        this.computeDocumentStatus(value);
        this._globalData = value;
        this.checkPreviewStatus(value);
        this.changeToPreviewStatus(value);
        if ( value && Object.keys(value).length ) {
          this.checkRevisionStatus(value);
        }
      },
      get() {
        return this._globalData;
      }
    });
  }

  setCurrentDocumentTitle(documentTitle) {
    this.currentDocumentTitle = documentTitle;
    this.computeDocumentTitle();
  }

  private computeDocumentTitle() {
    const activeTab = this.currentTabList[this.selectedIndex];
    if ( activeTab && this.currentDocumentTitle ) {
      // document.title = `${ this.currentDocumentTitle } | ${ activeTab.textLabel }`;
    }
  }

  private computeRouteValue() {
    this.route.queryParams.subscribe(queryParams => {
      if ( queryParams ) {
        const { id, status, version, contentType, preview, revise } = queryParams;
        if ( id ) {
          this.id = id;
        }
        if ( status ) {
          this.status = status;
        }
        if ( version ) {
          this.version = version;
        }

        if ( preview ) {
          this.isPreview = (preview?.toLowerCase() === 'true');
        }

        if ( contentType ) {
          this.contentType = contentType;
        }

        if ( revise ) {
          this.revise = (revise?.toLowerCase() === 'true');
        }
      }
    });
  }

  private computeDocumentStatus(globalData): void {
    if ( !globalData ) {
      return;
    }
    const assetStatusMapping = {
      1: 'Draft',
      2: 'Published',
      3: 'Submitted for Approval'
    };
    this.documentStatus = globalData.assetStatus || (assetStatusMapping[+globalData['assetStatusId']] || globalData.pwStatus || 'Approved, Waiting for JC');
  }

  private checkPreviewStatus(globalData) {
    if ( this.isCheckingPreview ) {
      return;
    }

    this.isCheckingPreview = true;
    setTimeout(() => {
      if ( this.isPreview && globalData ) {
        this.handleOnPreviewClick();
      }
    });
  }

  private changeToPreviewStatus(globalData) {
    if ( globalData?.assetStatus && !this.changeToPreviewStatusChecking ) {
      this.changeToPreviewStatusChecking = true;
      if ( globalData.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && !this.route.snapshot?.queryParams?.preview ) {
        this.addQueryParamToCurrentRouter({
          preview: true
        });
      }
    }
  }

  private checkRevisionStatus() {
    if ( this.isCheckingRevision ) {
      return;
    }

    this.isCheckingRevision = true;
    if ( this.revise ) {
      setTimeout(() => this.handleOnRevisionClick('true'));
    }
  }

  private listenToOwnerEdit() {
    this.sharedService.ownerEditBTN.pipe(this.unsubsribeOnDestroy).subscribe(value => {
      if ( value ) {
        this.addQueryParamToCurrentRouter({
          tab: 'Properties'
        });
        setTimeout(() => {
        this.computeActiveIndex();
        });
      }
    });
  }

  private isTabChanged(newTabListValue): boolean {
    if ( !this.currentTabList || this.currentTabList.length !== newTabListValue?.length ) {
      return true;
    }
    return !!this.currentTabList.find((tab, index) => tab.textLabel !== newTabListValue[index]?.textLabel);
  }
}
