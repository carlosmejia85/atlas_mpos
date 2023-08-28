import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupfingerprintPageRoutingModule } from './setupfingerprint-routing.module';

import { SetupfingerprintPage } from './setupfingerprint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupfingerprintPageRoutingModule
  ],
  declarations: [SetupfingerprintPage]
})
export class SetupfingerprintPageModule {}
