import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpauthPageRoutingModule } from './otpauth-routing.module';

import { OtpauthPage } from './otpauth.page';
import {  HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) 
{
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpauthPageRoutingModule, 
    TranslateModule.forChild({
      loader: {
        provide   : TranslateLoader       ,
        useFactory: createTranslateLoader ,
        deps      : [HttpClient]
      }
    })
  ],
  declarations: [OtpauthPage]
})
export class OtpauthPageModule {}
