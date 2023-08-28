import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

import { HttpClientModule, HttpClient } from '@angular/common/http';

// ReactiveForms
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader, TranslateStore, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './services/translate-config.service';
import { CommonModule } from '@angular/common';
import { SigninPageModule } from './signin/signin.module';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup


export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
  
    BrowserModule           , 
    IonicModule.forRoot({
      mode:'ios'
    })                      ,
    AppRoutingModule        ,
    HttpClientModule        ,
    CommonModule            ,
    TranslateModule.forRoot({
      loader: {
        provide     : TranslateLoader,
        useFactory  : LanguageLoader,
        deps        : [HttpClient]
      }
    }),
    BackButtonDisableModule.forRoot({
      preserveScroll: true
    }), 
    NgIdleKeepaliveModule.forRoot(),
   ],
  providers: 
  [
     BluetoothLE            , 
     TranslateConfigService ,
      { 
        provide : RouteReuseStrategy, 
        useClass: IonicRouteStrategy 
      }, 
      TranslateService, 
      TranslateStore
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
