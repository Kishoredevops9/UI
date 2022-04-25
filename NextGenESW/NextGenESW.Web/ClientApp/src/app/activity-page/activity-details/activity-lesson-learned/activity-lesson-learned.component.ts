import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { selectCreateDocumentList } from './../../../reducers/index';
import { Store, select } from '@ngrx/store';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { CreateDocumentState } from '@app/create-document/create-document.reducer';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-activity-lesson-learned',
  templateUrl: './activity-lesson-learned.component.html',
  styleUrls: ['./activity-lesson-learned.component.scss']
})
export class ActivityLessonLearnedComponent implements OnInit { 
  id: number;
  contentType: string = 'AP';
  @Input() disableForm: boolean; 
  lessonLearnedForm: FormGroup;
  displayedColumns: string[] = ['description', 'linkNumber', 'title'];
  // newsList$: Observable<NewsList[]>;
  lessonlearned$: any;
  lessonLearnedData: any;
  hasProperty: any = false;
  
  constructor(private fb: FormBuilder,
    private createDocumentService: CreateDocumentService,
    private store: Store<CreateDocumentState>,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
      this.route.params.subscribe((param) => {
        this.id = parseInt(param.id);
        this.hasProperty = isNaN(this.id);
      });      
    }
     
    formControls = {
      description: '',
      linkNumber: '',
      title: '',
      contentId: '',
      contentType: 'AP'
    }
  

  ngOnInit(): void {    
    console.log("dataId",this.id);
    this.lessonLearnedForm = this.fb.group(this.formControls); 
    this.lessonLearnedForm.patchValue({
      contentId: this.id      
    });
  
    // this.store.dispatch(fromAction.loadCreateDocuments());
    this.loadLessonLearned();
    // this.newsList$ = this.store.pipe(select(selectNewsList));
  }

 

  

  loadLessonLearned() {
    // this.store.pipe(select(selectCreateDocumentList)).subscribe(
    //   (data) => {
    //     this.lessonlearned$ = data;
    //   }
    // );
    this.createDocumentService.getLessonLearnedAP(this.id.toString(), this.contentType).subscribe(res => {
      this.lessonlearned$ = res.filter(x => x.contentType == 'AP')
    });
  }

  saveLessonLearned() {
    console.log("LessonLearned",this.lessonLearnedForm.value);
    this.createDocumentService
      .saveLessonLearned(this.lessonLearnedForm.value)
      .subscribe(
        () => {
          this.loadLessonLearned();
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
  }

}
