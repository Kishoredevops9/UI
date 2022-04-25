import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StepflowService {
  baseUrl: any;
  taskAPI: any;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.processMapAPI;

    this.taskAPI = environment.taskAPI;
  }

  getStepFlowByid($id) {
    return this.http.get(
      this.baseUrl + 'processmaps/GetStepFlowByIdOrContentId?id=' + $id
    );
  }

  getStepFlowByIdOrContentId($id, $version) {
    return this.http.get(
      this.baseUrl +
        'processmaps/GetStepFlowByIdOrContentId?contentId=' +
        $id +
        '&status=published' +
        '&version=' +
        $version

    );
  }

  //https://eksprocessmap.azurewebsites.net/api/processmaps/GetStepFlowByIdOrContentId?contentId=F-015023

  getStepFlowBycontentId($id, $version = 0) {
    let $status = sessionStorage.getItem('sfStatus');
    if ($status == 'published') {
      return this.http.get(
        this.baseUrl +
          'processmaps/GetStepFlowByIdOrContentId?contentId=' +
          $id +
          '&version=' +
          $version +
          '&status=' +
          $status
      );
    } else {
      return this.http.get(
        this.baseUrl +
          'processmaps/GetStepFlowByIdOrContentId?contentId=' +
          $id +
          '&version=' +
          $version
      );
    }
  }

  getStepFlowBycid($id) {
    return this.http.get(
      this.taskAPI + 'task/gettaskstepflowbyid?KnowledgeAssetId=' + $id
    );
  }

  getStepById($id) {
    return this.http.get(
      this.baseUrl + 'processmaps/GetStepByIdOrContentId?id=' + $id
    );
  }

  getStepBycontentId($cid, $version, status = 'published') {
    return this.http.get(
      `${ this.baseUrl }processmaps/GetStepByIdOrContentId?contentId=${ $cid }&status=${ status }&version=${ $version }`
    );
  }

  deleteTreeD(item) {
    return this.http.delete(
      this.baseUrl + 'swimlanes/deleteswimlanes?id=' + item.swimLaneId
    );
  }
  deleteTreeA(item) {
    return this.http.delete(
      this.baseUrl + 'activityblocks/deleteactivityblocks?id=' + item.id
    );
  }
  deleteTreeSF(item) {
    return this.http.delete(
      this.baseUrl + 'processmaps/DeleteStep?id=' + item.stepId
    );
  }
  deleteTreeSP(item) {
    return this.http.delete(
      this.baseUrl + 'processmaps/RemoveStepFromStepFlow?stepFlowId=' + item.stepflowid+'&stepContentId='+item.stepContentId
    );
  }
}
