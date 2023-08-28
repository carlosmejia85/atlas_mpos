import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranscompletePageRoutingModule } from './transcomplete-routing.module';

import { TranscompletePage } from './transcomplete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranscompletePageRoutingModule
  ],
  declarations: [TranscompletePage]
})
export class TranscompletePageModule {}
