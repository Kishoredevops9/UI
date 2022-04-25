import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetsService } from '../assets.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ThemePalette } from '@angular/material/core';
interface DialogData {
        id:number;
        title: string;
        effectiveFrom: any;
        effectiveTo: any;
        index: number;
        description:string;
        lastUpdateDateTime:any;
        assetUrl:string;
        thumbnailUrl:string;
        thumbnailImg:string;
        createdDateTime:any;
}
@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.scss']
})
export class AddAssetsComponent implements OnInit {
  color: ThemePalette = 'primary';
  addAssetForm: FormGroup;
  id: number;
  title: string;
  effectiveFrom: Date = new Date();
  effectiveTo: Date = new Date('12/31/9999');
  filterDate: Date = new Date('12/31/9999');
  index: number;
  description: string;
  lastUpdateDateTime: Date = new Date();
  assetUrl: any;
  thumbnailUrl:'New';
  thumbnailImg:string;
  imageName:any;
  createdDateTime: Date=new Date();
  addEditBTN: boolean = false;
  img: File;
  fileName = '';
  imgPath = '';
  minDate: Date = new Date();
  maxDate: Date = new Date(9999, 11, 31);
  base64textString: any;
  selectedFiles: FileList;
  fileInfos: Observable<any>;
  currentFile: File;
  progress = 0;
  message = '';
  efectiveFromDate: any;
  efectiveToDate: any;

  constructor(
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private dialogRef: MatDialogRef<AddAssetsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private datePipe: DatePipe
    ) {}

  ngOnInit(): void {
    this.fileInfos = this.assetsService.getFiles();
    this.addAssetForm = this.createPhaseForm();
    if (this.data.id != undefined) {
      this.addAssetForm=this.createPhaseForm();
 
    this.addAssetForm.patchValue({
      id:this.data.id,
      title: this.data.title,
      effectiveFrom:this.data.effectiveFrom,
      effectiveTo:this.data.effectiveTo,
      index:this.data.index,
      description:this.data.description,
      lastUpdateDateTime:this.data.lastUpdateDateTime,
      assetUrl:this.data.assetUrl,
      thumbnailImg:this.data.thumbnailImg,
      createdDateTime:this.data.createdDateTime
    });
    this.addEditBTN = true;
    }
  }
  private createPhaseForm(): FormGroup {
    let curentUser = sessionStorage.getItem('displayName')
    return this.fb.group({
      'id': [''],
      'title': [this.title, Validators.required],
      'description': [this.description, Validators.required],
      'assetUrl': [this.assetUrl, Validators.required],
      'createdDateTime':[''],
      'createdUser':[curentUser], 
      'lastUpdateUser':[curentUser], 
      'isHidden':false,
      'isActive':true,
      'thumbnailUrl':['New'],
      'thumbnailImg': [''],
      'version':1,
      'effectiveFrom': [this.effectiveFrom, Validators.required],
      'effectiveTo': [this.effectiveTo, Validators.required],
      'isFeatured': false
    });
  }
  onFileChanged(event) {
    this.selectedFiles = event.target.files;
  }
  onAddAssetFetured(): void {
    let result  = this.addAssetForm.value; 
    // result.thumbnailImgString =  this.base64textString  ; 
    if (result.id != null && result.id != '') {     

      this.assetsService.updateKnowledgeAssets(result).subscribe((data) => {
        this.dialogRef.close();
      })
    }
    else{
      this.progress = 0;
      this.currentFile = this.selectedFiles.item(0);
      console.log( this.currentFile, result) 

          let efectivefromDate = result.effectiveFrom;
          let efectiveToDate = result.effectiveTo;
          result.effectiveFrom = this.datePipe.transform(efectivefromDate, "yyyy-MM-dd'T'HH:mm:ss");
          result.effectiveTo = this.datePipe.transform(efectiveToDate, "yyyy-MM-dd'T'HH:mm:ss");
          console.log('dateFormate', result.effectiveFrom, result.effectiveTo)  
  
      this.assetsService.upload(this.currentFile, result).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.assetsService.getFiles();
            // this.assetsService.getAllKnowledgeAssets().subscribe((data) => {
              this.dialogRef.close();
            // });
    
          }

        }, 
        err => {
          this.progress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile = undefined;
        });
  }
}
  onClose() {
    this.dialogRef.close();
  }
}
