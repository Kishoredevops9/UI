import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Overlay, OverlayContainer, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal, Portal, ComponentPortal } from '@angular/cdk/portal';
import {
  Router,
  ActivatedRoute,
  ActivationStart,
  NavigationStart,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
@Component({
  selector: 'app-global-panel',
  templateUrl: './global-panel.component.html',
  styleUrls: ['./global-panel.component.scss'],
})
export class GlobalPanelComponent implements OnInit {
  isAuditVisible: boolean;
  isAttachmentVisible: boolean;
  isReportVisible: boolean;
  entityId;
  overlayRef;
  screenName: any;
  showComponent: string;
  isMessageVisible: boolean = false;
  contextInfo: ContextInfo;

  @ViewChild('sidenav') sidenavOrigin: OverlayContainer;
  @ViewChild('sidenavTemplate') sidenavTemplate: CdkPortal;
  @Input() globalData: any;
  showChatIcon: boolean = false;
  constructor(
    public overlay: Overlay,
    private elemRef: ElementRef,
    private router: Router,
    private globalService: GlobalService,
    private contextService: ContextService
  ) {}

  ngOnInit(): void {
    this.isMessageVisible = false;

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
      }
      if (event instanceof ActivationStart) {
        if (event.snapshot.data.module) {
          this.screenName = event.snapshot.data['module'];
          this.getShowIconList();
        }
      }
    });

    this.contextService.getContextInfo.subscribe((context) => {
      this.contextInfo = context;
      this.globalData = this.contextInfo.entityInfo;
      const email = sessionStorage.getItem('userMail');
      //this.showChatIcon = this.globalData && this.globalData.contentOwnerId == email && this.globalData.assetStatusId == 3;
      this.getShowIconList();
      this.closeGlobalPanel();
    });

    this.router.events.subscribe((routerEvent: any) => {
      // this.isMessageVisible = true;
      if (routerEvent instanceof ActivationStart) {
        if (routerEvent.snapshot.data.module) {
          this.screenName = routerEvent.snapshot.data['module'];
          this.getShowIconList();
        }
      }
    });
  }

  getShowIconList() {
    const commentVisible = this.globalService.getCommentsVisibility(
      this.screenName
    );
    this.isMessageVisible = commentVisible || false;
  }

  showChildComponent(childName) {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    if (childName === this.showComponent) {
      this.overlayRef.detach();
      this.showComponent = null;
    } else {
      const strategy = this.overlay.position().global().right('0');

      //  flexibleConnectedTo() position().connectedTo(
      //       this.sidenavOrigin.elementRef,
      //       { originX: 'start', originY: 'top' },
      // { overlayX: 'end', overlayY: 'top' });
      this.showComponent = childName;
      const config = new OverlayConfig({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        positionStrategy: strategy,
        height: '100%',
        // width: '40%',
      });
      this.overlayRef = this.overlay.create(config);
      this.overlayRef.attach(this.sidenavTemplate);
      this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());
    }
  }

  closeComments(childName) {
    this.overlayRef.detach();
  }

  closeGlobalPanel() {
    if (this.overlayRef && !this.isMessageVisible) {
      this.overlayRef.detach();
    }
  }
}
