import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollabService {
  url = 'https://contentcreationapi.azurewebsites.net/api/content/';

  constructor(private http: HttpClient) {}

  // Api call to retrive Docs
  retrieveDocs() {
    return this.http.get<string>(this.url + 'GetDocsInLib');
  }

  // Api call to retrive List of users
  retrieveUsers() {
    return this.http.get<string>(this.url + 'GetUsers');
  }

  // Api Post call to share doc
  shareDoc(data: any) {
    const collabUrl$ =  this.http.post<any>(
      environment.apiUrl + `/ToDoTask/AddCollaborateToDoTask`,
      data
    );
    return collabUrl$.pipe(map( data => data));
  }
}
