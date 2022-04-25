import { Injectable } from '@angular/core';

import { DialogBoxAction } from '../../../diagram-gojs/components/diagram/gojs/types';
import { DiagramDialogBoxService } from '../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';

@Injectable()
export class TaskExecutionMapDialogService extends DiagramDialogBoxService {

  handleDialogBoxRequest(action: DialogBoxAction) {
    return Promise.resolve(null);
  }

}
