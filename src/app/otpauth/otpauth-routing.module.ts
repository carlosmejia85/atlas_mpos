import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpauthPage } from './otpauth.page';

const routes: Routes = [
  {
    path: '',
    component: OtpauthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpauthPageRoutingModule {}
