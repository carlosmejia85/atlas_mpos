import { AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/StorageService';
import { ProSolution } from 'd135connector';
import { ConvertmodalPage } from '../modals/convertmodal/convertmodal.page';
import { TranslateConfigService } from '../services/translate-config.service';
import { globalVars } from 'src/contantes';

@Component({
  selector: 'app-confirmorder',
  templateUrl: './confirmorder.page.html',
  styleUrls: ['./confirmorder.page.scss'],
})
export class ConfirmorderPage implements OnInit 
{

  constructor
    (
      private navCtrl                       : NavController     , 
      private router                        : Router            ,  
      private route                         : ActivatedRoute    , 
      private storage                       : StorageService    , 
      private modalController               : ModalController   , 
      private loadingController             : LoadingController , 
      private alertController               : AlertController   , 
      private translateConfigService        : TranslateConfigService, 
      private platform                      : Platform            
    ) 
    { 

    }

  show_loading = true
  retry        = false
  base          : string = ""  
  tip           : string = ""  
  tax           : string = ""    
  otherAmount   : string = ""
  total         : string = ""  
  DeviceName          = ""
  device_status       = ""
  transactions : any  = []


  isTipEnabled  = false 
  isTaxEnabled  = false
  isOverCharged = false
  trxId         = ""
  quota         = ""
   Title        = ""
  isInstallment = false 
  total_title   = ""


  ngOnInit() 
  {

    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
     });

    this.route.queryParams
    .subscribe(params => 
    { 


      this.setUpLanguage            ()
      this.getTransalationMessages  ()


      this.total_title = this.getTextMessage ("Confirmation.TotalCost")



      this.DeviceName = this.storage.getSelectedDevice () 

      this.GetSelectedDevice() 
      //if (this.router.getCurrentNavigation().extras.state) 
      //{

        //const params        = this.router.getCurrentNavigation().extras.state;
      
        this.base         = params.baseAmount   ;
        this.tip          = params.tipAmount    ;
        this.tax          = params.taxAmount    ;
        this.total        = params.totalAmount  ;
        this.otherAmount  = params.otherAmount  ;
        this.trxId        = params.trxId        ;
        this.quota        = params.quota        ; 

        if (!this.quota) 
        {
            this.quota = "-1"
        }

        let defaultValueEnabledTip = this.storage.isEnabledTip () ;

        this.isTipEnabled = (defaultValueEnabledTip === 'true');

        let defaultValueEnabledTax = this.storage.isEnabledTax () ;

        this.isTaxEnabled = (defaultValueEnabledTax === 'true');

        let defaultValueEnabledOverCharged = this.storage.isEnabledOverCharged () ;

        this.isOverCharged = (defaultValueEnabledOverCharged === 'true');

        this.isInstallment = this.trxId === "installment"

        this.getTitle (this.trxId )


        if (this.trxId === "points_balance") 
        {
          this.isTipEnabled  = false 
          this.isTaxEnabled  = false
          this.isOverCharged = false
          this.isInstallment = false 

          this.total_title = this.getTextMessage ("Confirmation.TotalPoints")
        }
      //}

  });
    
  }



  getTitle ( id ) 
  {
    if (id === "refund"  ) 
    {
      this.Title = this.getTextMessage ("Tabs.Refund")
    } 
    else if (id === "sale"  )  
    {
      this.Title = this.getTextMessage ("Tabs.Sale")
    }
    else if (id === "installment"  )   
    {
      this.Title = this.getTextMessage ("Tabs.Installments")
    }
    else if (id === "points_balance"  )   
    {
      this.Title = this.getTextMessage ("Tabs.PointsBalance")
    }
    else if (id === "points"  )   
    {
      this.Title = this.getTextMessage ("Tabs.Points")
    }
    else if (id === "settlement"  )   
    {
      this.Title = this.getTextMessage ("Tabs.Settlement")
    }
    else 
    {
      this.Title = this.getTextMessage ("Tabs.Sale")
    }
  } 

  public messages : string[][] = [ 
    [ 
      "Transaction.ErrorGreater100"      ,     
      "Tabs.Sale"                ,
      "Tabs.Points"             ,
      "Tabs.PointsBalance"      ,
      "Tabs.Refund"             ,
      "Tabs.Installments"       ,
      "Tabs.Settlement"         , 
      "Confirmation.TotalCost"  , 
      "Confirmation.TotalPoints", 
      "Transaction.AmountZero"  ,    
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



  //-------------------------------------------------------------------------
  // name: GetSelectedDevice 
  //-------------------------------------------------------------------------
  async GetSelectedDevice (  ) 
  {
      this.DeviceName = this.storage.getSelectedDevice(); 

      if (this.DeviceName) 
      {
        let options = {"d135_name": this.DeviceName}

        ProSolution.connect (  options ).then (
          data => 
          {

            if (data.value == 0 || data.value == 1001)
            {
              this.device_status = " Connected"; 

              this.start_transaction  ( )
            }
            else 
            {
              this.device_status = " NOT Connected"; 
            }
          }
        );
      }
      else 
      {
        let options = {"d135_name": ""}

        ProSolution.connect (  options ).then (
          data => 
          {
          
            if (data.value == 0 || data.value == 1001)
            {
              this.device_status = " Connected"; 
            }
            else 
            {
              this.device_status = " NOT Connected"; 
            }
          });
          
      }  
  }

  //-------------------------------------------------------------------------
  // name: connect_device 
  //-------------------------------------------------------------------------
  connect_device() 
  {
    this.GetSelectedDevice();
  }

  //-------------------------------------------------------------------------
  // name: cancel_trx 
  //-------------------------------------------------------------------------
  cancel_trx () 
  {
    let options = { params: "" }

    this.show_loading = false 

    ProSolution.cancelTransaction ( options )

    this.router.navigate(
      ['/tabs']
      )
  
  }

  retryTrx() 
  {

    this.show_loading = true
    this.start_transaction();
  }

  //-------------------------------------------------------------------------
  // name: getUsername 
  //-------------------------------------------------------------------------
  getUsername () 
  {
    let data      = this.storage.getLoginData(); 

    var username  = ''

    if ( data ) 
    {
      globalVars.credential   = JSON.parse ( data ); 

      username                = globalVars.credential.username
    }

    return username 
  }

  //-------------------------------------------------------------------------
  // name: start_transaction 
  //-------------------------------------------------------------------------
  async start_transaction () 
  {

    var alert =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: 'Transaction process correctly',
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            this.modalController.dismiss();
          }
        }
      ]
      }
    );

      if (this.total == "0" || this.total == "0.00" || this.total == "") 
      {
        alert.message = this.getTextMessage ("Transaction.AmountZero")
        alert.present()
        return 
      }

      // Loading overlay
      const loading = await this.loadingController.create({
        cssClass      : 'default-loading',
        message       : '<p>Processing Transaction...</p> </br> <span>Please, wait a moment</span>',
        spinner       : 'crescent', 
        keyboardClose : true, 
        showBackdrop  : true, 
        backdropDismiss: true
      });
    
      

    //await loading.present();

    var alertError =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: 'Error while processing the transaction',
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            this.modalController.dismiss();
          }
        }
      ]
      }
    );

    let process_successfully  = false; 
    let message               = ""
    let totalAmount           = this.total 
    let baseAmount            = this.base 
    let tip_amount            = this.tip     
    let tax_amount            = this.tax     
    let other_amount          = this.otherAmount     
    let note                  = ""
    let selected_device       = this.storage.getSelectedDevice()

    let device_value           = -1

    let processing_code       = ""

    if (this.trxId == "sale" || this.trxId == "installment") 
    {
      processing_code = "000000"
    }
    else if (this.trxId == "refund")  
    {
      processing_code = "200000"
    }
    else 
    {
      processing_code = "000000"
    }


   let username = this.getUsername () 

    let options = 
    { 
      "amount"          : totalAmount       , 
      "base_amount"     : baseAmount        , 
      "tip_amount"      : tip_amount        , 
      "tax_amount"      : tax_amount        , 
      "other_amount"    : other_amount      , 
      "trxId"           : this.trxId        ,
      "d135_name"       : selected_device   , 
      "processing_code" : processing_code   , 
      "quota"           : this.quota        ,
      "username"        : username
    } ; 

    let transaction : any

    ProSolution.startTransaction ( options ).then (
      (data: any)  => 
      {
       
          process_successfully  = data.success    ; 
       
          message               = data.message    ;
    
          transaction           = data.transaction; 

          device_value          = data.value      ;
        }, 
      err => 
      {
        process_successfully  = false ; 
      }
    ).finally( () => 
    {
      
        this.show_loading = false 

        //loading.dismiss();

        /*
        transaction = {
          id : "1", 
          auth : "009988", 
          total: "123.56"
        }
        process_successfully = true
        */
        if (process_successfully == true)
        {

          this.retry = false 

      
          let jsonTrx = JSON.parse (transaction) 
          //let jsonTrx = transaction 

          if(jsonTrx)
          {

            var params : any = []; 
  
            params = { 
                    stan      : jsonTrx.id    ,  
                    authorized: jsonTrx.auth  ,  
                    total     : totalAmount   , 
                    trxId     : this.trxId 
                  } 

            if (this.trxId === "points_balance"  )     
            {
              this.base  = jsonTrx.balance
              this.total = jsonTrx.balance
            }
            else 
            {

              this.saveData ( transaction ); 
        
              this.router.navigate(
                ['/signature'], 
                { queryParams: params }
                )
            }

          }
        }
        else 
        {
          if (device_value != 4007 ) 
          {

            alertError.message = message

            alertError.present();

            this.retry = true
          }
         
        }
    
    }); 
      
  }

  saveData (trx)
  {

     if (this.trxId === "points_balance"  )     
     {
        return;
     }

     let tempTrx = this.storage.getTransactions();
 
     //let trxJson = trx //JSON.parse(trx) 

     let trxJson = JSON.parse(trx) 

     if (trxJson)
     {

       trxJson.note         = ""
       trxJson.tip_amount   = this.tip
       trxJson.tax_amount   = this.tax
       trxJson.base_amount  = this.base
       trxJson.total_amount = this.total

       this.transactions = JSON.parse (tempTrx)

       if (this.transactions) 
       {
        this.transactions.unshift (trxJson )
       }
       else 
       {
        this.transactions = []
        this.transactions.unshift (trxJson )
       }
       
       this.storage.setTransactions ( this.transactions )
    
     }
  
     //console.log ( this.transactions );
  }



  showSuccessPage()
  {
   // this.navCtrl.navigateRoot('transcomplete');

   this.router.navigate(
    ['/transcomplete'], 
    { 
      queryParams: { 
                      baseAmount  : this.base         , 
                      tipAmount   : this.tip          ,
                      taxAmount   : this.tax          ,
                      otherAmount : this.otherAmount  ,
                      trxId       : this.trxId        , 
                      totalAmount : this.total 
                    } 
    }
    )
  }


  async goToHome () 
  {

    this.cancel_trx(); 

    this.router.navigate(['/tabs/tab1']);
    
  }

}
