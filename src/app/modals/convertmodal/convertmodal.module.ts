import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConvertmodalPageRoutingModule } from './convertmodal-routing.module';

import { ConvertmodalPage } from './convertmodal.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConvertmodalPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ConvertmodalPage]
})
export class ConvertmodalPageModule {}
