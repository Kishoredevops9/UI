import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public email;
  public apiUrl;

  constructor( 

    private http: HttpClient
  ) {  
    this.apiUrl = environment.processMapAPI;
    this.email = sessionStorage.getItem('userMail');
  }
   
  updateTiles($data){ 
  return   this.http.post( this.apiUrl + "userpreferences/createuserprefences" ,  { 
      "userIdentifier":this.email,
      "tiles": $data 
    })


  }

  getTiles(){ 

      return this.http.get( this.apiUrl +"userpreferences/getuserpreferencesbyid?emailId="+this.email);

  }

  
}
