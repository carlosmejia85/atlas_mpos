import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectpaymentmodalPageRoutingModule } from './selectpaymentmodal-routing.module';

import { SelectpaymentmodalPage } from './selectpaymentmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectpaymentmodalPageRoutingModule
  ],
  declarations: [SelectpaymentmodalPage]
})
export class SelectpaymentmodalPageModule {}
