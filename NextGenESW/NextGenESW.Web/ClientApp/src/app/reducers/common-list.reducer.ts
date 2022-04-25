import { Action, createReducer, on } from '@ngrx/store';
import { adapter, ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import * as CommonListActions from '../shared/action/common-list.action';
import {
  ApprovalRequirementIdList,
  CategoryList,
  ConfidentialitiesDropDownList,
  ExportAuthority,
  ExportComplianceList,
  GetClassifiersDropDownList,
  GetRevionType,
  RCCategoryList,
  RestrictingProgram,
  WiDisciplineDropDownList,
  WiDropDownList
} from '@app/create-document/create-document.model';
import { DisciplineCodeList } from '@app/activity-page/activity-page.model';
import { EngineSectionList } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.model';
import { GetEngineSectionList } from '../shared/action/common-list.action';

export const commonListKey = 'common';
export const wiDropDownListKey = 'wiDropDownList';

export interface CommonListState {
  metaDataDisciplineCode: WiDisciplineDropDownList[];
  activityPageDisciplineCodeList: DisciplineCodeList[];
  exportAuthorityList: ExportAuthority[];
  restrictingProgramList: RestrictingProgram[];
  approvalRequirementList: ApprovalRequirementIdList[];
  categoryList: CategoryList[];
  setOfPhasesList: WiDropDownList[];
  exportComplianceList: ExportComplianceList[];
  classifiersList: GetClassifiersDropDownList[];
  revisionTypeList: GetRevionType[];
  allSetOfCategoriesList: RCCategoryList[];
  confidentialitiesList: ConfidentialitiesDropDownList[];
  engineSectionList: EngineSectionList[];
  [wiDropDownListKey]: { [key: string]: WiDropDownList[] };
  userList: any;
}

export const initialState: CommonListState = adapter.getInitialState({
  metaDataDisciplineCode: [],
  activityPageDisciplineCodeList: [],
  exportAuthorityList: [],
  approvalRequirementList: [],
  categoryList: [],
  setOfPhasesList: [],
  exportComplianceList: [],
  restrictingProgramList: [],
  classifiersList: [],
  revisionTypeList: [],
  allSetOfCategoriesList: [],
  confidentialitiesList: [],
  engineSectionList: [],
  [wiDropDownListKey]: {},
  userList: []
});

const commonListReducer = createReducer(initialState,
  on(CommonListActions.getAllMetaDataDisciplineCode.success, (state, action) => {
    return {
      ...state,
      metaDataDisciplineCode: action.data
    };
  }),

  on(CommonListActions.GetAllApprovalRequirement.success, (state, action) => {
    return {
      ...state,
      approvalRequirementList: action.data
    };
  }),

  on(CommonListActions.GetCategoryList.success, (state, action) => {
    return {
      ...state,
      categoryList: action.data
    };
  }),

  on(CommonListActions.GetWiDropDownList.success, (state, action) => {
    const { listType, data } = action;
    const wiDropDownListKeyDetail = state[wiDropDownListKey];
    return {
      ...state,
      [wiDropDownListKey]: {
        ...wiDropDownListKeyDetail,
        [listType]: data
      }
    };
  }),

  on(CommonListActions.GetAllSetOfPhasesList.success, (state, action) => {
    return {
      ...state,
      setOfPhasesList: action.data
    };
  }),

  on(CommonListActions.GetExportComplianceList.success, (state, action) => {
    return {
      ...state,
      exportComplianceList: action.data
    };
  }),

  on(CommonListActions.GetAllExportAuthorityList.success, (state, action) => {
    return {
      ...state,
      exportAuthorityList: action.data
    };
  }),

  on(CommonListActions.GetAllRestrictingProgramList.success, (state, action) => {
    return {
      ...state,
      restrictingProgramList: action.data
    };
  }),

  on(CommonListActions.GetAllRestrictingProgramList.success, (state, action) => {
    return {
      ...state,
      restrictingProgramList: action.data
    };
  }),

  on(CommonListActions.GetActivityPageDisciplineCodeList.success, (state, action) => {
    return {
      ...state,
      activityPageDisciplineCodeList: action.data
    };
  }),

  on(CommonListActions.GetClassifiersList.success, (state, action) => {
    return {
      ...state,
      classifiersList: action.data
    };
  }),

  on(CommonListActions.GetRevisionTypeList.success, (state, action) => {
    return {
      ...state,
      revisionTypeList: action.data
    };
  }),

  on(CommonListActions.GetAllSetOfCategoriesList.success, (state, action) => {
    return {
      ...state,
      allSetOfCategoriesList: action.data
    };
  }),

  on(CommonListActions.GetAllSetOfCategoriesList.success, (state, action) => {
    return {
      ...state,
      allSetOfCategoriesList: action.data
    };
  }),

  on(CommonListActions.GetConfidentialitiesList.success, (state, action) => {
    return {
      ...state,
      confidentialitiesList: action.data
    };
  }),

  on(CommonListActions.GetEngineSectionList.success, (state, action) => {
    return {
      ...state,
      engineSectionList: action.data
    };
  }),

  on(CommonListActions.GetUserList.success, (state, action) => {
    return {
      ...state,
      userList: action.data
    };
  })
);

export function reducer(state: CommonListState | undefined, action: Action) {
  return commonListReducer(state, action);
}
