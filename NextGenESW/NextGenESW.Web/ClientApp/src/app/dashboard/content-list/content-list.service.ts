import { PersistanceService } from '@app/shared/persistance.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContentList } from './content-list.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { SharedService } from '../../shared/shared.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentListService {
  email;
  constructor(
    private http: HttpClient,
    private userProfile: PersistanceService,
    private httpHerper: HttpHelperService,
    private sharedService: SharedService

  ) {}

  //  Api Call To get all Docs
  getContentLists(from = 0, size = 0): Observable<ContentList[]> {
    this.email = localStorage.getItem('logInUserEmail');
    return this.httpHerper.get<ContentList[]>(
      `WorkInstruction/GetAllDocsByUserEmail?userEmailId=${ this.email }&sourceType=db&from=${ from }&size=${ size }`
    );
  }

  //  Api Call To Publish Content List
  publishContentLists(contentList: ContentList) {
    if(contentList.documentType == 'CG'){
      return this.UpdateCriteriaGroupContentStatus({id : contentList.id});

    }else{
      this.sharedService.setPublish(true);
      return this.httpHerper.post('Extraction', {
        SourceFilePath: contentList.docUrl,
        FileName: contentList.title,
        ContentType: contentList.documentType
      })
      .pipe(
        tap(val => {
          this.sharedService.setPreviewVal(false);
          this.sharedService.setPublish(false)
        })
      );
  }
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

  //  Api Call To Preview Pdf Content List
  previewContentLists(contentList: ContentList) {
    this.sharedService.setLoading(true);
    return this.httpHerper.post('PreviewDocument/Preview', {
      SourceFilePath: contentList.docUrl,
      FileName: contentList.title,
      ContentType: contentList.documentType
    })
    .pipe(
      tap(val => {
        this.sharedService.setPreviewVal(true);
        this.sharedService.setLoading(false);

    })
    );
  }
  requestApproval(contentList) {
    return this.httpHerper.post('Workflow/AskForApproval', contentList)
  }

  getWebBasedContentLists(from = 0, size = 0): Observable<ContentList[]> {
    this.email = localStorage.getItem('logInUserEmail');
    return this.httpHerper.get<ContentList[]>(
      `WorkInstruction/GetAllDocsByUserEmail?userEmailId=${this.email}&sourceType=sp&from=${ from }&size=${ size }`
    );
  }

  updatePublishedContentStatus(contentId: string, version: string): Observable<any> {
    this.email = localStorage.getItem('logInUserEmail');
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(
      `${ environment.apiUrl }/KnowledgeAsset/UpdatePublishedContentStatus?contentId=${ contentId }&version=${ version }&lastUpdateUser=${ this.email }`,
      null,
      httpOptions
    );
  }
}
