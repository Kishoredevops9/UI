import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ProcessMap } from './process-maps.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessMapsDiagramDataService {

  private baseUrl = environment.processMapAPI;

  constructor(
    private http: HttpClient
  ) { }

  getStepDiagramWithUrlParams(params: any) {
    const { contentId, id, status } = params;
    if (contentId) {
      return this.getMapWithContentId(contentId, status);
    }

    if (id) {
      return this.getMapWithId(id, status);
    }

    throw new Error('Couldn\'t fetch STEP - missing id in URL params');
  }

  getTaskExecutionDiagramWithContentId(contentId: string) {
    return this.http.get<ProcessMap>(
      `${this.baseUrl}processmaps/getprocessmapsflowviewbyid?contentId=${contentId}&status=published`,
    );
  }

  getTaskExecutionStepDiagramWithContentId(contentId: string) {
    return this.http.get<ProcessMap>(
      `${this.baseUrl}processmaps/getprocessmapsflowviewbyid?contentId=${contentId}&status=published`,
    );
  }

  private getMapWithContentId(contentId: string, status: string) {
    status = status || 'published';
    return this.http.get<ProcessMap>(
      `${this.baseUrl}processmaps/getprocessmapsflowviewbyid?contentId=${contentId}&status=${status}`,
    );
  }

  private getMapWithId(id: string, status: string) {
    status = status || 'published';
    return this.http.get<ProcessMap>(
      `${this.baseUrl}processmaps/getprocessmapsflowviewbyid?id=${id}&status=${status}`,
    );
  }
}
