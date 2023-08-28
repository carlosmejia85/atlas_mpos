import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { StorageService } from '../services/StorageService';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
    
    public SwiperConfig: SwiperOptions = {
      speed:1000,
      pagination:false,
      slidesPerView:1.8
    }

  titles:any[];

  constructor(
    public      storage                 : StorageService        ,
    private     translateConfigService  : TranslateConfigService   
  ) { }


  public messages : string[][] = 
  [ 
    [ "FAQ.SubTitle1"             , 
      "FAQ.HowToInvest"           , 
      "FAQ.PaymentMethods"         
    
    ], 
    [
      "",
      "", 
      ""
    ]
  ]

  ngOnInit() 
  {
    this.setUpLanguage            ( ); 

    this.getTransalationMessages  ( );

    this.titles = 
    [
      {
        id        : 1,
        cardbg    : '#E8F1FF',
        topicimg  : 'assets/imgs/gs.svg',
        fulltopic : this.getTextMessage ('FAQ.SubTitle1')
      },
      {
        id        : 2                   ,
        cardbg    :'#F1FFFA'            ,
        topicimg  :'assets/imgs/hi.svg' ,
        fulltopic : this.getTextMessage ('FAQ.HowToInvest')
      },
      {
        id        : 3,
        cardbg    : '#FFEFEB',
        topicimg  : 'assets/imgs/payment.svg',
        fulltopic : this.getTextMessage ('FAQ.PaymentMethods')
      }
    ]
  }



  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }


  //--------------------------------------
  // Language
  //--------------------------------------
  getTextMessage                ( key               ) 
  {

    let tmpIndex = -1; 
    let found = this.messages[0].find((element, index) => 
    {
      if (element.toLowerCase() === key.toLowerCase())  
      {
        tmpIndex = index; 
        return true;
      }
    });
    
    return ( this.messages[1][tmpIndex] );
  }

  async getTransalationMessages (                   ) 
  {
    this.translateConfigService.getText (this.messages[0]).subscribe(
      (values) => 
      {
        this.messages[1] = Object.keys(values).map(key => values[key]);
      }
    );
  }


}
