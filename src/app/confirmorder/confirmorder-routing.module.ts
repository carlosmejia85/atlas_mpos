import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmorderPage } from './confirmorder.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmorderPageRoutingModule {}
