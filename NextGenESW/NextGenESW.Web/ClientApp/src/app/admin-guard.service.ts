 
    

  import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

 

@Injectable()
export class AdminGuardService implements CanActivate {
    constructor(private router: Router ) {
    }
    canActivate() {
      console.log("AlwaysAuthGuard" , sessionStorage.getItem("EKSAdminGroupControl"));
      if (sessionStorage.getItem("EKSAdminGroupControl")== "true"){
        return true;
      }
      else{
        return false;

      }
    
    }
}