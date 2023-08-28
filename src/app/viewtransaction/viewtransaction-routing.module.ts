import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewtransactionPage } from './viewtransaction.page';

const routes: Routes = [
  {
    path: '',
    component: ViewtransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewtransactionPageRoutingModule {}
