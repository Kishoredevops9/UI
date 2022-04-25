import { Injectable } from "@angular/core";
import { UserService } from "@app/shared/services/user.service";
import { allEKSCollection } from "@environments/constants";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, of } from "rxjs";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";
import { AddonsPopupSearchService } from "./addons-popup-search.service";
import { AddonsPopupState, GlobalQueryObject, initAddonPopupState, InternalSearchQueryObject, PwPlayQueryObject } from "./addons-popup-search.state";
import { AggregationPrefix } from "./addons-popup-search.utils";
@Injectable()
export class AddonsPopupSearchStore extends ComponentStore<AddonsPopupState> {
  readonly eksQueryObject$ = this.select(state => state.eksQueryObject);
  readonly globalQueryObject$ = this.select(state => state.globalQueryObject);
  readonly pwPlayQueryObject$ = this.select(state => state.pwPlayQueryObject);
  readonly eksSearchResult$ = this.select(state => state.eksSearchResult);
  readonly globalSearchResult$ = this.select(state => state.globalSearchResult);
  readonly pwPlaySearchResult$ = this.select(state => state.pwPlaySearchResult);
  readonly searchText$ = this.select(state => state.eksQueryObject.searchText);
  readonly onLoading$ = this.select(state => {
    return state.onLoadingEskItems || state.onLoadingGlobalItems || state.onLoadingPwPlayItems
  });
  readonly advancedSearchEnabled$ = this.select(state => state.advancedSearchEnabled);
  readonly sltEksResultItems$ = this.select(state => state.sltEksResultItems);
  readonly excludedTypes$ = this.select(state => state.excludedTypes);

  readonly phaseTageSltItems$ = this.eksSearchResult$
    .pipe(
      map(result => {
        const { phaseItems = [], tagItems = [] } = result;
        return [
          {
            label: 'Phase',
            children: phaseItems.map(item => ({
              label: item.key,
              value: AggregationPrefix.Phase + item.key
            }))
          },
          {
            label: 'Tags',
            children: tagItems.map(item => ({
              label: item.key,
              value: AggregationPrefix.Tags + item.key
            }))
          }
        ]
      })
    );

  readonly fetchEKSOptions$ = this.select(
    this.eksQueryObject$,
    this.excludedTypes$,
    (queryObject, excludedTypes) => {      
      if (!excludedTypes.length) return queryObject;
      const assetTypeCodes = queryObject.assetTypeCode ? queryObject.assetTypeCode.split('|') : [];
      const toUseTypes = allEKSCollection      
        .filter(item => {
          return (!assetTypeCodes.length || assetTypeCodes.includes(item.keyword))
          && !excludedTypes.includes(item.code.toLowerCase())
        })
        .map(item => item.keyword)
      return {
        ...queryObject,
        assetTypeCode: toUseTypes.join('|')
      } as InternalSearchQueryObject
    },
    { debounce: true }
  )
  constructor(
    private addonPopupService: AddonsPopupSearchService,
    private userService: UserService
  ) {
    super(initAddonPopupState)
    this.fetchEKSItems(this.fetchEKSOptions$);
    this.fetchGlobalItems(this.globalQueryObject$);
    this.fetchPwPlayItems(this.pwPlayQueryObject$);
  }

  readonly fetchEKSItems = this.effect((queryObject$: Observable<InternalSearchQueryObject>) => {
    return queryObject$
      .pipe(
        tap(queryObject => console.log('eksQueryObject: ', queryObject)),
        filter(queryObject => !!queryObject.searchText || queryObject.onAdvancedSearch),
        tap(_ => this.patchState({ onLoadingEskItems: true })),
        switchMap(queryObject => {
          queryObject.user = this.userService.currentUser;
          return this.addonPopupService.fetchEskResults(queryObject).pipe(catchError(error => of({})))
        }),
        tap(eksSearchResult => {
          this.patchState({
            onLoadingEskItems: false,
            eksSearchResult
          })
        })
      )
  })

  readonly fetchGlobalItems = this.effect((queryObject$: Observable<GlobalQueryObject>) => {
    return queryObject$
      .pipe(
        filter(queryObject => !!queryObject.query),
        tap(_ => this.patchState({ onLoadingGlobalItems: true })),
        switchMap(queryObject => this.addonPopupService.fetchGlobalResults(queryObject).pipe(catchError(error => of({})))),
        tap(globalSearchResult => {
          this.patchState({
            onLoadingGlobalItems: false,
            globalSearchResult
          })
        })
      )
  })

  readonly fetchPwPlayItems = this.effect((queryObject$: Observable<PwPlayQueryObject>) => {
    return queryObject$
      .pipe(
        filter(queryObject => !!queryObject.query),
        tap(_ => this.patchState({ onLoadingPwPlayItems: true })),
        switchMap(queryObject =>
          this.addonPopupService.fetchPwPlayResults(queryObject)
            .pipe(catchError(error => of({})))
        ),
        tap(pwPlaySearchResult => {
          this.patchState({
            onLoadingPwPlayItems: false,
            pwPlaySearchResult
          })
        })
      )
  })
} 