
import { Action } from '@ngrx/store';

export enum TaskActionTypes {
  ADD_ITEM = '[Task] Add Item',
  DELETE_ITEM = '[Task] Delete Item',
  BUILD_TASK =  '[Build Task]  Item'
}

export class AddItemAction implements Action {
  readonly type = TaskActionTypes.ADD_ITEM

  constructor(public payload: any) { }
}

export class DeleteItemAction implements Action {
  readonly type = TaskActionTypes.DELETE_ITEM

  constructor(public payload: any) { }
}



export class AddBuildTask implements Action {
    type = TaskActionTypes.BUILD_TASK

  constructor(public payload: any) { }
}





export type TaskAction = AddItemAction | DeleteItemAction | AddBuildTask
