import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  broadCastMessageStart: string = 'false';
  private broadCastMessage = new BehaviorSubject<string>(
    this.broadCastMessageStart
  );
  broadcast = this.broadCastMessage.asObservable();

  constructor(private httpClient: HttpClient) {}

  // For updating behavior subject through below method
  UpdateBroadcastMessage(newMessage: any) {
    this.broadCastMessage.next(newMessage);
  }
}
