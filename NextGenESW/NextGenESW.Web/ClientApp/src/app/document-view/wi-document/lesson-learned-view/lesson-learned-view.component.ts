import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentViewService } from '@app/document-view/document-view.service';
import { HttpHelperService } from '@app/shared/http-helper.service';

@Component({
  selector: 'app-lesson-learned-view',
  templateUrl: './lesson-learned-view.component.html',
  styleUrls: ['./lesson-learned-view.component.scss'],
})
export class LessonLearnedViewComponent implements OnInit {
  items;
  id: number;
  hasProperty: any = false;
  lessonlearned$: any;
  //Todo get content Type from page
  contentType: string = 'WI'
  displayedColumns: string[] = ['description', 'linkNumber', 'title'];
  documentType = '';
  constructor(private http: HttpHelperService,
    private documentService: DocumentViewService,
    private route: ActivatedRoute,
    ) {
      this.route.params.subscribe((param) => {
        this.id = parseInt(param.id);
        this.hasProperty = isNaN(this.id);
        this.documentType = param.documentType;
      });   
    }

  ngOnInit(): void {
    this.loadLessonLearned();
  }
  loadLessonLearned() {
    this.documentService.getLessonLearnedAP(this.id.toString(), this.documentType).subscribe(res => {
      this.items = res;
    });
  }
}
