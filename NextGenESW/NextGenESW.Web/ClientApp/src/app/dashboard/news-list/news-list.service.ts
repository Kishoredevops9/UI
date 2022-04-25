import { Injectable } from '@angular/core';
import { NewsList } from './news-list.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsListService {
  constructor(private http: HttpClient) {}

  // Get Request for news list
  getNewsList(): Observable<NewsList[]> {
    let url = '../../../assets/data/news-list.json';
    return this.http.get<NewsList[]>(url);
  }
}
