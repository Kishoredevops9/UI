import { Injectable } from '@angular/core';
import { DiagramHttpService } from '../../../diagram-gojs/components/diagram/services/diagram-http.service';

@Injectable()
export class TaskExecutionMapHttpService extends DiagramHttpService {

  handleHttpAction() {
    return Promise.resolve(null);
  }

}
