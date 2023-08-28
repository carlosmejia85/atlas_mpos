import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpverifyPage } from './otpverify.page';

const routes: Routes = [
  {
    path: '',
    component: OtpverifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpverifyPageRoutingModule {}
