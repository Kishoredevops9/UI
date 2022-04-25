import { Component, OnInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { AssetsService } from './assets.service';
import { AddAssetsComponent } from './add-assets/add-assets.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfirmDialogModel, ConfirmDialogComponent } from '@app/shared/component/confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-knowledge-asset',
  templateUrl: './knowledge-asset.component.html',
  styleUrls: ['./knowledge-asset.component.scss']
})
export class KnowledgeAssetComponent implements OnInit {
  searchBox;
  dataLists: any;
  fullView = false;
  filterArray = [];
  orginalArray = [];
  filterPopShow: boolean = false;
  filterForm: FormGroup;
  efectiveFromDate: any;
  efectiveToDate: any;
  isFeaturedElement = [];
  searchText: FormControl;
  uniqueAction = [];
  uniqueType = [];
  uniqueName = [];
  uniqueDueDate = [];
  isShowSpinner: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectType: any = 'Knowledge Assets'
  constructor(
    private assetsService: AssetsService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private dbService: NgxIndexedDBService,
    private _snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.getKnowledgeAssets();
    this.filterForm = new FormGroup({
      modifiedByFilter: new FormControl(),
      efectivefromFilter: new FormControl(),
      effectiveToFilter: new FormControl(),
    });
    this.filterForm.patchValue({
      efectivefromFilter: new Date().setHours(0, 0, 0, 0),
      effectiveToFilter: new Date().setHours(0, 0, 0, 0)
    })
  }
  getKnowledgeAssets() {
    this.filterForm?.reset();
    this.filterPopShow = false;
    this.isShowSpinner = true;
    this.dataLists = [];
    this.isFeaturedElement = [];
    this.assetsService.getAllKnowledgeAssets().subscribe(
      (data) => {
        let filterData = data.filter((node) => {
          return node.isActive == true;
        })
        console.log("filterData", filterData)
        filterData.sort(this.sortByDate);
        // console.log("filter Data" , filterData);
        filterData.reverse();
        // console.log("filterdata", filterData);
        this.orginalArray = [...filterData];
        this.dataLists = filterData;
        this.isShowSpinner = false;
        this.uniqueFunction();
      })
  }

  sortByDate( a, b ) {
    if ( a.effectiveFrom < b.effectiveFrom ){
      return -1;
    }
    if ( a.effectiveFrom > b.effectiveFrom ){
      return 1;
    }
    return 0;
  }
  

  onAddKnowledgeAssets(data) {
    const EditData = data;
    console.log(EditData);
    const dialogRef = this.dialog.open(AddAssetsComponent, {
      width: '35%',
      data: EditData
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('done');
      this.getKnowledgeAssets();
    });
  }
  deleteKnowledgeAssete(mapData): void {
    const message = `Are you sure you want to remove?`;
    const dialogData = new ConfirmDialogModel("DELETE?", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      var confirmDataObj = mapData;
      this.assetsService.deleteAssets(confirmDataObj.id).subscribe((data) => {
        if (data) {
          this.getKnowledgeAssets();
        }
      })
    });
  }
  isFeatureChange(data) {
    var fLength = this.dataLists.filter((node) => {
      return node.isFeatured
    }).length;
    if (fLength == 5 && data.isFeatured == false) {
      this._snackBar.open("You can't add more then 5 Knowledge Assets", " ", {
        duration: 3000
      });
    }
    else {
      this.isShowSpinner = true;
      if (data.isFeatured == true) {
        data.isFeatured = false;
      }
      else if (data.isFeatured == false) {
        data.isFeatured = true;
      }
      let result = data;
      this.assetsService.updateKnowledgeAssets(result).subscribe((response) => {
        console.log(response)
        this.dbService
          .update('knowledgeasset', response)
          .subscribe((storeData) => {
            console.log('storeData: ', storeData);
          });
        this.isShowSpinner = false;
      })
    }
  }
  filterpop() {
    this.filterPopShow = true;
    console.log(this.filterPopShow);
  }
  closeFilterPop() {
    this.filterPopShow = false;
  }
  resetFilterPop() {
    this.filterForm.reset();
    this.dataLists = this.orginalArray
  }
  tabChnage($event) {
    this.filterForm?.reset();
    this.filterPopShow = false;
    console.log($event)
    this.searchBox = "";
    this.dataLists = [...this.orginalArray]
  }
  addFilter() {
    this.filterPopShow = false;
  }
  uniqueFunction() {
    console.log(this.dataLists);
    let listdata = this.dataLists;
    let ModifiedBy = [];
    let featuredDate = [];
    let ExpirationDate = [];
    console.log('dddd', listdata);
    for (let i in listdata) {
      ModifiedBy.push(listdata[i].lastUpdateUser);
      featuredDate.push(listdata[i].effectiveFrom);
      ExpirationDate.push(listdata[i].effectiveTo);
    }
    this.uniqueAction = ModifiedBy.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueType = featuredDate.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueName = ExpirationDate.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueDueDate.sort();
    this.uniqueDueDate.reverse();
  }
  applyFilter(kAssets) {
    let arrayData = [];
    let dataholders = [];
    this.filterArray = [];
    this.dataLists = this.orginalArray
    dataholders = this.dataLists;
    dataholders.forEach((element) => {
      let nonEmptyFlag = '';
      let conditionFlag = '';
      console.log('Form Value', this.filterForm.value);
      let efectivefromDate = this.filterForm.value.efectivefromFilter;
      let efectiveToDate = this.filterForm.value.effectiveToFilter;
      this.efectiveFromDate = this.datePipe.transform(efectivefromDate, "yyyy-MM-dd'T'HH:mm:ss");
      this.efectiveToDate = this.datePipe.transform(efectiveToDate, "yyyy-MM-dd'T'HH:mm:ss");
      console.log('filter Date111', this.efectiveToDate, this.efectiveFromDate);
      if (
        this.filterForm.value.modifiedByFilter != '' &&
        this.filterForm.value.modifiedByFilter != undefined &&
        this.filterForm.value.modifiedByFilter != null
      ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.lastUpdateUser === this.filterForm.value.modifiedByFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }
      if (
        this.efectiveFromDate != '' &&
        this.efectiveFromDate != undefined &&
        this.efectiveFromDate != null
      ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.effectiveFrom === this.efectiveFromDate) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }
      if (
        this.efectiveToDate != '' &&
        this.efectiveToDate != undefined &&
        this.efectiveToDate != null
      ) {
        console.log('this.efectiveToDate', element.effectiveTo, this.efectiveToDate);
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.effectiveTo === this.efectiveToDate) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }
      if (nonEmptyFlag == conditionFlag) {
        this.filterArray.push(element);
      }
    });
    arrayData = this.filterArray;
    this.dataLists = arrayData;
    console.log('dfsdfsdfsd', this.dataLists);
  }
  filterItem(value) {
    let tempData = [...this.orginalArray];
    this.dataLists = tempData.filter((node) => {
      return (node.title.search(value) > -1 || node.description.search(value) > -1)
    })
  }

}
