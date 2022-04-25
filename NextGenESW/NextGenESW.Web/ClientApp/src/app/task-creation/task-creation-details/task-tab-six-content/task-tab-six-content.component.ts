import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
@Component({
  selector: 'app-task-tab-six-content',
  templateUrl: './task-tab-six-content.component.html',
  styleUrls: ['./task-tab-six-content.component.scss'],
})
export class TabSixContentComponent implements OnInit {
  loading = false;
  deviationReportStatus: boolean;
  title: string = '';
  taskId:any;
  taskReaid:any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private tabOneContentService: TabOneContentService) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.taskId = param['id'] ? param['id'] : 0;

      this.tabOneContentService.getTaskById(this.taskId).subscribe((data:any) => {       
        this.taskReaid = data.taskReaid;
      })

    });
    
    
  }
  
  statusReportTask() {
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContentTaskStatus+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContentTaskStatus+"="+this.taskReaid,'_blank');
    }    
  }
  statusReportDev(){
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContentTaskDeviations+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContentTaskDeviations+"="+this.taskReaid,'_blank');
    }    
  }
  statusCrtDeviation(){
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContentCriteriaDeviation+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContentCriteriaDeviation+"="+this.taskReaid,'_blank');
    }    
  }
  statusIncompleteActivity() {
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContentActivityStatusIncomplete+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContentActivityStatusIncomplete+"="+this.taskReaid,'_blank');
    }    
  }
  statusDetailedActivity(){
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContentctivityStatusDetailed+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContentctivityStatusDetailed+"="+this.taskReaid,'_blank');
    }    
  }
  statusContentRevisionCheck(){
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContentTaskContentRevisionCheck+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContentTaskContentRevisionCheck+"="+this.taskReaid,'_blank');
    }    
  }
}
