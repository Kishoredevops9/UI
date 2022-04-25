export interface CreateDocument {
  description: string;
  linkNumber: string;
  title: string;
  contentId: string;
  contentType: string;
}

export interface RestrictingProgram {
  controllingProgramId: string;
  name: string;
}

export interface ExportAuthority {
  exportAuthorityId: string;
  exportAuthorityCode: string;
}

export interface WiDropDownList {
  id: string;
  name: string;
}

export interface ApprovalRequirementIdList {
  approvalRequirementId: number;
  name: string;
}
export interface ConfidentialitiesDropDownList {
  confidentialityId: string;
  name: string;
}

export interface GetClassifiersDropDownList {
  classifiersId: string;
  name: string;
  description:string;
}

export interface GetRevionType {
  revisionTypeId: number,
  revisionTypeCode:string,
  description:string
}

export interface ExportComplianceList {
  exportComplianceId: string;
  documentName: string;
}

export interface EngineFamilyList {
  id: string;
  engineName: string;
  engineDescription: string;
  status: string;
}

export interface CategoryList {
  id: string;
  categoryCode: string;
  description: string;
  status: string;
  contentId: string;
  contentType: string;
}
export interface Tag {
  name: string;
}

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

interface FoodNode {
  name: string;
  id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  children?: FoodNode[];
}
export interface TagList {
  id:number;
  tagsId: string;
  name: string;
  parentId: number;
  rootParentId?: number;
}

export const TREE_DATA = [{
  "id": 1,
  "name": "Fan and Compressor",
  "status": null,
  "createdOn": null,
  "creatorClockId": null,
  "modifiedOn": null,
  "modifierClockId": null,
  "subDisciplineCollection": [
    {
      "id": 1,
      "disciplineID": 1,
      "name": "Acoustics",
      "status": null,
      "createdOn": null,
      "creatorClockId": null,
      "modifiedOn": null,
      "modifierClockId": null,
      "subSubDisciplineCollection": [
        {
          "id": 1,
          "subDesciplineID": 1,
          "name": "Fan and Compressor",
          "status": null,
          "createdOn": null,
          "creatorClockId": null,
          "modifiedOn": null,
          "modifierClockId": null,
          "subSubSubCollection": [
            {
              "id": 17,
              "subDesciplineID": 3,
              "name": "Clearance Analysis",
              "status": null,
              "createdOn": null,
              "creatorClockId": null,
              "modifiedOn": null,
              "modifierClockId": null,
              "subSubSubCollection": [
                {
                  "id": 17,
                  "subDesciplineID": 3,
                  "name": "Clearance Analysis",
                  "status": null,
                  "createdOn": null,
                  "creatorClockId": null,
                  "modifiedOn": null,
                  "modifierClockId": null,
                  "subSubSubCollection": [
                    {
                      "id": 26,
                      "subSubDisciplineId": 38,
                      "name": "Actuated NOZ - Nozzle",
                      "status": null,
                      "createdOn": null,
                      "creatorClockId": null,
                      "modifiedOn": null,
                      "modifierClockId": null
                    }
                  ],
                  "activityPage": null,
                  "eksDisciplineCode": null
                }],
              "activityPage": null,
              "eksDisciplineCode": null
            }],
          "activityPage": null,
          "eksDisciplineCode": null
        },
        {
          "id": 2,
          "subDesciplineID": 1,
          "name": "Systems",
          "status": null,
          "createdOn": null,
          "creatorClockId": null,
          "modifiedOn": null,
          "modifierClockId": null,
          "subSubSubCollection": [
            {
              "id": 17,
              "subDesciplineID": 3,
              "name": "Clearance Analysis",
              "status": null,
              "createdOn": null,
              "creatorClockId": null,
              "modifiedOn": null,
              "modifierClockId": null,
              "subSubSubCollection": [
                {
                  "id": 26,
                  "subSubDisciplineId": 38,
                  "name": "Actuated NOZ - Nozzle",
                  "status": null,
                  "createdOn": null,
                  "creatorClockId": null,
                  "modifiedOn": null,
                  "modifierClockId": null
                }
              ],
              "activityPage": null,
              "eksDisciplineCode": null
            }],
          "activityPage": null,
          "eksDisciplineCode": null
        },
        {
          "id": 3,
          "subDesciplineID": 1,
          "name": "Turbine",
          "status": null,
          "createdOn": null,
          "creatorClockId": null,
          "modifiedOn": null,
          "modifierClockId": null,
          "subSubSubCollection": [
            {
              "id": 17,
              "subDesciplineID": 3,
              "name": "Clearance Analysis",
              "status": null,
              "createdOn": null,
              "creatorClockId": null,
              "modifiedOn": null,
              "modifierClockId": null,
              "subSubSubCollection": [
                {
                  "id": 26,
                  "subSubDisciplineId": 38,
                  "name": "Actuated NOZ - Nozzle",
                  "status": null,
                  "createdOn": null,
                  "creatorClockId": null,
                  "modifiedOn": null,
                  "modifierClockId": null
                }
              ],
              "activityPage": null,
              "eksDisciplineCode": null
            }],
          "activityPage": null,
          "eksDisciplineCode": null
        }
      ]
    }]
  }]

  export interface WIDocumentList {
    title: string;
    disciplineCodeId: number;
    engineFamilyId: number;
    contentOwnerId: string;
    classifierId: number;
    phaseId: number;
    confidentialityId: number;
    revisionTypeId: number;
    programControlled: string;
    outsourceable: string;
    tags: string;
  }

  export interface WiDisciplineDropDownList {
    id: string;
    code: string;
  }

  export interface RCCategoryList {
    categoryId: number;
    categoryCode: string;
    description: string;
    version: number;
    effectiveFrom: string;
    effectiveTo: string;
    createdDateTime: string;
    createdUser: string;
    lastUpdateDateTime: string;
    lastUpdateUser: string;
  }