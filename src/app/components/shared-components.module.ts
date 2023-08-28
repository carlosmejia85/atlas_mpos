import { IonicModule } from '@ionic/angular';
import { TopiccardComponent } from './topiccard/topiccard.component';
import { ChartcardComponent } from './chartcard/chartcard.component';
import { StockcardshortComponent } from './stockcardshort/stockcardshort.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalancecardComponent } from './balancecard/balancecard.component';
import { NgApexchartsModule } from 'ng-apexcharts';

import {  HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [BalancecardComponent,StockcardshortComponent,ChartcardComponent,TopiccardComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    IonicModule, 
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports:[BalancecardComponent,StockcardshortComponent,ChartcardComponent,TopiccardComponent]
})
export class SharedComponentsModule { }
