import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor( 
    private translate: TranslateService
    ) 
    {

    }

  getDefaultLanguage()
  {

    //var browserLang = window.navigator.languages ? window.navigator.languages[0] : null;
    //let language = navigator.language
    //let language = this.translate.getBrowserLang();

    let language = this.translate.currentLang || this.translate.defaultLang;

    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang) 
  {
    this.translate.use(setLang);
  }

  getText ( tag ) 
  {
    return  this.translate.get(tag);
  }

}
