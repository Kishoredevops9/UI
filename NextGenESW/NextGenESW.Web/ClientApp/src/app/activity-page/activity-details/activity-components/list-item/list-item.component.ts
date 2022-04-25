import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewContainerRef,
  ComponentFactory,
  ViewChildren,
  ViewChild,
  ComponentFactoryResolver  
} from '@angular/core';
import { Item, WICDdocList } from '../../../activity-page.model';
import { ContentDetailsComponent } from '@app/activity-page/activity-details/activity-components/content-details/content-details.component';
//import { contentTypeCode, oldContentTypeCode } from '@environments/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode, assetTypeConstantValue } from '@environments/constants';


@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {

  @Input() item: Item;
  @Input() docStatus;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }

  @ViewChild('contentDetails', { read: ViewContainerRef }) rowContainers;
  expanded: boolean = false;
  content = [];
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }

  public allDropListsIds: string[];

  get dragDisabled(): boolean {
    return !this.parentItem;
  }

  get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }

  @Output() deleteComponentEvent = new EventEmitter();
  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>;
  constructor(private router: Router, private resolver: ComponentFactoryResolver) {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();

  }

  ngOnInit(): void {
 
  }
  ngOnChanges(event) {
    //console.log('this.docStatus', this.docStatus)
    if (event.bindData && event.bindData.currentValue == true) {

    }
  }

  onDragDrop(event: CdkDragDrop<Item, Item>): void {
    this.itemDrop.emit(event);
  }


  
  expandChildItemDetails(item, action) {
    this.expanded = !this.expanded;
    if (action === 'collapse') {
      this.rowContainers.clear();
    } else {
      this.rowContainers.clear();
      const container = this.rowContainers;
      const factory: ComponentFactory<any> =
        this.resolver.resolveComponentFactory(ContentDetailsComponent);
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.contentInfo = item;
      inlineComponent.instance.docStatus = this.docStatus;
    }
  }

  deleteItem(item) {
    this.deleteComponentEvent.emit(item);
  }

  deleteComponent(item) {
    this.deleteComponentEvent.emit(item);
  }

  checkContentType(item) {
    if (
      item.content.contentType === contentTypeCode.workInstruction ||
      item.content.contentType === oldContentTypeCode.workInstruction
    ) {
      return 'all-type draged-list-wi';
    } else if (
      item.content.contentType === contentTypeCode.activityPage ||
      item.content.contentType === oldContentTypeCode.activityPage
    ) {
      return 'all-type draged-list-ap';
    } else if (
      item.content.contentType === contentTypeCode.criteriaGroup ||
      item.content.contentType === oldContentTypeCode.criteriaGroup
    ) {
      return 'all-type draged-list-cg';
    } else if (
      item.content.contentType === contentTypeCode.guideBook ||
      item.content.contentType === oldContentTypeCode.guideBook
    ) {
      return 'all-type draged-list-gb';
    } else if (
      item.content.contentType === contentTypeCode.relatedContent ||
      item.content.contentType === oldContentTypeCode.relatedContent
    ) {
      return 'all-type draged-list-rc';
    } else if (
      item.content.contentType === contentTypeCode.knowledgePack ||
      item.content.contentType === oldContentTypeCode.knowledgePack
    ) {
      return 'all-type draged-list-kp';
    } else if (
      item.content.contentType === contentTypeCode.tableOfContent ||
      item.content.contentType === oldContentTypeCode.tableOfContent
    ) {
      return 'all-type draged-list-toc';
    } else if (
      item.content.contentType === contentTypeCode.designStandard ||
      item.content.contentType === oldContentTypeCode.designStandard
    ) {
      return 'all-type draged-list-ds';
    } else if (item.content.contentType === contentTypeCode.map) {
      return 'all-type draged-list-m';
    } else if (
      item.content.contentType === contentTypeCode.stepFlow ||
      item.content.contentType === oldContentTypeCode.stepFlow
    ) {
      return 'all-type draged-list-sf';
    }
    return '';
  }

  handleOnContentIDClick(contentData) {
    let element = contentData.content;
    const contID = element.assetContentId || element.contentNo ;
    //let contentType = (element.contentType == "I") ? "WI" : (element.contentType == "G") ? "GB" : (element.contentType == "S") ? "DS" : (element.contentType == "A") ? "AP" : (element.contentType == "C") ? "CG" : (element.contentType == "K") ? "KP" : (element.contentType == "R") ? "RC" : (element.contentType == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', element.contentType);
    sessionStorage.setItem('contentNumber', contID);
    sessionStorage.setItem('contentType', 'published');

    if (element.contentType == 'I' || element.contentType == 'G' || element.contentType == 'S' || element.contentType == 'D' || element.contentType == "WI" || element.contentType == "GB" || element.contentType == "DS") {
      //this.router.navigate([documentPath.publishViewPath, contID]);
      window.open('view-document/' + contID, '_blank');
    } else if (element.contentType === 'M' || element.contentType === 'Map') {
      //this.router.navigate(['/process-maps/edit', contID]);
      window.open('/process-maps/edit' + contID, '_blank');
    } else if (element.contentType === 'F' || element.contentType === 'SF') {
      // this.router.navigate(['/process-maps/create-progressmap', contID]);
      window.open('/process-maps/create-progressmap' + contID, '_blank');
    } else {
      //var assetTypecode = (element.contentType === 'A') ? "AP" : (element.contentType === 'K') ? "KP" : (element.contentType === 'T') ? "TOC" : (element.contentType === 'R') ? "RC" : (element.contentType === 'C') ? "CG" : '';
      // this.router.navigate([documentPath.publishViewPath, element.contentType, contID]);
      window.open('view-document/' + element.contentType + '/' + contID, '_blank');
    }
  }


}
