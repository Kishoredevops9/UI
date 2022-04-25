import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private _snackBar: MatSnackBar,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apirequest = request;
    let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
    // apirequest = request.clone({
    //     headers: request.headers        
    // })     
    if(userProfileDataObj){
      var params = [];
      for (var key in userProfileDataObj) {
        if (userProfileDataObj.hasOwnProperty(key) && userProfileDataObj[key]) {
          params.push(userProfileDataObj[key])
        }
      }
      var headerRequestedData = params.join("<>");
    }
    apirequest = request.clone({
      headers: request.headers.set('userinfo', headerRequestedData)
    });
    // return next.handle(apirequest).pipe(
    //     map((event: HttpEvent<any>) => {
    //         if (event instanceof HttpResponse) {
    //             console.log('event--->>>', event);
    //             if (event.status !== 200) {
    //                 this._snackBar.open("'Some API error!'", 'x', {
    //                     duration: 5000,
    //                 });
    //             }
    //         }
    //         return event;
    //     }));

    return next.handle(apirequest)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          // if (error.error instanceof ErrorEvent) {
          //   // client-side error
          //   errorMessage = `Error: ${error.error.message}`;
          // } else {
          //   // server-side error
          //   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          // }

          // this._snackBar.open('API Error Occured!', 'x', {
          //     duration: 3000,
          //     panelClass: 'snackbar'
          // });
          return throwError(errorMessage);
        })
      )
  }

}