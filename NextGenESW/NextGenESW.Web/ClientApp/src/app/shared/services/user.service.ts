import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class UserService {
  get currentUser() {
    return sessionStorage.getItem('AADid');
  }
}