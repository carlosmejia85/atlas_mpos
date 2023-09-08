import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, Platform, isPlatform } from '@ionic/angular';
import { ProSolution } from 'd135connector';
import { globalVars } from 'src/contantes';
import { ToastService } from '../services/toast.service';
import { HttpService } from '../services/HttpService';
import { StorageService } from '../services/StorageService';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.page.html',
  styleUrls: ['./viewtransaction.page.scss'],
})
export class ViewtransactionPage implements OnInit {

  constructor( 
    private route                       : ActivatedRoute        , 
    private router                      : Router                , 
    private alertController             : AlertController       ,
    private toastService                : ToastService          ,
    private loadingController           : LoadingController     ,
    private httpService                 : HttpService           , 
    private actionSheetController       : ActionSheetController , 
    private storage                     : StorageService        ,
    private     translateConfigService  : TranslateConfigService , 
    private platform                    : Platform                
    ) 
    { 

      let priority = 9999
    
      this.platform.backButton.subscribeWithPriority(priority, () => {
        // do on back button click
       });
    }


  yes_label       = ''
  demo_data           : boolean 
  transaction_id                  = "" 
  transactions        : any       = []
  current_transaction : any
  entryMode                       = ""
  customer_email                  = ""
  emailError                      = false
  cellPhoneError                  = false

  transactionName = ""

  prefix          = "+507"

  getTitle ( id ) 
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

    return this.transactionName
  } 

  userEmails = new FormGroup({
    primaryEmail: new FormControl('')
    });
    

    public messages : string[][] = 
    [ 
      [ "TransactionView.VoidThisTransaction"         , 
        "TransactionView.SelectAction"                , 
        "TransactionView.Cancel"         ,
        "Tabs.Sale"          ,
        "Tabs.Points"        ,
        "Tabs.PointsBalance"  ,
        "Tabs.Refund"         ,
        "Tabs.Installments"  ,
        "Tabs.Settlement"    , 
        "TransactionView.SMSError", 
        "TransactionView.SendSMSMessage",
        "TransactionView.SendMailMessage", 
        "TransactionView.Settled", 
        "TransactionView.Yes"

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
        "", 
        "", 
        "", 
        "", 
        ""
      ]
    ]

  ngOnInit() 
  {
    this.route.queryParams
    .subscribe(params => 
    {
      
      this.setUpLanguage            (                   ) 
      
      this.getTransalationMessages  (                   )

      this.transaction_id =  params.id            ;

      this.demo_data      = globalVars.demo_data  ;

      this.getTransactions    (                       ) ;
      
      this.yes_label = this.getTextMessage ('TransactionView.Yes'); 

      if (this.transaction_id) 
      {
        this.search_transaction (   parseInt( this.transaction_id )  ) ;
      }

    });
  }


  handleChange(e) 
  {
    console.log('ionChange fired with value: ' + e.detail.value);

    this.prefix = e.detail.value

    this.current_transaction.prefix = this.prefix 

    this.saveData() 

  }

  //---------------------------------------
  // name       : search_transaction
  // description: Find a transaction by its id 
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  search_transaction ( id ) 
  {
    var filtered = this.transactions.filter(a => a.id == id);
    
    if (filtered && filtered.length > 0) 
    {
      this.current_transaction = filtered [ 0 ]

      if (this.current_transaction) 
      {
        if (this.current_transaction.entryMode == '052') 
        {
          this.entryMode = "Chip";
        }
        else  if (this.current_transaction.entryMode == '072')  
        {
          this.entryMode = "Contactless";
        }
        else  if (this.current_transaction.entryMode == '022')  
        {
          this.entryMode = "Magnetic Card";
        }

        this.prefix = this.current_transaction.prefix

        if (this.prefix  === "" ) 
        {
          this.prefix                       = "+507"
          this.current_transaction.prefix   = this.prefix 
        }

        this.getTitle (this.current_transaction.trxId)
      
      }
    
    }
  }

  
  viewSignature () 
  {

    if (this.current_transaction) 
    {
      var params : any = []; 
    
      params = { 
              stan      : this.current_transaction.id    ,  
              authorized: this.current_transaction.auth  ,  
              total     : this.current_transaction.total_amount, 
              view      : true
            } 

      this.router.navigate(
        ['/signature'], 
        { queryParams: params }
        )
    }
  }
  //---------------------------------------
  // name       : getTransactions
  // description: Get transaction from local 
  //     storage
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  getTransactions () 
  {
    let username = this.getUsername () 

    if (this.demo_data) 
    {
        this.getDemoTransactions  (   )
    }
    else 
    {
        this.getTransactionsData  (  username )
    }
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
  

  //---------------------------------------
  // name       : getTransactionsData
  // description: Get Transaction data
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  getTransactionsData   (      username         ) 
  {
     console.log("getTransactionsData"); 
 
     let trxJson = this.storage.getTransactions()
 
     let temp : any = [] 

     if (trxJson)
     {
       //this.transactions = JSON.parse (trxJson)
       temp = JSON.parse (trxJson)
     }
  
     this.transactions = []

    if (! temp ) 
    {
        return
    }

    let length = temp.length;
    
    for (let i =0 ; i < length; i++) 
    { 
      if ( ! (temp[i].username == username) ) 
      {
        continue;
      }

      this.transactions.push ( temp[i] )
    }
     
     console.log ( this.transactions );
   }


  //---------------------------------------
  // name       : getDemoTransactions
  // description: Get Transaction demo data
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------

  getDemoTransactions () 
  {
    const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => 
    {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});


    this.transactions.push (  
                            { 
                              id              : 1                     , 
                              total_amount    : 100.67                ,
                              tip_amount      : 0                     , 
                              tax_amout       : 0                     ,
                              card            : "**** **** **** 2200 ", 
                              voided          : false                 ,
                              settled         : false                 , 
                              note            : "Coffee"              ,
                              stan            : "209988"              , 
                              auth            : "109543"              , 
                              trx_date        : "April 1, 2023"       , 
                              trx_time        : "14:54:12"            , 
                              signature       : ""                    
                            }
      );  

      this.transactions.push (
                            { 
                              id              : 2                     , 
                              total_amount    : 93.12                 ,
                              tip_amount      : 0                     , 
                              tax_amout       : 0                     ,
                              card            : "**** **** **** 3942 ", 
                              voided          : true                  ,
                              settled         : false                 ,
                              note            : "Warehouse Utilities" ,
                              stan            : "209989"              , 
                              auth            : "076001"              ,
                              trx_date        : "March 30, 2023"      , 
                              trx_time        : "12:22:12"            , 
                              signature       : ""                                    
                            }
                            );  

      this.transactions.push (
                            { 
                              id              : 3                     ,  
                              total_amount    : 33.04                 ,
                              tip_amount      : 0                     , 
                              tax_amout       : 0                     ,
                              card            : "**** **** **** 7576" ,  
                              voided          : false                 ,
                              settled         : false                 ,  
                              note            : "Miscelanous"         ,
                              stan            : "209990"              , 
                              auth            : "109543"              ,  
                              trx_date        : "March 30, 2023"      ,
                              trx_time        : "12:19:35"            ,
                              signature       : ""                         
                            }
        );  

        this.transactions.push (
                          { 
                              id              : 4                       ,  
                              total_amount    : 132.28                  ,
                              tip_amount      : 0                       , 
                              tax_amout       : 0                       ,
                              card            : "**** **** **** 4236"   ,  
                              voided          : false                   ,
                              settled         : false                   ,  
                              note            : "Library "              ,
                              stan            : "209990"                , 
                              auth            : "109543"                , 
                              trx_date        : "March 30, 2023"        , 
                              trx_time        : "10:00:54"              , 
                              signature       : ""            
                          }
        );  

    const groupByDate = groupBy     ( 'trx_date'          );

    var   trxs        = groupByDate ( this.transactions   ); 

    console.log (trxs) 

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



  async askVoidTransaction () 
  {
    const actionSheet = await this.actionSheetController.create({
      header: this.getTextMessage ('TransactionView.SelectAction'),
      cssClass: 'custom-action-sheet',
      buttons: [
        /*
          text: 'Cuenta',
          icon: 'wallet',
          handler: () => {
            // Put in logic ...
          }
        },*/
        {
          text: this.getTextMessage ('TransactionView.VoidThisTransaction'),
          icon: 'swap-horizontal-outline',
          handler: () => 
          {
            // Put in logic ...

            this.voidTransaction()

          }
        }, 
        {
          text: this.getTextMessage ('TransactionView.Cancel'),
          icon: 'close',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }




  onEmailChange(event: any) 
  {
      let value = event.target.value

      let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 

      const regex = new RegExp(emailPattern);
  
      this.emailError = ! (regex.test ( value ) )
    
      this.current_transaction.toEmail = value
   }

  async voidTransaction() 
  {

    let process_successfully  = false 
    let selected_device       = this.storage.getSelectedDevice()
    let message               = ""

     // Loading overlay
     const loading = await this.loadingController.create({
      cssClass  : 'default-loading',
      message   : this.getTextMessage ('TransactionView.ProcessingTransaction'),
      spinner   : 'crescent'
    });
  
    var alert =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: this.getTextMessage ('TransactionView.VoidSuccess'),
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            
          }
        }
      ]
      }
    );

    var alertError =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: this.getTextMessage ('TransactionView.VoidError'),
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            
          }
        }
      ]
      }
    );


  
    loading.present () 

    let options = 
    { 
      "amount"          : this.current_transaction.total_amount , 
      "base_amount"     : this.current_transaction.base_amount , 
      "tip_amount"      : this.current_transaction.tip_amount  , 
      "tax_amount"      : this.current_transaction.tax_amount  , 
      "d135_name"       : selected_device                       ,
      "processing_code" : "020000"                              , 
      "maskedCard"      : this.current_transaction.card  
    } ; 

    let transaction : any

    ProSolution.startTransaction ( options ).then (
      (data: any)  => 
      {
       
          process_successfully  = data.success ; 
       
          message               = data.message  ;
    
          transaction           = data.transaction; 
        }, 
      err => 
      {
        process_successfully  = false ; 
      }
    ).finally( () => 
    {
      
        loading.dismiss();

  
        if (process_successfully == true)
        {
 
          alert.present()

          this.current_transaction.voided = true
          
          this.saveData (  ); 
        }
        else 
        {
          alertError.present();
        }
    
    }); 
  }

  saveData ( )
  {

     if (this.transactions)
     {
       this.storage.setTransactions ( this.transactions )
      }
    
  }

  getTerminalID() 
  {
    return this.storage.getTerminalId ()
  }

  getMerchantID() 
  {
    return this.storage.getMerchantId ()
  }


  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }

  async sendEmail () 
  {

    let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 

    const regex = new RegExp(emailPattern);


    if (regex.test ( this.current_transaction.toEmail ) == false)
    {
        this.emailError = true
        return ;
    }

    this.emailError = false 

     // Loading overlay
     const loading = await this.loadingController.create({
      cssClass: 'default-loading',
      message:  this.getTextMessage ('TransactionView.SendMailMessage'),
      spinner: 'crescent'
    });
  
    var alert =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: 'Transaction voided correctly',
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            
          }
        }
      ]
      }
    );


    loading.present() ; 

    //-------
    // para guardar el dato del correo 
    //------

    this.saveData () ;

    let webServiceData = 
    {
      BaseAmount  : this.current_transaction.base_amount.toString()  , 
      TotalAmount : this.current_transaction.total_amount , 
      TerminalId   : this.getTerminalID ()                 , 
      MerchantId  : this.getMerchantID ()                 , 
      Status      : this.current_transaction.voided == false ? "Completed" : "Voided", 
      Card        : this.current_transaction.card         ,
      EntryMode   : this.entryMode                        ,
      TrxDate     : (this.current_transaction.trx_date + " / " + this.current_transaction.trx_time),
      Note        : this.current_transaction.note         , 
      TrxId       : this.current_transaction.auth         , 
      ToEmail     : this.current_transaction.toEmail      ,
      CompanyName : "Atlas Bank"                          , 
      Signature   : this.current_transaction.signature
    }

      this.httpService.MPOS_doPut ("/MPOS/sendReceiptMail", webServiceData).subscribe( 
        async (res : any) => 
        {
            loading.dismiss()

            let response;

            if (isPlatform('capacitor')) 
            {
              response = res.data; 
            }
            else 
            {
              response = res; 
            }
  
            if (response) 
            {
              let message = response.message 

              alert.message = message 

              await alert.present()
            }
            
            /*
            if (this.LoginData.result ==  false) 
            {
              await alert.present();      
            }
            else
            {
              await this.router.navigate(['/home']);
            }
            */
          
        }, 
        async err => 
        {

          console.log (err); 
          
          loading.dismiss();

          alert.message = this.getTextMessage ('TransactionView.EmailError'); 

          await alert.present();
  
        }
      )
  }

  async sendSMS ( ) 
  {
    // Loading overlay
    const loading = await this.loadingController.create({
      cssClass: 'default-loading',
      message:  this.getTextMessage ('TransactionView.SendSMSMessage'),
      spinner: 'crescent'
    });
  
    var alert =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: 'Transaction voided correctly',
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            
          }
        }
      ]
      }
    );

    loading.present() ; 

    //-------
    // para guardar el dato del correo 
    //------

    this.saveData () ;

    let webServiceData = 
    {
      BaseAmount  : this.current_transaction.base_amount.toString()  , 
      TotalAmount : this.current_transaction.total_amount , 
      TerminalId   : this.getTerminalID ()                 , 
      MerchantId  : this.getMerchantID ()                 , 
      Status      : this.current_transaction.voided == false ? "Completed" : "Voided", 
      Card        : this.current_transaction.card         ,
      EntryMode   : this.entryMode                        ,
      TrxDate     : (this.current_transaction.trx_date + " / " + this.current_transaction.trx_time),
      Note        : this.current_transaction.note         , 
      TrxId       : this.current_transaction.auth         , 
      ToEmail     : this.current_transaction.toEmail      ,
      CompanyName : "Atlas Bank"                          , 
      Signature   : this.current_transaction.signature    ,
      PhoneNumber : this.prefix + this.current_transaction.toCellphone
    }

      this.httpService.MPOS_doPut ("/MPOS/sendReceiptSMS", webServiceData).subscribe( 
        async (res : any) => 
        {
            loading.dismiss()

            let response;

            if (isPlatform('capacitor')) 
            {
              response = res.data; 
            }
            else 
            {
              response = res; 
            }
  
            if (response) 
            {
              let message = response.message 

              alert.message = message 

              await alert.present()
            }
            
            /*
            if (this.LoginData.result ==  false) 
            {
              await alert.present();      
            }
            else
            {
              await this.router.navigate(['/home']);
            }
            */
          
        }, 
        async err => 
        {

          console.log (err); 
          
          loading.dismiss();

          alert.message = this.getTextMessage ('TransactionView.SMSError'); 

          await alert.present();
  
        }
      )
  }

  async goToHome () 
  {
    this.router.navigate(['/tabs/tab1']);
  }

}
