import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  CategoryList,
  CreateDocument,
} from '@app/create-document/create-document.model';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LessonLearnedService {
  constructor(
    private httpHelper: HttpHelperService,
    private http: HttpClient
  ) {}

  saveLessonLearned(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + `/LessonsLearned`,
      param,
      httpOptions
    );

  }
  getLessonLearnedAP(id,contentType) {
    return this.http.get(
      environment.apiUrl + `/LessonsLearned/${id}/${contentType}`);
  }
  updateLessonLearned(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + `/LessonsLearned/UpdateLessonLearned`,
      param,
      httpOptions
    );

  }
  deleteLessonLearned(id,contentType) {
    return this.http.delete(
      environment.apiUrl + `/LessonsLearned/DeleteLessonLearned?id=${id}&contentType=${contentType}`);
  }
}

/*
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  CategoryList,
  CreateDocument,
} from '@app/create-document/create-document.model';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LessonLearnedService {
  constructor(
    private httpHelper: HttpHelperService,
    private http: HttpClient
  ) {}

  saveLessonLearned(id,contentType) {
    return this.http.get(
      environment.apiUrl + `/LessonsLearned/${id}/${contentType}`);
  }
  getLessonLearnedAP(id,contentType) {
    return this.http.get(
      environment.apiUrl + `/LessonsLearned/${id}/${contentType}`);
  }
  updateLessonLearned(id,contentType) {
    return this.http.get(
      environment.apiUrl + `/LessonsLearned/UpdateLessonLearned/${id}/${contentType}`);
  }
  deleteLessonLearned(id) {
    return this.http.delete(
      environment.apiUrl + `/LessonsLearned/DeleteLessonLearned?id=${id}`);
  }
}
*/