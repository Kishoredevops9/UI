import {
  Component,
  OnInit,
  AfterContentInit,
  DoCheck,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {GetClassifiersDropDownList} from '@app/create-document/create-document.model';
import { selectClassifiersList } from '@app/reducers/common-list.selector';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-classifier-modal',
  templateUrl: './classifier-modal.component.html',
  styleUrls: ['./classifier-modal.component.scss'],
})
export class ClassifierModalComponent implements OnInit {
  filteredClassifierName: any;
  uniqueBusinessUnitArray: any;
  uniqueFuntionalArea: any;
  SelectedClassifierName: any;
  SelectedClassifierid: any;
  SelectedBusinessUnitName: any;
  SelectedfunctionalAreaName: any;
  isBusinessUnitName: boolean = false;
  isfunctionalAreaName: boolean = false;
  uniqueFuntionalAreaArray: any = [];
  uniqueClassifierNameArray: any = [];
  classifiersDropDownList: GetClassifiersDropDownList[];
  filteredClassifers: GetClassifiersDropDownList[] = [];
  private subscription: Subscription;
  
  uniqueFuntName: any = [];
  constructor(
    private createDocumentService: CreateDocumentService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClassifierModalComponent>,
    private store: Store<any>,
  ) {  this.getDisplayClassifier = this.getDisplayClassifier.bind(this);}
  //@Output() childChanged: EventEmitter<any> = new EventEmitter();
  classifierFormData: FormGroup;
  ngOnInit() {
    this.loadDropDowndata();
    //On page load form fields null.
    this.classifierFormData = this.fb.group({
      classifierNameCode: '',
      functionalAreaCode: '',
      businessUnitCode: '',
    });

    // this.createDocumentService
    // .retrieveClassifierName()
    // .subscribe((res) => {
    //   this.classifiersDropDownList = Object.assign([], res);
    // });
  
  }

  loadDropDowndata() {
    this.subscription = this.store.select(selectClassifiersList)
      .subscribe((res) => {
        let classifiersList = Object.assign([], res);

        this.classifiersDropDownList = classifiersList.sort((a, b) => {
          if ( a.lastName < b.lastName ) {
            return -1;
          }
          if ( a.lastName > b.lastName ) {
            return 1;
          }
        });
        this.filteredClassifers = this.classifiersDropDownList;        
      });

  }

  ngAfterViewInit() {
    // On Pop-up load Calling filterClassifierName function to get API responce.
    this.filterClassifierName();
  }
  

  // On form submit sending Selected ClassifierName by ID to Properties component through Dialog box.
  onSubmit() {
    this.SelectedClassifierName =
      this.classifierFormData.controls.classifierNameCode.value;
    //this.childChanged.emit(this.SelectedClassifierName);
    this.dialogRef.close(this.SelectedClassifierName);
  }

  // Calling filterClassifierName function to get API responce.
  filterClassifierName() {
    this.createDocumentService
      .retrieveClassifierName()
      .subscribe((response) => {
        this.filteredClassifierName = response;
        this.classifiersDropDownList = Object.assign([], response);;

        this.uniqueBusinessUnitArray = Array.from(
          new Set(this.filteredClassifierName.map((s) => s.businessUnit))
        ).map((businessUnit) => {
          return {
            businessUnit: businessUnit,
          };
        });

        this.uniqueFuntionalArea = Array.from(
          new Set(this.uniqueClassifierNameArray.map((s) => s.functionalArea))
        ).map((functionalArea) => {
          return {
            functionalArea: functionalArea,
          };
        });
      });
  }

  // Calling onChangeNewbusinessUnitCode function on select of businessUnitCode droprdown and selecting unique function area through it.
  onChangeNewbusinessUnitCode(input: any) {
    this.SelectedBusinessUnitName = input;
    if (this.SelectedBusinessUnitName) {
      this.isBusinessUnitName = true;
      this.isfunctionalAreaName = false;
      this.uniqueFuntionalAreaArray = this.filteredClassifierName.filter(
        (e) => {
          return e.businessUnit == this.SelectedBusinessUnitName;
        }
      );

      this.uniqueFuntName = Array.from(
        new Set(this.uniqueFuntionalAreaArray.map((s) => s.functionalArea))
      ).map((functionalArea) => {
        return {
          functionalArea: functionalArea,
        };
      });
    } else {
      this.isBusinessUnitName = false;
    }
  }

  // Calling onChangeNewfunctionalAreaCode function on select of functionalAreaCode droprdown and selecting unique Classifier Name through it.
  onChangeNewfunctionalAreaCode(input: any) {
    this.SelectedfunctionalAreaName = input;

    if (this.SelectedfunctionalAreaName) {
      this.isfunctionalAreaName = true;
      this.uniqueClassifierNameArray = this.filteredClassifierName.filter(
        (e) => {
          return e.functionalArea == this.SelectedfunctionalAreaName;
        }
      );
    } else {
      this.isfunctionalAreaName = false;
    }
  }

  filterClassifers(name) {
    this.filteredClassifers = this.classifiersDropDownList?.filter((node) => {
      return new RegExp(name.toLocaleLowerCase()).test(
        node.description.toLocaleLowerCase()
      );
    });

  }

  getDisplayClassifier(val) {
    return this.classifiersDropDownList?.find(classifier => classifier.classifiersId === val)?.description;
  }
}
