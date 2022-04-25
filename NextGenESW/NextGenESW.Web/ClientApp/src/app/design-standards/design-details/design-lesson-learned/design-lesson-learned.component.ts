import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';

@Component({
  selector: 'app-design-lesson-learned',
  templateUrl: './design-lesson-learned.component.html',
  styleUrls: ['./design-lesson-learned.component.scss'],
})
export class DesignLessonLearnedComponent implements OnInit {
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
    contentType: 'DS',
  };

  ngOnInit(): void {
    console.log('dataId', this.id);
    this.lessonLearnedForm = this.fb.group(this.formControls);
    this.lessonLearnedForm.patchValue({
      contentId: this.id,
    });
    this.loadLessonLearned();
  }

  

  loadLessonLearned() {
    this.createGroupService
      .getLessonLearnedAP(this.id.toString())
      .subscribe((res) => {
        this.lessonlearned$ = res.filter((x) => x.contentType == 'DS');
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
