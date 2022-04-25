import {
  Component,
  EventEmitter,
  Output,
  ComponentFactoryResolver,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '@app/task-creation/task-creation.model';

@Component({
  selector: 'app-activity-approval-dialog',
  templateUrl: './activity-approval-dialog.component.html',
  styleUrls: ['./activity-approval-dialog.component.scss'],
})
export class ActivityApprovalDialogComponent implements OnInit {
  @Input() item: Item;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  @Output() eksActivityApprovalData = new EventEmitter<any>();
  @ViewChild('contentDetails', { read: ViewContainerRef }) rowContainers;
  isDeviation: boolean = false;
  title = '';
  taskReaid = '';
  expandAllChilds: boolean = false;
  expanded: boolean = false;
  expandDetails: boolean = false;
  loading = false;
  arrowClicked = true;
  public screenWidth: any;
  public screenHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }

  get dragDisabled(): boolean {
    return !this.parentItem;
  }

  get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }

  public allDropListsIds: string[];
  constructor(
    private resolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isDeviation = data.isDeviation;
    this.title = data.title;
    this.taskReaid = data.taskReaid;
    this.item = data.item;
    this.allDropListsIds = [];
  }

  ngOnInit(): void {
    //console.log('a');
    // if (this.expandAllChilds) {
    //   let action = '';
    //   this.expandChildItemDetails(this.item, action);
    // }
  }
  expandAllChildItems(item, action, event) {
    this.expanded = !this.expanded;
    // this.expandChildItemDetails(item, action, event);
    if (action === 'collapse') {
      this.expandAllChilds = false;
    } else {
      this.expandAllChilds = true;
    }
  }

  expandChildItemDetails(item, action) {
    item.expand = !item.expand;
  }

  selectedActivityOnChange(activitySelected: any, rChk:any, $event) {
    if(rChk == 'radio') {
      activitySelected.checked = true;
      activitySelected.Activities[0].checked = true;
    } else {
      activitySelected.checked = $event.checked;
    }
    this.eksActivityApprovalData.emit(activitySelected);
    // const criteriaform = form.value;
    // if (event == '1') {
    //   this.parentItem.disableWIToggler = false;
    // } else {
    //   this.parentItem.disableWIToggler = true;
    // }
    //this.addUpdateStatementExecution(critieriaValue, event, criteriaform);
  }

  uploadFile(event) {
    event.stopPropagation();
  }
  onCheckboxChange(event, item) {
    item.checked = !item.checked;
  }
}
