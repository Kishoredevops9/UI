import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HttpHelperService } from '@app/shared/http-helper.service';

@Injectable({
  providedIn: 'root',
})
export class TopMenuActionsService {
  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelperService
  ) {}

  publishContentLists(contentList) {
    return this.httpHelper.post('Extraction', {
      SourceFilePath: contentList.url,
      FileName: contentList.title,
      ContentType: contentList.contentType,
    });
  }
  UpdateCriteriaGroupContentStatus(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdateCriteriaGroupContentStatus',
      param,
      httpOptions
    );
  }
  previewContentLists(contentList) {
    return this.httpHelper.post('PreviewDocument/Preview', {
      SourceFilePath: contentList.url,
      FileName: contentList.title,
      ContentType: contentList.contentType,
    });
  }
}
