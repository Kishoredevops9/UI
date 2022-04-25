import { Update } from "@ngrx/entity";
import { ActivityGroup } from "../process-maps.model";

export enum ManageGroupDialogAction {
    ADD,
    DELETE,
    MODIFY,
    REORDER
}

export interface ManageGroupsDialogResponse{
    type: string;
    payload: DeleteGroupPayload[] | AddGroupPayload | ModifyGroupPayload[] | ReorderGroupsPayload;
}

export interface DeleteGroupPayload{
    //{ mapId: this.processMapId, groupId: id }
    mapId: number;
    groupId: number;
}

export interface AddGroupPayload{
    //{ mapId: this.processMapId, activityGroup: this.updateGroupsForm.value }
    mapId: number;
    activityGroup: any;
}

export interface ModifyGroupPayload{
    //{ mapId: this.processMapId, activityGroup: update }
    mapId: number;
    activityGroup: Update<ActivityGroup>;
}

export interface ReorderGroupsPayload{
    activityGroups: ActivityGroup[];
}