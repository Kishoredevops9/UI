import { Injectable } from '@angular/core';
import { ContextInfo } from './context.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private contextStream: Subject<ContextInfo> = new Subject<ContextInfo>();
  getContextInfo  = this.contextStream.asObservable();
  private contextInfo;
  constructor() { }

  set ContextInfo(value) {
    this.contextInfo = value;
    //console.log("deepak 2",value);
    this.contextStream.next(this.contextInfo);
  }

  get ContextInfo() {
    return this.contextInfo;
  }

  clearContext() {
    this.contextInfo = null;
  }
}
