import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupfingerprintPage } from './setupfingerprint.page';

const routes: Routes = [
  {
    path: '',
    component: SetupfingerprintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupfingerprintPageRoutingModule {}
