import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, combineLatest } from 'rxjs';

import * as fromActions from '../action/common-list.action';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';

@Injectable()
export class CommonListEffects {
  constructor(
    private actions$: Actions,
    private createDocumentService: CreateDocumentService,
    private activityPageService: ActivityPageService,
    private tabOneContentService: TabOneContentService
  ) {
  }

  // Load WI discipline dropdown
  getWIDisciplineDropDownList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.getAllMetaDataDisciplineCode.load),
      switchMap(action => this.createDocumentService.getWIDisciplineDropDownList('GetAllDisciplineCode')),
      map(disciplineCodes => fromActions.getAllMetaDataDisciplineCode.success({
        data: disciplineCodes
      })),
      catchError(error => of(fromActions.getAllMetaDataDisciplineCode.failure({ error }))
      )
    )
  );
  // Load approval requirement list
  getApprovalRequirementList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetAllApprovalRequirement.load),
      switchMap(action => this.createDocumentService.getAllApprovalRequirementList()),
      map(data => fromActions.GetAllApprovalRequirement.success({
        data
      })),
      catchError(error => of(fromActions.GetAllApprovalRequirement.failure({ error }))
      )
    )
  );

  // Load category list
  getCategoryList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetCategoryList.load),
      switchMap(action => this.createDocumentService.getCategoryList()),
      map(data => fromActions.GetCategoryList.success({
        data
      })),
      catchError(error => of(fromActions.GetCategoryList.failure({ error }))
      )
    )
  );

  // Load category list
  getWiDropdownList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetWiDropDownList.load),
      concatMap(action => combineLatest([
        of(action.listType),
        this.createDocumentService.getWiDropDownList(action.listType)
      ])),
      map(([ listType, data ]) => fromActions.GetWiDropDownList.success({
        data,
        listType
      })),
      catchError(error => of(fromActions.GetWiDropDownList.failure({ error }))
      )
    )
  );

  // Load AllSetOfPhases list
  getAllSetOfPhasesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetAllSetOfPhasesList.load),
      switchMap(action => this.createDocumentService.getAllSetOfPhasesList()),
      map(data => fromActions.GetAllSetOfPhasesList.success({
        data
      })),
      catchError(error => of(fromActions.GetAllSetOfPhasesList.failure({ error }))
      )
    )
  );

  // Load exportCompliance list
  getExportComplianceList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetExportComplianceList.load),
      switchMap(action => this.createDocumentService.getExportComplianceList()),
      map(data => fromActions.GetExportComplianceList.success({
        data
      })),
      catchError(error => of(fromActions.GetExportComplianceList.failure({ error }))
      )
    )
  );

  getAllExportAuthorityList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetAllExportAuthorityList.load),
      switchMap(action => this.createDocumentService.getAllExportAuthorityList()),
      map(data => fromActions.GetAllExportAuthorityList.success({
        data
      })),
      catchError(error => of(fromActions.GetAllExportAuthorityList.failure({ error }))
      )
    )
  );

  getAllRestrictingProgramList = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetAllRestrictingProgramList.load),
      switchMap(action => this.createDocumentService.GetAllRestrictingProgramList()),
      map(data => fromActions.GetAllRestrictingProgramList.success({
        data
      })),
      catchError(error => of(fromActions.GetAllRestrictingProgramList.failure({ error }))
      )
    )
  );

  getActivityPageDisciplineCodeList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetActivityPageDisciplineCodeList.load),
      switchMap(action => this.activityPageService.getDisciplineCodeList()),
      map(data => fromActions.GetActivityPageDisciplineCodeList.success({
        data
      })),
      catchError(error => of(fromActions.GetActivityPageDisciplineCodeList.failure({ error }))
      )
    )
  );

  getClassifiersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetClassifiersList.load),
      switchMap(action => this.createDocumentService.getClassifiersList()),
      map(data => fromActions.GetClassifiersList.success({
        data
      })),
      catchError(error => of(fromActions.GetClassifiersList.failure({ error }))
      )
    )
  );

  getRevisionTypeList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetRevisionTypeList.load),
      switchMap(action => this.createDocumentService.getRevisionTypeList()),
      map(data => fromActions.GetRevisionTypeList.success({
        data
      })),
      catchError(error => of(fromActions.GetRevisionTypeList.failure({ error }))
      )
    )
  );

  getAllSetOfCategoriesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetAllSetOfCategoriesList.load),
      switchMap(action => this.createDocumentService.getRCCategoryList()),
      map(data => fromActions.GetAllSetOfCategoriesList.success({
        data
      })),
      catchError(error => of(fromActions.GetAllSetOfCategoriesList.failure({ error }))
      )
    )
  );

  GetConfidentialitiesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetConfidentialitiesList.load),
      switchMap(action => this.createDocumentService.getConfidentialitiesList()),
      map(data => fromActions.GetConfidentialitiesList.success({
        data
      })),
      catchError(error => of(fromActions.GetConfidentialitiesList.failure({ error }))
      )
    )
  );

  GetEngineSectionList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetEngineSectionList.load),
      switchMap(action => this.tabOneContentService.getEngineSectionList()),
      map(data => fromActions.GetEngineSectionList.success({
        data
      })),
      catchError(error => of(fromActions.GetEngineSectionList.failure({ error }))
      )
    )
  );

  GetUserList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetUserList.load),
      switchMap(action => this.createDocumentService.retrieveCoauthorName()),
      map(data => fromActions.GetUserList.success({
        data: data as unknown as any[]
      })),
      catchError(error => of(fromActions.GetUserList.failure({ error }))
      )
    )
  );
}
