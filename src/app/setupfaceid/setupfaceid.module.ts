import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupfaceidPageRoutingModule } from './setupfaceid-routing.module';

import { SetupfaceidPage } from './setupfaceid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupfaceidPageRoutingModule
  ],
  declarations: [SetupfaceidPage]
})
export class SetupfaceidPageModule {}
