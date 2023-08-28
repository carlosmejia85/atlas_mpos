import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranscompletePage } from './transcomplete.page';

const routes: Routes = [
  {
    path: '',
    component: TranscompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranscompletePageRoutingModule {}
