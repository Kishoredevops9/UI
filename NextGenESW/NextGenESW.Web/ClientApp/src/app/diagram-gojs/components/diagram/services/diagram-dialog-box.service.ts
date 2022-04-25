import { DialogBoxAction } from '../gojs/types';

export abstract class DiagramDialogBoxService {

  abstract handleDialogBoxRequest(action: DialogBoxAction): Promise<any>;

}
