import { Component, OnInit } from '@angular/core';
import { FooterServiceService } from '../footer-service.service';
import { SharedService } from '../../shared/shared.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectLobbyHomeList } from '../../reducers/index';
import { LobbyHomeState } from './../lobby-home.reducer';
import { LobbyHomeModel } from './../lobby-home.model';
import { LobbyHomeService } from '../lobby-home.service';
import * as lobbyHomeActions from '../lobby-home.actions';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lobby-home',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.scss']
})
export class LobbyHomeComponent implements OnInit {

  constructor(private footerServiceService: FooterServiceService, 
     private _sharedService: SharedService, 
      private contextService: ContextService, 
      private store: Store<LobbyHomeState>, 
      private titleService: Title,
      private lobbyHomeService: LobbyHomeService) {


    this.titleService.setTitle(`EKS | Home Page`);
  }

  lobbyHome$: Observable<LobbyHomeModel[]>;
  lobbyHomeResponse: any[];
  lobbyFotterLinks;

  ngOnInit(): void {
    this.store.dispatch(lobbyHomeActions.loadLobbyHome());
    this.loadLobbyHomeData();
    this._sharedService.sendValue(true);
    this.loadContextInfo();
    this.loadFooterLinks();
  }

  private loadLobbyHomeData() {
    this.lobbyHome$ = this.store.pipe(select(selectLobbyHomeList));
    this.lobbyHome$.subscribe(res => {
      this.lobbyHomeResponse = res;       
    });
  }

  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = 'Lobby Home';
    return contextInfo;
  }

  loadFooterLinks(){
    this.lobbyHomeService.getAllFooterLinks().subscribe( (data) => {
      this.lobbyFotterLinks = data;      
    });
  }

}
