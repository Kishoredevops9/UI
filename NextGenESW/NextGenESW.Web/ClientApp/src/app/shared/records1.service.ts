import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordsService1 {
  broadCastMessageStart1: string = 'false';
  private broadCastMessage1 = new BehaviorSubject<string>(
    this.broadCastMessageStart1
  );
  broadcast = this.broadCastMessage1.asObservable();

  constructor(private httpClient: HttpClient) {}

  // For updating behavior subject through below method
  UpdateBroadcastMessage(newMessage: any) {
    this.broadCastMessage1.next(newMessage);
  }
}
