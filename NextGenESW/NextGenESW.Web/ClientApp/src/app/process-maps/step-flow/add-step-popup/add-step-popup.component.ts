import { Component, Input, OnInit, Inject , Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from '@angular-material-components/color-picker';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CreateDocumentService } from '../../../create-document/create-document.service';
import { ProcessMapsService } from '../../process-maps.service';
import { StepflowService } from '../../step-flow/stepflow.service'
import * as ProcessMapsActions from '../../process-maps.actions';
import { ProcessMap } from '../../process-maps.model';
import { hexToRgb } from '../../../shared/utils/hexToRgb';
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '../../process-maps.reducer';
import { StepPageSearchComponent } from '../../step-page-search/step-page-search.component';
import { RecordsService } from '@app/shared/records.service';

@Component({
  selector: 'app-add-step-popup',
  templateUrl: './add-step-popup.component.html',
  styleUrls: ['./add-step-popup.component.scss']
})
export class AddStepPopupComponent implements OnInit {
  @Input() globalData: any;
  hide = true;
  public stepform: FormGroup;
  loading : boolean = false;
  touchUi : boolean
  isMapView: boolean;
  phases:any;
  id:any;
  sfID:any;
  searchData: any = [];
  selectedFormName: number = 0;
  swimLaneId:any;
  phaseId:any;
  processMapId:any;
  constructor(
    public dialogRef: MatDialogRef<AddStepPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    public searchDialog: MatDialog,
    public form: FormBuilder,
    private store: Store<ProcessMapsState>,
    private dbService: NgxIndexedDBService,
    private rservice: RecordsService,
    private router: Router,
    private CreateDocumentService: CreateDocumentService,
    private stepflowService :StepflowService,
    private route : ActivatedRoute,
    public processMapsService : ProcessMapsService
  ) {
    if (data) {
      this.isMapView = !!data.isMapView;
      this.swimLaneId = data.swimLaneId || data.swimLanes[0].id;
      this.processMapId = data.processMapId || data.swimLanes[0].processMapId;
      this.phaseId = data.phaseId;
    }
  }

  ngOnInit(): void {
    console.log('this.swimLaneId', this.swimLaneId);
    this.sfID = sessionStorage.getItem('sfID');
    console.log('this.id || this.sfID',this.id , this.sfID, this.isMapView)
    this.id = parseInt(window.location.href.split("/").pop());

    if (!this.phaseId) {
      this.processMapsService.GetAllPhases(this.id || this.sfID).subscribe(
        (data) => {
          this.phases = data;
          this.stepform.get('phaseId').setValue( this.phases[0].id);
      });
    }

    this.stepform = this.form.group({
      processMapId:[this.id || this.sfID],
      activityTypeId:[8],
      swimLaneId:[this.swimLaneId],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assetContentId:['', [Validators.required]],
      createdUser:[''],
      step: ['', [Validators.required]],
      phaseId:[this.phaseId || '', [Validators.required]],
      color: [this.createColorControl('#C3E9F9'), [Validators.required]],
      borderStyle: ['solid', [Validators.required]],
      borderWidth: ['2', [Validators.required]],
      borderColor: [this.createColorControl('#cccccc'), [Validators.required]],
      version: [1],
    });
  }

  openSearchDialog() {
    const searchDialogRef = this.searchDialog.open(StepPageSearchComponent, {
      width: '90%',
      height: '90%'

    });

    searchDialogRef.afterClosed().subscribe(result => {
      this.swimLaneId = result.swimLaneId;
      if (result) {
        console.log('searchData', result);
        this.searchData.length = 0;
        if (this.selectedFormName == 5) {
          this.searchData.push({
            contentId: result.contentid,  // need to change with cid
            type: 'AP',
            version: 1,
            activityPageId: result.contentid,
          })
        }
        else if (this.selectedFormName == 3) {
          this.searchData.push({// need to change with cid
            contentId: result.contentid,
            type: 'SUB MAP',
            version: 1,
            subProcessMapId: result.id
          })
        }


      }
      this.stepform.controls['assetContentId'].setValue(result.contentid);
      this.stepform.controls['name'].setValue(result.title);
      this.stepform.controls['version'].setValue(result.version);
      // this.activityForm.controls['reviewGate'].setValue(result.phaseid);

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
  //  this.ProcessMapsService.addActivity(action.mapId, action.activity).pipe(
  //         map(activity => {
  //           return fromActions.addActivitySuccess({
  //             activity
  //           })
  //         })
    this.rservice.UpdateBroadcastMessage('true');
    this.processMapsService.addStepActivity(controls
    ).subscribe((data) => {
      this.rservice.UpdateBroadcastMessage('false');
      console.log('data', data);
      this.loading = false;
      // if (!this.isMapView) {
      //   this.router.navigate(['/process-maps/step',data['id']]);
      // }
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

      // this.dbService
      //   .add('step',  Object.assign(   data , { id : data['id'].toString() } ))
      //   .subscribe((key) => {
      //    //
      //   });

        // this.store.dispatch(ProcessMapsActions.addActivitySuccess({
        //   activity: data.activityBlocks[0],
        //   skipsDiagramUpdate: true
        // }));
        // this.dialogRef.close(data.activityBlocks[0]);

        this.dialogRef.close(data);

        // this.stepflowService.getStepFlowByid(this.processMapId).subscribe((data) => {

        // })
        // this.dialogRef.close(data);

    })

  }



  private createColorControl(hex: string) {
    const { r, g, b } = hexToRgb(hex);

    return new Color(r, g, b);
  }



}
