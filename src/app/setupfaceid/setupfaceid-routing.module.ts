import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupfaceidPage } from './setupfaceid.page';

const routes: Routes = [
  {
    path: '',
    component: SetupfaceidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupfaceidPageRoutingModule {}
