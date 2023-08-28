import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuystockPage } from './buystock.page';

const routes: Routes = [
  {
    path: '',
    component: BuystockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuystockPageRoutingModule {}
