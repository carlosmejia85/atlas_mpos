import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpphonePageRoutingModule } from './otpphone-routing.module';

import { OtpphonePage } from './otpphone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpphonePageRoutingModule
  ],
  declarations: [OtpphonePage]
})
export class OtpphonePageModule {}
