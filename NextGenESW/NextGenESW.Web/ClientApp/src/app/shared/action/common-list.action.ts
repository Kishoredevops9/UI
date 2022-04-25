import { createAction, props } from '@ngrx/store';
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

export const getAllMetaDataDisciplineCode = {
  load: createAction(
    '[MetaDataDiscipline GetAllDisciplineCode List Component] Load DisciplineCode'
  ),
  success: createAction(
    '[MetaDataDiscipline GetAllDisciplineCode Effect] Load DisciplineCode Success',
    props<{ data: WiDisciplineDropDownList[] }>()
  ),
  failure: createAction(
    '[MetaDataDiscipline GetAllDisciplineCode Effect] Load DisciplineCode Failure',
    props<{ error: any }>()
  )
};

export const GetCategoryList = {
  load: createAction(
    '[Common GetCategory List Component] Load Category List'
  ),
  success: createAction(
    '[Common GetCategory List Effect] Load Category List Success',
    props<{ data: CategoryList[] }>()
  ),
  failure: createAction(
    '[Common GetCategory List Effect] Load Category List Failure',
    props<{ error: any }>()
  )
};

export const GetWiDropDownList = {
  load: createAction(
    '[Common GetWiDropDown List Component] Load WiDropDown List',
    props<{ listType: string }>()
  ),
  success: createAction(
    '[Common GetWiDropDown List Effect] Load WiDropDown List Success',
    props<{ data: WiDropDownList[], listType: string }>()
  ),
  failure: createAction(
    '[Common GetWiDropDown List Effect] Load WiDropDown List Failure',
    props<{ error: any }>()
  )
};

export const GetAllApprovalRequirement = {
  load: createAction(
    '[Properties GetAllApprovalRequirement List Component] Load ApprovalRequirement'
  ),
  success: createAction(
    '[Properties GetAllApprovalRequirement Effect] Load ApprovalRequirement Success',
    props<{ data: ApprovalRequirementIdList[] }>()
  ),
  failure: createAction(
    '[Properties GetAllApprovalRequirement Effect] Load ApprovalRequirement Failure',
    props<{ error: any }>()
  )
};

export const GetAllSetOfPhasesList = {
  load: createAction(
    '[Common Set of Phases List Component] Load Set of Phases'
  ),
  success: createAction(
    '[Common Set of Phases Effect] Load Set of Phases Success',
    props<{ data: WiDropDownList[] }>()
  ),
  failure: createAction(
    '[Common Set of Phases Effect] Load Set of Phases Failure',
    props<{ error: any }>()
  )
};

export const GetExportComplianceList = {
  load: createAction(
    '[Common ExportCompliance List Component] Load ExportCompliance'
  ),
  success: createAction(
    '[Common ExportCompliance List Effect] Load ExportCompliance Success',
    props<{ data: ExportComplianceList[] }>()
  ),
  failure: createAction(
    '[Common ExportCompliance List Effect] Load ExportCompliance Failure',
    props<{ error: any }>()
  )
};

export const GetAllExportAuthorityList = {
  load: createAction(
    '[Common ExportAuthority List Component] Load ExportAuthority'
  ),
  success: createAction(
    '[Common ExportAuthority List Effect] Load ExportAuthority Success',
    props<{ data: ExportAuthority[] }>()
  ),
  failure: createAction(
    '[Common ExportAuthority List Effect] Load ExportAuthority Failure',
    props<{ error: any }>()
  )
};

export const GetAllRestrictingProgramList = {
  load: createAction(
    '[Common RestrictingProgram List Component] Load RestrictingProgram'
  ),
  success: createAction(
    '[Common RestrictingProgram List Effect] Load RestrictingProgram Success',
    props<{ data: RestrictingProgram[] }>()
  ),
  failure: createAction(
    '[Common RestrictingProgram List Effect] Load RestrictingProgram Failure',
    props<{ error: any }>()
  )
};

export const GetActivityPageDisciplineCodeList = {
  load: createAction(
    '[Common ActivityPageDisciplineCode List Component] Load ActivityPageDisciplineCode'
  ),
  success: createAction(
    '[Common ActivityPageDisciplineCode List Effect] Load ActivityPageDisciplineCode Success',
    props<{ data: DisciplineCodeList[] }>()
  ),
  failure: createAction(
    '[Common ActivityPageDisciplineCode List Effect] Load ActivityPageDisciplineCode Failure',
    props<{ error: any }>()
  )
};

export const GetClassifiersList = {
  load: createAction(
    '[Common Classifiers List Component] Load Classifiers List'
  ),
  success: createAction(
    '[Common Classifiers List Effect] Load Classifiers Success',
    props<{ data: GetClassifiersDropDownList[] }>()
  ),
  failure: createAction(
    '[Common Classifiers List Effect] Load Classifiers Failure',
    props<{ error: any }>()
  )
};

export const GetRevisionTypeList = {
  load: createAction(
    '[Common RevisionType List Component] Load RevisionType List'
  ),
  success: createAction(
    '[Common RevisionType List Effect] Load RevisionType Success',
    props<{ data: GetRevionType[] }>()
  ),
  failure: createAction(
    '[Common RevisionType List Effect] Load RevisionType Failure',
    props<{ error: any }>()
  )
};

export const GetAllSetOfCategoriesList = {
  load: createAction(
    '[Common AllSetOfCategories List Component] Load AllSetOfCategories List'
  ),
  success: createAction(
    '[Common AllSetOfCategories List Effect] Load AllSetOfCategories Success',
    props<{ data: RCCategoryList[] }>()
  ),
  failure: createAction(
    '[Common AllSetOfCategories List Effect] Load AllSetOfCategories Failure',
    props<{ error: any }>()
  )
};

export const GetConfidentialitiesList = {
  load: createAction(
    '[Common Confidentialities List Component] Load Confidentialities List'
  ),
  success: createAction(
    '[Common Confidentialities List Effect] Load Confidentialities Success',
    props<{ data: ConfidentialitiesDropDownList[] }>()
  ),
  failure: createAction(
    '[Common Confidentialities List Effect] Load Confidentialities Failure',
    props<{ error: any }>()
  )
};

export const GetEngineSectionList = {
  load: createAction(
    '[Common EngineSection List Component] Load EngineSection List'
  ),
  success: createAction(
    '[Common EngineSection List Effect] Load EngineSection Success',
    props<{ data: EngineSectionList[] }>()
  ),
  failure: createAction(
    '[Common EngineSection List Effect] Load EngineSection Failure',
    props<{ error: any }>()
  )
};

export const GetUserList = {
  load: createAction(
    '[Common GetUserList List Component] Load GetUserList List'
  ),
  success: createAction(
    '[Common GetUserList List Effect] Load GetUserList Success',
    props<{ data: any[] }>()
  ),
  failure: createAction(
    '[Common GetUserList List Effect] Load GetUserList Failure',
    props<{ error: any }>()
  )
};
