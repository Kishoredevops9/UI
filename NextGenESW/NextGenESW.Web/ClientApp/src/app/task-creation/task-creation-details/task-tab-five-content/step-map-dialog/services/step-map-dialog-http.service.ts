import { Injectable } from '@angular/core';
import { DiagramHttpService } from '../../../../../diagram-gojs/components/diagram/services/diagram-http.service';

@Injectable()
export class StepMapDialogHttpService extends DiagramHttpService {

  handleHttpAction() {
    return Promise.resolve(null);
  }

}
