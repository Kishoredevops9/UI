import { Inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as data from '../../../../assets/data/global-config.json';
import { ContextService } from './context/context.service';
import { Input } from '@angular/core';
import { WINDOW } from './window.providers'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalContent: any;
  @Input() type: any;

  constructor(private httpHelper: HttpHelperService, private http: HttpClient,
    private contextService: ContextService,
    @Inject(WINDOW) private window: Window) { }

  fetchComments(resourceType, resourceId, resourceStatus) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get(environment.apiUrl + `/ContentCollaboration/GetCommentsContentCollaboration?resourceType=${resourceType}&resourceId=${resourceId}&assetStatusId=${resourceStatus}`);
  }

  addComments(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(environment.apiUrl + `/ContentCollaboration/AddCommentsContentCollaboration`,
    param,
    httpOptions);
  }

  getCommentsVisibility(screenName: string) {
    const panelData = (<any>data);
    const globalConfigData = panelData.default.GlobalRequirementConfig.filter(d => d.screenName === screenName);
    if (globalConfigData.length > 0) {
      const globalPanalItems = globalConfigData[0].globalPanalItems[0];
      if (globalPanalItems) {
        return globalPanalItems.isCommentsEnabled;
      } else {
        return null;
      }
    } else {
      return null;
    }

  }


  exportToPDF(contentId: any){
    return this.http.get(
      environment.apiUrl + `/ContentExport/ExportToPdf?contentId=${contentId}`
    )

  }

  sendApprovalRequest(isApprove, payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(environment.apiUrl + `/Workflow/ApproveRejectContentOwner?isApprove=${isApprove}`,
    payload,httpOptions);
  }




  getShareUrl() : string {
    return this.window.location.href.split('_search')[0];
  }

  getAssetReference(contentId: string, referenceType: string) {
    return this.http.get(`${environment.apiUrl}/AssetReference/GetReferencedAssets?contentId=${contentId}&referenceType=${referenceType}`);
  }







}
