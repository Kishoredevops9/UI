import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { SharedService } from '@app/shared/shared.service';
import { hexToRgb } from '../../../shared/utils/hexToRgb';
import { Color } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-add-discipline-modelbox',
  templateUrl: './add-discipline-modelbox.component.html',
  styleUrls: ['./add-discipline-modelbox.component.scss']
})
export class AddDisciplineModelboxComponent implements OnInit {
  public stepform: FormGroup;
  showDisciplineDropDown = false;
  discipline: any;
  selctdata: any = '';

  isUpdateFormForRevision: boolean = false;
  chipDisciplineData: any[] = [];
  chipDisciplineContainer: any = [];
  eventsDiscipline: Subject<void> = new Subject<void>();
  nodePathDiscipline: string = '';
  selectedDisciplineCode: any;
  selectedDisciplineCodenew: any;
  private subscription: Subscription;
  disciplineId: number=0;
  globalData:any;
  activityTabs;
  touchUi : boolean

  constructor(
    public dialogRef: MatDialogRef<AddDisciplineModelboxComponent>,
    public form: FormBuilder,
    private dbService: NgxIndexedDBService,
    private router: Router,
    private createDocumentService: CreateDocumentService,
    private sharedService: SharedService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    console.log(this.data)

    this.globalData=this.sharedService.getExistingMapData()
    this.subscription = this.createDocumentService
    .getAllMetaDisciplineStep()
    .subscribe((res) => {
      this.discipline = res;      
    //   this.mapDisciplanPatch();
      this.activityTabs = this.globalData;
    // this.patchValueForBinding(this.globalData);
    // this.dataBindForPublishMode();

    });


    console.log(this.data);
    this.stepform = this.form.group({
      processMapId:[this.data.id],
      disciplineId:['', [Validators.required]],
      title: [''],
      color: [this.createColorControl('#C3E9F9'), [Validators.required]],
      borderstyle: ['solid', [Validators.required]],
      borderwidth: ['2', [Validators.required]],
      bordercolor: [this.createColorControl('#cccccc'), [Validators.required]],
      protectedInd:[true],
      requiredInd:[true]
    });
  }


  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
removeDisciplineChip(chip) {
  let removeElement = chip.rowNo
  this.chipDisciplineContainer = this.chipDisciplineContainer.filter(obj => obj.rowNo !== removeElement);
  // this.tagData(this.chipContainer);
  chip.isUnchecked = true;
  this.eventsDiscipline.next(chip);
  // this.taskCretionForm.controls['phasesTask'].setValue(this.chipValues);
}

setDisciplineHirerachy(node) {
  // this.disciplineId = node.rowNo;
  this.chipDisciplineContainer = [];
  if (this.discipline.length > 0) {
    this.discipline.forEach(nodeAll => {

      if (nodeAll.rowNo && nodeAll.rowNo == node.rowNo) {
        this.chipDisciplineContainer.push({ name: nodeAll.name, rowNo: node.rowNo });

      } else if (nodeAll.children.length) {
        nodeAll.children.forEach((c1) => {
          if (c1.rowNo && c1.rowNo == node.rowNo) {
            this.chipDisciplineContainer.push({ name: nodeAll.name + ' > ' + c1.name, rowNo: c1.rowNo });

          } else
            if (c1.children.length) {
              c1.children.forEach((c2) => {
                if (c2.rowNo && c2.rowNo == node.rowNo) {
                  this.chipDisciplineContainer.push({ name: nodeAll.name + ' > ' + c1.name + ' > ' + c2.name, rowNo: c2.rowNo });
                } else {
                  if (c2.children.length) {
                    c2.children.forEach((c3) => {
                      if (c3.rowNo && c3.rowNo == node.rowNo) {
                        this.chipDisciplineContainer.push({ name: nodeAll.name + ' > ' + c1.name + ' > ' + c2.name + ' > ' + c3.name, rowNo: c3.rowNo });
                      }
                    });
                  }
                }
              });
            }
        });
      }
    });
  }
}
setNodeValues(value) {

  this.createDocumentService
    .getDisciplineCode(value)
    .subscribe((res) => {
      this.selectedDisciplineCode = res;
      //this.logNode();
      // this.propertiesFormData.controls.disciplineCode.value = this.selectedDisciplineCode;
      // this.propertiesFormData.patchValue({
      //   disciplineCode: this.selectedDisciplineCode.code
      // });
    });
}

  setDisciplineData($event) {
    console.log("setDisciplineData", $event);
    if (this.activityTabs && $event[0]) {
      this.activityTabs.disciplineIds = $event[0].name;
      this.activityTabs.disciplineId = $event[0].rowNo;
    }
    if ($event[0]) {
      this.disciplineId = $event[0].rowNo;
      this.setNodeValues($event[0].rowNo);
    } else {
      this.disciplineId = 0;
    }

    this.chipDisciplineData = $event;

    this.chipDisciplineContainer = $event;
    this.chipDisciplineContainer = [];
    this.selctdata = '';
    if (this.chipDisciplineData.length > 0) {

      // this.removeDisciplineChip(this.chipDisciplineContainer);
      this.chipDisciplineData.forEach(node => {
        this.setDisciplineHirerachy(node);
        // this.selctdata.push(node.name);
        this.selctdata = node.name;
      });
      console.log( ' this.selctdata',this.selctdata);
    }

    // this.taskstore.dispatch(new AddItemAction(
    //   {
    //     data: this.chipContainer,
    //     type: 'property'
    //   }
    // ));
  }
  
  private createColorControl(hex: string) {
    const { r, g, b } = hexToRgb(hex);

    return new Color(r, g, b);
  }

  onSubmit() {
    this.stepform.value.disciplineId=this.disciplineId;
    this.stepform.value.title = this.selctdata;
    console.log('step flow data', this.stepform.value)
    let TempData = { ...this.stepform.value,
      color: this.stepform.value.color.hex,
      bordercolor: this.stepform.value.bordercolor.hex,
    }
    this.dialogRef.close(TempData);
    // this.dbService
    //   .add('step',Object.assign({ id : this.guidGenerator() } ,this.stepform.value  )     )
    //   .subscribe((key) => {
    //     console.log('key: ', key);
    //     this.onClose()
    //     this.router.navigate(['/process-maps/step',key]);
    //   });

}
onClose() {
  this.dialogRef.close();
}

}
