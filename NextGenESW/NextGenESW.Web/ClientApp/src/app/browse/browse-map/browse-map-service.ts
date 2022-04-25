import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class BrowseMapService {
    baseUrl = environment.siteAdminAPI;
    constructor(

        private http: HttpClient,
        private httpHelper: HttpHelperService
    ) { }

    getNav(){
        return this.http.get(
          this.baseUrl + `eksbrowsemap/geteksbrowsemap`
        )
      }
    
}