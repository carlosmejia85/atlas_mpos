import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-terminalconfig',
  templateUrl: './terminalconfig.page.html',
  styleUrls: ['./terminalconfig.page.scss'],
})
export class TerminalconfigPage implements OnInit 
{
  //@ViewChild(IonModal) modal: IonModal;
  
  @ViewChild('taxModal')        taxModal          : IonModal;
  @ViewChild('tipModal')        tipModal          : IonModal;
  @ViewChild('surchargeModal')  surchargeModal    : IonModal;

  constructor
  (
    public      alertController         : AlertController       , 
    public      storage                 : StorageService        ,
    public      toast                   : ToastService          , 
    private     router                  : Router                , 
    private     route                   : ActivatedRoute        ,
    private     translateConfigService  : TranslateConfigService   
  ) 
  {

  }

  public messages : string[][] = [ 
    [ "TerminalConfig.TerminalId"           , 
      "TerminalConfig.MerchantId"           , 
      "TerminalConfig.Save"                 , 
      "TerminalConfig.Cancel"               ,               
      "TerminalConfig.Tax"                  , 
      "TerminalConfig.Max8"                 , 
      "TerminalConfig.Max15"                ,
      "TerminalConfig.Timeout"              , 
      "TerminalConfig.TimeoutMax2"
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
      ""
    ], 
  
  ]

  isEnabledTax          = false
  taxAmount             = "0.00"
  surchargeAmount       = "0.00"

  isEnabledTip          = false


  tipAmount1            = "0.00"
  tipAmount2            = "0.00"
  tipAmount3            = "0.00"
  tipAmount4            = "0.00"

  isOverChargedEnabled  = false
  enablePoints          = false 
  enableRefund          = false 
  enableInstallments    = false 


  ngOnInit() 
  {
    this.route.queryParams
    .subscribe(params => 
    { 

      this.setUpLanguage            (                   ) 

      this.getTransalationMessages  (                   )

      let defaultValueEnabled     = this.storage.isEnabledTax () ;

      this.isEnabledTax           = (defaultValueEnabled === 'true');

      this.taxAmount              = this.storage.getTax       ()

      let defaultValueEnabledTip  = this.storage.isEnabledTip () ;

      let defaultValueEnabledOverCharged  = this.storage.isEnabledOverCharged () ;

      this.isEnabledTip                 = (defaultValueEnabledTip === 'true');


      let _enabledPoints                = this.storage.isPointsEnabled () ;

      this.enablePoints                 = (_enabledPoints === 'true');


      let _enabledRefund                = this.storage.isRefundEnabled () ;

      this.enableRefund                 = (_enabledRefund === 'true');


      let _enabledInstallments          = this.storage.isInstallmentEnabled () ;

      this.enableInstallments           = (_enabledInstallments === 'true');


      this.isOverChargedEnabled         = (defaultValueEnabledOverCharged === 'true');

      this.tipAmount1      = this.storage.getTip1       ()
      this.tipAmount2      = this.storage.getTip2       ()
      this.tipAmount3      = this.storage.getTip3       ()
      this.surchargeAmount = this.storage.getSurcharge  ()
      //this.tipAmount4      = this.storage.getTip4       ()

    });
  }

  async checkEnablePoint() 
  {
    //this.enablePoints = !this.enablePoints ; 

    this.storage.setPointsEnabled (this.enablePoints === true ? 'true' : 'false')

  }

  async updatePoints(event)
  {
  
    this.enablePoints =  event

    this.checkEnablePoint();
  }


  async checkEnableRefund () 
  {
    //this.enableRefund = !this.enableRefund ; 

    this.storage.setRefundEnabled (this.enableRefund === true ? 'true' : 'false')
  }

  async updateRefund (event)
  {
    this.enableRefund = event 
    this.checkEnableRefund();
  }


  async checkEnableInstallments () 
  {
    //this.enableInstallments = !this.enableInstallments ; 

    this.storage.setInstallmentEnabled (this.enableInstallments === true ? 'true' : 'false')
  }

  async updateInstallment (event)
  {

    this.enableInstallments =  event
    this.checkEnableInstallments();
  }

  async setUpLanguage                 (                   ) 
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


  async setGlobalTimeout () 
  {
    let defaultValue = this.storage.getTimeout()
  
    this.alertController.create({
      header: this.getTextMessage ('TerminalConfig.Timeout'),
     
      inputs: [
        {
          name        : 'timeout',
          placeholder : this.getTextMessage ('TerminalConfig.TimeoutMax2') ,
        
          value       : defaultValue, 
          attributes: {
            maxlength: 2,
          },
        },
      ],
      buttons: [
        {
          text:  this.getTextMessage ('TerminalConfig.Cancel'),
          handler: (data: any) => 
          {
            console.log('Canceled', data);
          }
        },
        {
          text: this.getTextMessage ('TerminalConfig.Save'),
          handler: (data: any) => 
          {
            console.log('Saved Information', data);

            this.storage.setTimeout ( data.timeout )
           
          }
        }
      ]
    }).then(res => 
      {
      res.present();
    });
  }

  async setTerminalId() 
  {
    let defaultValue = this.storage.getTerminalId()
  
    this.alertController.create({
      header: this.getTextMessage ('TerminalConfig.TerminalId'),
     
      inputs: [
        {
          name        : 'terminal_id',
          placeholder : this.getTextMessage ('TerminalConfig.Max8') ,
        
          value       : defaultValue, 
          attributes: {
            maxlength: 8,
          },
        },
      ],
      buttons: [
        {
          text:  this.getTextMessage ('TerminalConfig.Cancel'),
          handler: (data: any) => 
          {
            console.log('Canceled', data);
          }
        },
        {
          text: this.getTextMessage ('TerminalConfig.Save'),
          handler: (data: any) => 
          {
            console.log('Saved Information', data);

            this.storage.setTerminalId ( data.terminal_id )
           
          }
        }
      ]
    }).then(res => 
      {
      res.present();
    });
  }

  async setMerminalId() 
  {
    let defaultValue = this.storage.getMerchantId()
  
    this.alertController.create({
      header: this.getTextMessage ('TerminalConfig.MerchantId'),
     
      inputs: [
        {
          name        : 'merchant_id',
          placeholder : this.getTextMessage ('TerminalConfig.Max15'),
        
          value       : defaultValue, 
          attributes: {
            maxlength: 15,
          },
        },
      ],
      buttons: [
        {
          text: this.getTextMessage ('TerminalConfig.Cancel'),
          handler: (data: any) => 
          {
            console.log('Canceled', data);
          }
        },
        {
          text: this.getTextMessage ('TerminalConfig.Save'),
          handler: (data: any) => 
          {
            console.log('Saved Information', data);

            this.storage.setMerchantId ( data.merchant_id )
           
          }
        }
      ]
    }).then(res => 
      {
      res.present();
    });
  }


  async setTax() 
  {
    
    let defaultValue        = this.storage.getTax       ()
  
    let defaultValueEnabled = this.storage.isEnabledTax () ;

    let enabledTax : boolean = false 

    enabledTax = (defaultValueEnabled === 'true');

    this.alertController.create({
      header: this.getTextMessage ('TerminalConfig.Tax') + '(%) ',
      inputs: [
        {
          name        : 'tax'     ,
          type        : 'number'  ,
          min         : 1         ,
          max         : 100,
          value       : defaultValue, 
          label       : 'Tax (%)'
       },
        {
          name        : 'enabledTax'        ,
          type        : 'checkbox'          ,
          label       : 'Enable Tax'        ,
          checked     : enabledTax
        },
       
      ],
      buttons: [
        {
          text: this.getTextMessage ('TerminalConfig.Cancel'),
          handler: (data: any) => 
          {
            console.log('Canceled', data);
          }
        },
        {
          text: this.getTextMessage ('TerminalConfig.Save'),
          handler: (data: any) => 
          {
            console.log('Saved Information', data);

            if (data.tax <0 || data.tax > 100) 
            {
              this.toast.presentToast('Error', this.getTextMessage ('TerminalConfig.ErrorNumberGreater'), 'top', 'danger', 2000);
           
            }
            else 
            {
              this.storage.setTax ( data.tax )
            }

            this.storage.setEnabledTax (data.enabledTax)
            
           
          }
        }
      ]
    }).then(res => 
      {
      res.present();
    });
  }

  cancel() 
  {
    this.taxModal.dismiss(null, 'cancel')
  }

  cancelTip() 
  {
    this.tipModal.dismiss(null, 'cancel')
  }

  cancelSurcharge () 
  {
    this.surchargeModal.dismiss(null, 'cancel')
  }

  async confirm( name ) 
  { 

    if (name == 'tip') 
    {
      this.storage.setEnabledTip          (   this.isEnabledTip   )

      this.storage.setTip1                (   this.tipAmount1     )
      this.storage.setTip2                (   this.tipAmount2     )
      this.storage.setTip3                (   this.tipAmount3     )
      //this.storage.setTip4                (   this.tipAmount4     )
      //this.storage.setEnabledOverCharged  ( this.isOverChargedEnabled)

      this.tipModal.dismiss(null, 'confirm');
    }

    else if (name == 'tax') 
    {
      this.storage.setTax         (   this.taxAmount    )
      
      this.storage.setEnabledTax  (   this.isEnabledTax )

      this.taxModal.dismiss       (null, 'confirm');
    }
    else if (name == 'surcharge') 
    {
      
      this.storage.setEnabledOverCharged  ( this.isOverChargedEnabled )
      this.storage.setSurcharge           ( this.surchargeAmount      ) 
      this.surchargeModal.dismiss         ( null, 'confirm' );
    }

    
  }

  // Format expiry date
  onTaxAmountChange(event: any) 
  {
    let value = event.target.value

    let amountValue = this.formatNumber (value)
    
    if (amountValue) 
    {
      event.target.value = amountValue

      this.taxAmount =   amountValue
    }
  }

  onSurchargeAmountChange( event : any)
  {
    let value = event.target.value

    let amountValue = this.formatNumber (value)
    
    if (amountValue) 
    {
      event.target.value    = amountValue

      this.surchargeAmount  = amountValue
    }
  }

  // Format expiry date
  onTip1AmountChange(event: any) 
  {
    let value = event.target.value

    let amountValue = this.formatNumber (value)
    
    if (amountValue) 
    {
      event.target.value = amountValue

      this.tipAmount1 =   amountValue
    }
  }

  // Format expiry date
  onTip2AmountChange(event: any) 
  {
    let value = event.target.value

    let amountValue = this.formatNumber (value)
    
    if (amountValue) 
    {
      event.target.value = amountValue

      this.tipAmount2 =   amountValue
    }
  }

  // Format expiry date
  onTip3AmountChange(event: any) 
  {
    let value = event.target.value

    let amountValue = this.formatNumber (value)
    
    if (amountValue) 
    {
      event.target.value = amountValue

      this.tipAmount3 =   amountValue
    }
  }

  // Format expiry date
  onTip4AmountChange(event: any) 
  {
    let value = event.target.value

    let amountValue = this.formatNumber (value)
    
    if (amountValue) 
    {
      event.target.value = amountValue

      this.tipAmount4 =   amountValue
    }
  }

  formatNumber(e: any, separador: string = '.', decimais: number = 2) 
  {
    if (e == "") 
    {
      return "0.00"
    }

  
    //let a:any = e.value.split('');
    let a:any = e.split('');
    let ns:string = '';
    a.forEach((c:any) => { if (!isNaN(c)) ns = ns + c; });
    ns = parseInt(ns).toString();
    if (ns.length < (decimais+1)) { ns = ('0'.repeat(decimais+1) + ns); ns = ns.slice((decimais+1)*-1); }
    let ans = ns.split('');
    let r = '';
    for (let i=0; i < ans.length; i++) if (i == ans.length - decimais) r = r + separador + ans[i]; else r = r + ans[i];
  
    return r;
  
  }

  /*
  onWillTaxDismiss(event: Event) 
  {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') 
    {
      
      this.storage.setTax         (   this.taxAmount    )
      

      this.storage.setEnabledTax  (   this.isEnabledTax )
    }
  }

  onWillTipDismiss(event: Event) 
  {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') 
    {
    
      this.storage.setEnabledTip  (   this.isEnabledTip   )

      this.storage.setTip1        (   this.tipAmount1     )
      this.storage.setTip1        (   this.tipAmount2     )
      this.storage.setTip1        (   this.tipAmount3     )
      this.storage.setTip1        (   this.tipAmount4     )
    }
  }
*/
}
