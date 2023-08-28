import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockdetailPageRoutingModule } from './stockdetail-routing.module';

import { StockdetailPage } from './stockdetail.page';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockdetailPageRoutingModule,
    NgApexchartsModule
  ],
  declarations: [StockdetailPage]
})
export class StockdetailPageModule {}
