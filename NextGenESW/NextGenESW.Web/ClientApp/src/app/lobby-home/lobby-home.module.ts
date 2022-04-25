import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LobbyHomeRoutingModule } from './lobby-home-routing.module';
import { LobbySliderComponent } from './lobby-slider/lobby-slider.component';
import { LobbyHomeComponent } from './lobby-home/lobby-home.component';
import * as fromLobbyHomeReducer from './lobby-home.reducer';
import { LobbyHomeService } from './lobby-home.service';
import { TaskLobbyHomeEffects } from './lobby-home.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({  
  declarations: [LobbyHomeComponent, LobbySliderComponent],
  imports: [
    CommonModule,
    LobbyHomeRoutingModule,    
    StoreModule.forFeature(
      fromLobbyHomeReducer.LobbyHomeFeatureKey,
      fromLobbyHomeReducer.reducer
    ),
    EffectsModule.forFeature([TaskLobbyHomeEffects]),
  ],
  exports:[LobbyHomeRoutingModule],
  providers: [
    LobbyHomeService
  ],
})
export class LobbyHomeModule { }
