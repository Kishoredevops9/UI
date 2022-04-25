import { Injectable } from '@angular/core';
import { DiagramDialogBoxService } from '../../../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';

@Injectable()
export class StepMapDialogDialogService extends DiagramDialogBoxService {

  handleDialogBoxRequest() {
    return Promise.resolve(null);
  }

}
