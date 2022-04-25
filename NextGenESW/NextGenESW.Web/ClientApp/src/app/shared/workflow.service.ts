import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
import { Constants, publishedContent, draftContent } from '@environments/constants';
import { SharedService } from '@app/shared/shared.service';
import { WIDocumentList } from '@app/create-document/create-document.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  constructor(private httpClient: HttpClient, private sharedService: SharedService) {
  }

  getAllExceptionLogs() {
    return this.httpClient.get(`${ environment.apiUrl }/Workflow/GetAllWFExceptionLogs`);
  }

  endWorkFlow(contentId, documentId, version, clockId) {
    return this.httpClient.post(`${ environment.apiUrl }/Workflow/ErrorHandlingEndWF?contentId=${ contentId }&documentId=${ documentId }&version=${ version }&requestor=${ clockId }`, null);
  }

  retryWorkFlow(contentId, documentId, version, clockId) {
    return this.httpClient.post(`${ environment.apiUrl }/Workflow/ErrorHandlingRetryWF?contentId=${ contentId }&documentId=${ documentId }&version=${ version }&requestor=${ clockId }`, null);
  }
}
