import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpphonePage } from './otpphone.page';

const routes: Routes = [
  {
    path: '',
    component: OtpphonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpphonePageRoutingModule {}
