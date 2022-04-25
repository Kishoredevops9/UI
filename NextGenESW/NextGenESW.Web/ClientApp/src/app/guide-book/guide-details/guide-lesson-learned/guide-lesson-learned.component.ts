import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guide-lesson-learned',
  templateUrl: './guide-lesson-learned.component.html',
  styleUrls: ['./guide-lesson-learned.component.scss']
})
export class GuideLessonLearnedComponent implements OnInit {

  id: number;
  @Input() disableForm: boolean;
  lessonLearnedForm: FormGroup;
  displayedColumns: string[] = ['description', 'linkNumber', 'title'];
  lessonlearned$: any;
  lessonLearnedData: any;
  hasProperty: any = false;

  constructor(
    private fb: FormBuilder,
    private createGroupService: CriteriaGroupPageService,
    private route: ActivatedRoute
  ) {
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
    contentType: 'CG',
  };

  ngOnInit(): void {
    console.log('dataId', this.id);
    this.lessonLearnedForm = this.fb.group(this.formControls);
    this.lessonLearnedForm.patchValue({
      contentId: this.id,
    });
    this.loadLessonLearned();
  }

  ngOnChanges() {}

  loadLessonLearned() {
    this.createGroupService
      .getLessonLearnedAP(this.id.toString())
      .subscribe((res) => {
        this.lessonlearned$ = res.filter((x) => x.contentType == 'CG');
      });
  }

  saveLessonLearned() {
    console.log('LessonLearned', this.lessonLearnedForm.value);
    this.createGroupService
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