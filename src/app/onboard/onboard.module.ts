import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardPageRoutingModule } from './onboard-routing.module';
import { SwiperModule } from 'swiper/angular';

import { OnboardPage } from './onboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardPageRoutingModule,
    SwiperModule
  ],
  declarations: [OnboardPage]
})
export class OnboardPageModule {}
