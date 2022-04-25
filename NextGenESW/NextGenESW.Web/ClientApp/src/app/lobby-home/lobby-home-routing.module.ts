import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyHomeComponent } from './lobby-home/lobby-home.component';

const routes: Routes = [{ path: '', component: LobbyHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbyHomeRoutingModule {}
