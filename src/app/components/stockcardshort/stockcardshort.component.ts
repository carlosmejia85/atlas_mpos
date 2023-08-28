import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { LoadingController } from '@ionic/angular';

import { StorageService } from 'src/app/services/StorageService';
import { ToastService } from 'src/app/services/toast.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'stockcardshort',
  templateUrl: './stockcardshort.component.html',
  styleUrls: ['./stockcardshort.component.scss'],
})
export class StockcardshortComponent implements OnInit {
 
  @Input() mainAmount: string;
  @Input() imgPath: string;
  @Input() comShortName: string;
  @Input() comName: string;
  @Input() variantAmount: any;
  @Input() isup: any;
  
  transactionName = ""
  constructor(
    private     router                  : Router            , 
    private     route                   : ActivatedRoute    , 
    private     toastService            : ToastService      ,
    private     storage                 : StorageService    ,
    private     bluetooth_le            : BluetoothLE       , 
    private     loadingController       : LoadingController , 
    private     translateConfigService  : TranslateConfigService  
  ) { }


  public messages : string[][] = [ 
    [ 
      "FAQ.Title1"            , 
      "FAQ.Title2"            , 
      "FAQ.Title3"            , 
      "FAQ.SubTitle1"         , 
      "Tabs.Sale"             ,
      "Tabs.Points"           ,
      "Tabs.PointsBalance"    ,
      "Tabs.Refund"           ,
      "Tabs.Installments"   ,
      "Tabs.Settlement"    
    ], 
    [
      "",
      "", 
      "",
      "", 
      "",
      "", 
      "",
      "",
      "", 
      ""
    ], 
  
  ]

  ngOnInit() 
  {

    this.route.queryParams
    .subscribe(params => 
    { 
      console.log(parseFloat(this.mainAmount).toFixed(2))

      this.setUpLanguage(); 
      this.getTransalationMessages ();

      this.getTitle ( this.comShortName )
    }
    );
    
  }

  
  
  async getTitle ( id ) 
  {
    if (id === "refund"  ) 
    {
      this.transactionName = this.getTextMessage ("Tabs.Refund")
    } 
    else if (id === "sale"  )  
    {
      this.transactionName = this.getTextMessage ("Tabs.Sale")
    }
    else if (id === "installment"  )   
    {
      this.transactionName = this.getTextMessage ("Tabs.Installments")
    }
    else if (id === "points_balance"  )   
    {
      this.transactionName = this.getTextMessage ("Tabs.PointsBalance")
    }
    else if (id === "points"  )   
    {
      this.transactionName = this.getTextMessage ("Tabs.Points")
    }
    else if (id === "settlement"  )   
    {
      this.transactionName = this.getTextMessage ("Tabs.Settlement")
    }
    else 
    {
      this.transactionName = this.getTextMessage ("Tabs.Sale")
    }
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
