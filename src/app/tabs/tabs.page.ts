import { ExchangemodalPage } from './../modals/exchangemodal/exchangemodal.page';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { PaymentPage } from '../payment/payment.page';
import { BuystockPage } from '../buystock/buystock.page';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateConfigService } from '../services/translate-config.service';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { ProSolution } from 'd135connector';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit  
{

  constructor (
                private     modalController           : ModalController         , 
                private     routerOutlet              : IonRouterOutlet         , 
                private     router                    : Router                  , 
                private     route                     : ActivatedRoute          , 
                private     storage                   : StorageService          ,
                private     translateConfigService    : TranslateConfigService  ,
                private     actionSheetController     : ActionSheetController   , 
                private     loadingController         : LoadingController       , 
                private     toastService              : ToastService      , 
                private     alertController           : AlertController   
     
              ) 
    {


    }

    public messages : string[][] = 
    [ 
      [ 
        "Tabs.Sale"                           , 
        "TransactionView.SelectAction"        , 
        "TransactionView.Cancel"              , 
        "Tabs.Refund"                         ,   
        "Tabs.Points"                         ,   
        "Tabs.PointsBalance"                  ,   
        "Tabs.Settlement"                     ,
        "Tabs.Installments"                   , 
        "Transaction.ProcessingSettlement"     , 
        "Transaction.BatchEmpty"            ,
        "SignIn.Messages.NoDevicePaired"
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
        ""
      ]
    ]

    ngOnInit() 
    { 

      /*
      history.pushState(null, '', location.href);

      window.onpopstate = function () 
      {
        history.go(1);
      };
      */
    
      this.route.queryParams
      .subscribe(params => 
      {
        
        this.setUpLanguage            (                   ) 
        
        this.getTransalationMessages  (                   )

      });

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


  enableRefund      = true  
  enableInstallment = false 
  enablePoints      = false
    
  saleTotalAmount = "0.00"
  voidTotalAmount = "0.00"

    async presentModal() 
    {

      const alert =  await this.alertController.create(
        {
            subHeader : this.getTextMessage ("SignIn.Messages.Information"),
            message   : this.getTextMessage ("SignIn.Messages.NoDevicePaired"),
            buttons   : ['OK']
        });


      //vamos a dejar el refund por defecto en visible 
      //this.enableRefund       = this.storage.isRefundEnabled      () === 'true'

      this.enableInstallment  = this.storage.isInstallmentEnabled () === 'true'
      
      this.enablePoints       = this.storage.isPointsEnabled      () === 'true'
      /*
      const modal = await this.modalController.create(
        {
        component         : BuystockPage,
        componentProps    : { value: 123 }, 
        swipeToClose      : true,
        presentingElement : this.routerOutlet.nativeEl
      });
    
      await modal.present();
  
      */
      
      //await this.router.navigate(['/buy'] );  
      

      var _buttons =  [
        {
          text: this.getTextMessage ('Tabs.Sale'),
         
          handler: () => 
          {

            let device_selected = this.storage.getSelectedDevice(); 

            if (device_selected) 
            {
              let params = 
              { 
                trxId     : "sale"
              } 
              // Put in logic ...
               this.router.navigate(['/buy'],  { queryParams: params } );  
            }
            else 
            {
                alert.present()
            }

          }
        }

      ]

      if (this.enableRefund) 
      {
        _buttons.push (
          {
            text    : this.getTextMessage ('Tabs.Refund'),
            handler : () => 
            {

              let device_selected = this.storage.getSelectedDevice(); 

              if (device_selected)  
              {
                let params = 
                { 
                  trxId     : "refund"
                } 
              
                this.router.navigate(['/buy'],  { queryParams: params } ); 
              }
              else 
              {
                alert.present()
              }
             
            }
          }
        )
      }

      if (this.enableInstallment) 
      {
        _buttons.push (
          {
            text: this.getTextMessage ('Tabs.Installments'),
           
            handler: () => 
            {
              let device_selected = this.storage.getSelectedDevice(); 

              if (device_selected)  
              {
                let params = 
                { 
                  trxId     : "installment"
                } 
              
                this.router.navigate(['/buy'],  { queryParams: params } );  
              }
              else 
              {
                alert.present()
              }
            }
          }
        )
      }

      if (this.enablePoints) 
      {
        _buttons.push (
          {
            text: this.getTextMessage ('Tabs.PointsBalance'),
           
            handler: () => 
            {
             
              let device_selected = this.storage.getSelectedDevice(); 

              if (device_selected)  
              {
                let params = 
                { 
                  trxId     : "points_balance"
                } 
              
                this.router.navigate(['/buy'],  { queryParams: params } ); 
              }
              else 
              {
                alert.present()
              }
            }
          }
        )

        _buttons.push ( 
          {
            text: this.getTextMessage ('Tabs.Points'),
            handler: () => 
            {

              let device_selected = this.storage.getSelectedDevice(); 

              if (device_selected)  
              {
                let params = 
                { 
                  trxId     : "points"
                } 
              
                this.router.navigate(['/buy'],  { queryParams: params } );  
              }
              else 
              {
                alert.present()
              }
            }
          } 
        )
      }

      /*
      _buttons.push ( 
        {
          text: this.getTextMessage ('Tabs.Settlement'),
          handler: () => 
          {
             this.sendSettlement () 
          }
        }
      )
    */

      /*
      let actionSheetButtonSettle  =  
      {
        text: this.getTextMessage ('Tabs.Settlement'),
       
        handler: () => 
        {
          // Put in logic ...
          this.sendSettlement () 
        }
      }
      
      _buttons.push (
        actionSheetButtonSettle
      )
*/
      let actionSheetButton  =  
      {
        text: this.getTextMessage ('TransactionView.Cancel'),
        icon: 'close',
        role: 'cancel', 
        handler: () => 
        {
          // Put in logic ...

        }
      }

      _buttons.push (
        actionSheetButton
      )

      const actionSheet = await this.actionSheetController.create({
        header: this.getTextMessage ('TransactionView.SelectAction'),
        cssClass: 'custom-action-sheet',
        buttons: _buttons
      });
      await actionSheet.present();

    }

    async sendSettlement () 
    {


      // Proceed with loading overlay
      const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: this.getTextMessage("Transaction.ProcessingSettlement"),
        spinner: 'crescent'
      });

      await loading.present();

      this.transactions = JSON.parse  ( this.storage.getTransactions()  )

      if (!this.transactions)
      {
        this.transactions = []
      }

      this.getTotal_Batch ()

      if (this.sale_count == 0 && this.void_count == 0) 
      {
        loading.dismiss(); 

        // Display success message and go back
        this.toastService.presentToast('Error', this.getTextMessage("Transaction.BatchEmpty"), 'top', 'danger', 2000);

        return 
      }
    
      let selected_device = this.storage.getSelectedDevice()

      var alertError =  await this.alertController.create(
        {
        subHeader: 'Information',
        message: 'Settlement Error',
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

      let options = 
      { 
        "amount"          : "0.00"       , 
        "base_amount"     : "0.00"       , 
        "tip_amount"      : "0.00"       , 
        "tax_amount"      : "0.00"       , 
        "other_amount"    : "0.00"       , 
        "trxId"           : "settlement"      ,
        "d135_name"       : selected_device   , 
        "processing_code" : "920000"          , 
        "quota"           : "-1"              ,
        "count_sale"      : this.sale_count.toString(),
        "count_void"      : this.void_count.toString(),
        "total_sale"      : this.saleTotalAmount ,
        "total_void"      : this.voidTotalAmount       
      } ; 
  
      ProSolution.startTransaction ( options ).then (
        (data: any)  => 
        {
             loading.dismiss(); 

            let message  = data.message    ;

            alertError.message = message
            alertError.present()

            this.storage.setTransactions ( [] )

            this.router.navigate(['/tabs'] ); 

        }, 
        err => 
        {
          alertError.present()
        }
      )
    }


  transactions : any = []

  lBatch_total        = 0;
  lBatch_voided_total = 0;

  sale_count          = 0; 
  void_count          = 0;
  //---------------------------------------
  // name       : getTotal_Batch
  // description: Sum of all total transaction 
  // in the batch 
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  getTotal_Batch () 
  {
    if (!this.transactions) 
    {
        return
    }

    let length = this.transactions.length;
    
    for (let i =0 ; i < length; i++) 
    {
      if (this.transactions[i].voided == true)
      {
        this.void_count += 1;
        this.lBatch_voided_total += parseFloat(this.transactions[i].total_amount)
      }
      else 
      {
        this.sale_count += 1;
        this.lBatch_total += parseFloat(this.transactions[i].total_amount)
      }
    }

    let separator = "" 

    this.saleTotalAmount = this.formatNumber ( this.lBatch_total        , separator  )

    this.voidTotalAmount = this.formatNumber ( this.lBatch_voided_total , separator  )

  }


  formatNumber ( total, separator) 
  {
    let array = (total + "").split (".")

    var integerPart = ""
    var decimalPart = ""

    if (array.length == 2) 
    {
      integerPart = array[0]; 
      
      if (array [1].length >= 2) 
      {
        decimalPart = array[1].substring(0,2)
      }
      else 
      {
        decimalPart = array [1]
      }
    }
    else 
    {
      integerPart = array[0];
      decimalPart = "00"
    }

    return integerPart + separator + decimalPart;
  }
}
