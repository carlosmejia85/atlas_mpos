import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { HttpService } from '../services/HttpService';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-otpauth',
  templateUrl: './otpauth.page.html',
  styleUrls: ['./otpauth.page.scss'],
})
export class OtpauthPage implements OnInit {

 
  constructor(
    private     navCtrl                 : NavController     ,
    private     loadingController       : LoadingController ,
    private     toastService            : ToastService      ,
    private     router                  : Router            , 
    private     route                   : ActivatedRoute    , 
    public      httpService             : HttpService       ,
    public      platform                : Platform          ,
    public      alertController         : AlertController   , 
    private     bluetooth_le            : BluetoothLE       , 
    private     storage                 : StorageService    , 
    private     translateConfigService  : TranslateConfigService 
    ) 
    { }



public messages : string[][] = 
[ 
  [ 
    "EmailAccount.Title1"      , 
    "EmailAccount.Confirmation"     
    
  ], 
  [
    "", 
    ""
  ], 

]


  Message   = '' 
  Message2  = ''

  ngOnInit() 
  {

    this.route.queryParams
    .subscribe(params => 
    { 

      this.setUpLanguage            ( )

      this.getTransalationMessages  ( )

      if (params.message) 
      {
        this.Message = params.message 
      }
      else
      {
        this.Message = this.getTextMessage ("EmailAccount.Title1")
      }

      if (params.message) 
      {
        this.Message2 = params.message2 
      }
      else
      {
        this.Message2 = this.getTextMessage ("EmailAccount.Confirmation")
      }
    

    });




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


  async next()
  {
    await this.router.navigate(['/signin']);
  }

  setUpLanguage                 (                   ) 
  {

    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }



}
