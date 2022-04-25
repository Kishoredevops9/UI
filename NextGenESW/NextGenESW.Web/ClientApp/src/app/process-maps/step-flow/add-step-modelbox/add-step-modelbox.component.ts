import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from '@angular-material-components/color-picker';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CreateDocumentService } from '../../../create-document/create-document.service';
import { ProcessMapsService } from '../../process-maps.service';
import * as ProcessMapsActions from '../../process-maps.actions';
import { ProcessMap } from '../../process-maps.model';
import { hexToRgb } from '../../../shared/utils/hexToRgb';
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '../../process-maps.reducer';

@Component({
  selector: 'app-add-step-modelbox',
  templateUrl: './add-step-modelbox.component.html',
  styleUrls: ['./add-step-modelbox.component.scss']
})
export class AddStepModelboxComponent implements OnInit {
  @Input() globalData: any;
  public stepform: FormGroup;
  loading : boolean = false;
  touchUi : boolean
  isMapView: boolean;
  phases:any;
  id:any;
  sfID:any;
  constructor(
    public dialogRef: MatDialogRef<AddStepModelboxComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    public form: FormBuilder,
    private store: Store<ProcessMapsState>,
    private dbService: NgxIndexedDBService,
    private router: Router,
    private CreateDocumentService: CreateDocumentService,
    private route : ActivatedRoute,
    public processMapsService : ProcessMapsService
  ) {
    this.isMapView = data?.isMapView || false;
  }

  ngOnInit(): void {
    this.sfID = sessionStorage.getItem('sfID');
    this.id = parseInt(window.location.href.split("/").pop());
    this.processMapsService.GetAllPhases(this.id || this.sfID).subscribe(
      (data) => {
        this.phases = data;
        this.stepform.get('phaseId').setValue( this.phases[0].id);
    });

    this.stepform = this.form.group({
      name: ['STEP Title', [Validators.required]],
      phaseId:['', [Validators.required]],
      color: [this.createColorControl('#C3E9F9'), [Validators.required]],
      borderStyle: ['solid', [Validators.required]],
      borderWidth: ['2', [Validators.required]],
      borderColor: [this.createColorControl('#cccccc'), [Validators.required]]
    });



  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }


  submitForm() {
    this.loading = true;
    const controls = {
      ...this.stepform.value,
      color: this.stepform.value.color.hex,
      borderColor: this.stepform.value.borderColor.hex,
    };
    this.CreateDocumentService.CreateNewStep(
      Object.assign(
        this.data?.activity || {},
        controls,
        { "processMapId": this.id || this.sfID }
      )
    ).subscribe((data: ProcessMap) => {

      this.loading = false;
      if (!this.isMapView) {
        this.router.navigate(['/process-maps/step',data['id']]);
      }
      // if (!this.isMapView) {
      //   console.warn("redrect to "+ data['id'])
      //   if(parseInt(window.location.href.split("/").pop())) {
      //     this.router.navigate(['/process-maps/step',data['id']]);
      //   } else {
      //     const contentId = sessionStorage.getItem('sfcontentId');
      //     let stepId:any =data['id'];
      //     let stepContentId = data['contentId'];
      //     console.log('Step Data',data);
      //     sessionStorage.removeItem('stepId');
      //     sessionStorage.setItem('stepId', stepId);
      //     this.router.navigate(['/view-document/step',stepId]);
      //   }

      // }

      this.dbService
        .add('step',  Object.assign(   data , { id : data['id'].toString() } ))
        .subscribe((key) => {
         //
        });

        this.store.dispatch(ProcessMapsActions.addActivitySuccess({
          activity: data.activityBlocks[0],
          skipsDiagramUpdate: true
        }));
        this.dialogRef.close(data.activityBlocks[0]);
    })

  }



  private createColorControl(hex: string) {
    const { r, g, b } = hexToRgb(hex);

    return new Color(r, g, b);
  }



}
