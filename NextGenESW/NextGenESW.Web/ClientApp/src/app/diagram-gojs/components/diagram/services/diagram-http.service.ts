import { HttpAction } from '../gojs/types';

export abstract class DiagramHttpService {

  abstract handleHttpAction(action: HttpAction): Promise<any>;

}
