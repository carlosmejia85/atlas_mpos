import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangemodalPage } from './exchangemodal.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangemodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangemodalPageRoutingModule {}
