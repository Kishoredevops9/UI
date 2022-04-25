import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ESKSearchResult, FieldResultItem, GlobalQueryObject, GlobalSearchResult, InternalSearchQueryObject, PwPlayQueryObject, PwPlaySearchResult, RawAggregationItem, RawESKInternalSearchResponse, RawGlobalSearchResponse, RawPwPlaySearchResponse } from "./addons-popup-search.state";
import { formatDuration } from "@app/shared/utils/common";
import { UserService } from "@app/shared/services/user.service";

@Injectable({ providedIn: 'root' })
export class AddonsPopupSearchService {
  constructor(private http: HttpClient, private userService: UserService) { }

  fetchEskResults(queryObject: InternalSearchQueryObject): Observable<ESKSearchResult> {
    return this.http.post<RawESKInternalSearchResponse>(environment.EKSInternalSearchAPI2, queryObject)
      .pipe(
        map(res => {
          return {
            subEksItems: (res.hits?.hits || []).map(item => item._source),
            totalResult: res.hits?.total?.value || 0,
            assetTypeItems: this.getFieldResultItems(res.aggregations?.assettypecode),
            phaseItems: this.getFieldResultItems(res.aggregations?.phasenames),
            tagItems: this.getFieldResultItems(res.aggregations?.tags),
          } as ESKSearchResult
        })
      );
  }

  fetchGlobalResults(queryObject: GlobalQueryObject): Observable<GlobalSearchResult> {
    const queryParams = new HttpParams({
      fromObject: {
        Query: queryObject.query || '',
        StartAt: `${queryObject.startAt || 0}`,
        MaxItems: `${queryObject.maxItems || 10}`,
        Fields: (queryObject.fields || []).join(',')
      }
    })
    return this.http.get<RawGlobalSearchResponse>(environment.EKSGlobalSearchExternalAPI, { params: queryParams })
      .pipe(
        map(res => {
          return {
            startAt: res.start_at,
            endAt: res.end_at,
            totalResult: res.total_possible,
            globalDetailItems: res.results
          } as GlobalSearchResult
        })
      );
  }

  fetchPwPlayResults(queryObject: PwPlayQueryObject): Observable<PwPlaySearchResult> {
    const body = {
        Query: queryObject.query || '',
        StartAt: `${queryObject.startAt || 0}`,
        MaxItems: `${queryObject.maxItems || 10}`,
        UserName: queryObject.userName || this.userService.currentUser,
    }
    return this.http.post<RawPwPlaySearchResponse>(environment.EKSPWPlayExternalAPIEndpoint, body)
      .pipe(
        map(res => {
          const pwPlayItems = res.videos
          .filter(video => (queryObject.onlyActive !== true) || (video.status === 'Active'))
          .map(item => ({
            ...item,
            duration: formatDuration(item.duration),
            speechResult: item.speechResult.map(speech => ({
              ...speech,
              time: formatDuration(speech.time)
            }))
          }));
          return {
            pwPlayItems,
            totalResult: res.totalVideos || pwPlayItems.length,
            scrollId: res.scrollId,
            statusCode: res.statusCode,
            statusDescription: res.statusDescription
          } as PwPlaySearchResult
        })
      );
  }

  getFieldResultItems(aggreation: RawAggregationItem): FieldResultItem[] {
    if (!aggreation) return [];
    return (aggreation.buckets || []).map(item => ({
      key: item.key,
      count: item.doc_count
    }))
  }
}