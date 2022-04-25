import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CreateDocumentService } from '../../create-document.service';
import * as fromActions from '../../create-document.actions';
import { CreateDocumentState } from '../../create-document.reducer';
import { selectCreateDocumentList } from './../../../reducers/index';
import { CreateDocument } from '../../create-document.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-wi-lesson-learned',
  templateUrl: './wi-lesson-learned.component.html',
  styleUrls: ['./wi-lesson-learned.component.scss']
})
export class WiLessonLearnedComponent implements OnInit {
  lessonLearnedForm: FormGroup;
  displayedColumns: string[] = ['description', 'linkNumber', 'title'];
  // newsList$: Observable<NewsList[]>;
  lessonlearned$: any;
  constructor(private fb: FormBuilder,
    private createDocumentService: CreateDocumentService,
    private store: Store<CreateDocumentState>) { }

  formControls = {
    description: '',
    linkNumber: '',
    title: '',
  }

  ngOnInit(): void {
    this.lessonLearnedForm = this.fb.group(this.formControls);  
    this.store.dispatch(fromActions.loadCreateDocuments());
    this.loadLessonLearned();
    // this.newsList$ = this.store.pipe(select(selectNewsList));
  }

  loadLessonLearned() {
    this.store.pipe(select(selectCreateDocumentList)).subscribe(
      (data) => {
        this.lessonlearned$ = data;
      }
    );
  }

  saveLessonLearned() {
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
