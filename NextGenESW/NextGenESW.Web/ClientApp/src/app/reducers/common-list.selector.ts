import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCommonList from './common-list.reducer';
import { selectContentListsState } from '@app/reducers/index';
import { contentListsFeatureKey, ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { commonListKey, CommonListState, wiDropDownListKey } from '@app/reducers/common-list.reducer';
import { DisciplineCodeList } from '@app/activity-page/activity-page.model';

export const selectCommonListState = createFeatureSelector<CommonListState>(
  commonListKey
);

export const selectMetaDataDisciplineCode = createSelector(
  selectCommonListState,
  store => store.metaDataDisciplineCode
);

export const selectApprovalRequirement = createSelector(
  selectCommonListState,
  store => store.approvalRequirementList
);

export const selectCategoryList = createSelector(
  selectCommonListState,
  store => store.categoryList
);

export const selectWiDropdownList = (listType) => createSelector(
  selectCommonListState,
  store => store[wiDropDownListKey],
  wiDropDownList => wiDropDownList[listType]
);

export const selectSetOfPhasesList = createSelector(
  selectCommonListState,
  store => store.setOfPhasesList
);

export const selectExportComplianceList = createSelector(
  selectCommonListState,
  store => store.exportComplianceList
);

export const selectExportAuthorityList = createSelector(
  selectCommonListState,
  store => store.exportAuthorityList
);

export const selectRestrictingProgramList = createSelector(
  selectCommonListState,
  store => store.restrictingProgramList
);

export const selectDisciplineCodeList = createSelector(
  selectCommonListState,
  store => store.activityPageDisciplineCodeList
);

export const selectClassifiersList = createSelector(
  selectCommonListState,
  store => store.classifiersList
);

export const selectRevisionTypeList = createSelector(
  selectCommonListState,
  store => store.revisionTypeList
);

export const selectAllSetOfCategories = createSelector(
  selectCommonListState,
  store => store.allSetOfCategoriesList
);

export const selectConfidentialitiesList = createSelector(
  selectCommonListState,
  store => store.confidentialitiesList
);

export const selectEngineSectionList = createSelector(
  selectCommonListState,
  store => store.engineSectionList
);

export const selectUserList = createSelector(
  selectCommonListState,
  store => store.userList
);
