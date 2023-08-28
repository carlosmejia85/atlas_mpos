import { AlertController, AnimationController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/StorageService';
import { TranslateConfigService } from '../services/translate-config.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-buystock',
  templateUrl: './buystock.page.html',
  styleUrls: ['./buystock.page.scss'],
})
export class BuystockPage implements OnInit 
{
  baseAmount        : string  = "0.00";
  taxAmount         : string  = "0.00";
  tipAmount         : string  = "0.00";
  totalAmount       : string  = "0.00";
  overChargedAmount : string  = "0.00";
  selected_tip      : number  ;
  stock             : any     ;
  coordsx           : any     ;
  coordsy           : any     ;

  tipAmount1      = "0.00"
  tipAmount2      = "0.00"
  tipAmount3      = "0.00"
  tipAmount4      = "0.00"

  trxId           = ""

  isTipEnabled          = false 
  isTaxEnabled          = false
  isOverChargedEnabled  = false
  isInstallmentEnabled  = false
  Title = ""

  quotas = ""


  surchargePercentage = ""
  taxPercentage       = ""

  @ViewChild('header') headerImage: ElementRef;

  constructor(
    private     navCtrl                   : NavController         ,
    private     route                     : ActivatedRoute        ,
    private     router                    : Router                ,      
    private     renderer                  : Renderer2             ,
    private     animationCtrl             : AnimationController   ,
    private     cdr                       : ChangeDetectorRef     , 
    public      storage                   : StorageService        , 
    private     translateConfigService    : TranslateConfigService,
    private     toastService              : ToastService      , 
    private modalController               : ModalController   , 
    private loadingController             : LoadingController , 
    private alertController               : AlertController   , 
    ) 
    {

    }


    public messages : string[][] = [ 
      [ 
        "Transaction.ErrorGreater100"       ,     
        "Tabs.Sale"                         ,
        "Tabs.Points"                       ,
        "Tabs.PointsBalance"                ,
        "Tabs.Refund"                       ,
        "Tabs.Installments"                 ,
        "Tabs.Settlement"                   , 
        "Transaction.Zero"                  , 
        "Transaction.AmountZero"            , 
        "TerminalConfig.TerminalIdRequired" , 
        "TerminalConfig.MerchantIdRequired"
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
      ], 
    
    ]

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

  async ngOnInit() 
  {
   

    const alert = await this.alertController.create(
      {
      subHeader: 'Information',
      message: this.getTextMessage("TerminalConfig.TerminalIdRequired"),
      buttons: [
        {
          text: 'OK', 
          handler: () => 
          {
            this.router.navigate(['/tabs/tab1'] ); 
          }
        }
      ]
      }
    );

    this.route.queryParams.subscribe(_p => 
      {
   
        this.setUpLanguage            () ;

        this.getTransalationMessages  () ;


        let terminalId = this.storage.getTerminalId(); 
        let merchantId = this.storage.getMerchantId();
        
      
        if (!merchantId) 
        {
          alert.message = this.getTextMessage("TerminalConfig.MerchantIdRequired")
          alert.present();
        }

        if (merchantId === "") 
        {
          alert.message = this.getTextMessage("TerminalConfig.MerchantIdRequired")
          alert.present();
        }

        if (!terminalId) 
        {
          alert.message = this.getTextMessage("TerminalConfig.TerminalIdRequired")
          alert.present();
        }

        if (terminalId === "") 
        {
          alert.message = this.getTextMessage("TerminalConfig.TerminalIdRequired")
          alert.present();
        }

      
        let defaultValueEnabledTip  = this.storage.isEnabledTip           ( ) ;

        let defaultValueOverCharged = this.storage.isEnabledOverCharged   ( ) ;

        this.isOverChargedEnabled   = (defaultValueOverCharged === 'true')

        this.isTipEnabled           = (defaultValueEnabledTip === 'true');

        let defaultValueEnabledTax  = this.storage.isEnabledTax () ;

        this.isTaxEnabled           = (defaultValueEnabledTax === 'true');

        if (this.isTipEnabled === true) 
        {
            this.tipAmount1 = this.storage.getTip1();
            this.tipAmount2 = this.storage.getTip2();
            this.tipAmount3 = this.storage.getTip3();
            this.tipAmount4 = this.storage.getTip4();

            if (this.tipAmount1 == "0.00" && this.tipAmount2 == "0.00" && this.tipAmount3 == "0.00") 
            {
              this.isTipEnabled = false
            }
        }
      

        this.surchargePercentage  = this.storage.getSurcharge() 
        this.taxPercentage        = this.storage.getTax     ()

        this.trxId = _p.trxId; 

        this.getTitle (this.trxId ) 

        if (this.trxId === "refund" ) 
        {
          this.isTipEnabled         = false
          this.isTaxEnabled         = false 
          this.isOverChargedEnabled = false
          this.isInstallmentEnabled = false
        }
        else if (this.trxId === "installment" ) 
        {
          this.isTipEnabled         = false
          this.isTaxEnabled         = false 
          this.isOverChargedEnabled = false
          this.isInstallmentEnabled = true
        }
        else if (this.trxId === "points" ) 
        {
          this.isTipEnabled         = false
          this.isTaxEnabled         = false 
          this.isOverChargedEnabled = false
          this.isInstallmentEnabled = false
        }

        else if (this.trxId === "points_balance") 
        {
          this.router.navigate(
            ['/confirmorder'], 
            { 
              queryParams: { 
                              baseAmount  : "0.00"       , 
                              tipAmount   : "0.00"       ,
                              taxAmount   : "0.00"       ,
                              otherAmount : "0.00"       ,
                              totalAmount : "0.00"       , 
                              trxId       : this.trxId   , 
                              quota       : "0.00" 
                            } 
            }
            )
        }




      })

    if (this.router.getCurrentNavigation().extras.state) 
    {
      const params = this.router.getCurrentNavigation().extras.state;
     
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


automatic_tax () 
{
  let baseAmount = parseFloat (this.baseAmount)

  if (this.isTaxEnabled === true) 
  {
    let tax = this.storage.getTax()

    let strAmount = this.formatNumber ( ( ( parseFloat(tax) / 100 ) * baseAmount ).toFixed(2) .toString())

    this.taxAmount = strAmount 
  }
  else 
  {
    this.taxAmount = "0.00"
  }
    
}

automatic_surcharge () 
{
  let baseAmount = parseFloat (this.baseAmount)

  if (this.isOverChargedEnabled === true) 
  {
    let surcharge = this.storage.getSurcharge()

    let strAmount = this.formatNumber ( ( ( parseFloat(surcharge) / 100 ) * baseAmount ).toFixed(2) .toString())

    this.overChargedAmount = strAmount 
  }
  else 
  {
    this.overChargedAmount = "0.00"
  }
    
}


  calculateTip( num )
  {
    this.selected_tip = num 

    if (!this.baseAmount) 
    {
      this.baseAmount = "0"
    }

    if (this.baseAmount == "") 
    {
      this.baseAmount = "0"
    }
    
    let baseAmount = parseFloat (this.baseAmount)

    this.tipAmount = this.formatNumber ( ( baseAmount *  ( this.selected_tip / 100 )).toFixed(2)  )

    this.getTotal()
  }
  
  async goChoosePayment(amount)
  {

    var alert =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: '',
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


    if ( amount == null || isNaN(amount) ) 
    {
      alert.message = this.getTextMessage ("Transaction.AmountZero")
      alert.present()
      return 
    }

    if (amount == undefined || amount == "0" || amount == "0.00" || amount == "") 
    {
      alert.message = this.getTextMessage ("Transaction.AmountZero")
      alert.present()
      return 
    }


    if (this.trxId === "installment") 
    {
      let i_quota = parseInt  (this.quotas)

      if (i_quota >= 100) 
      {
        this.toastService.presentToast('Error', this.getTextMessage ("Transaction.ErrorGreater100"), 'top', 'danger', 2000);
        return 
      }

      if (i_quota <= 0) 
      {
        this.toastService.presentToast('Error', this.getTextMessage ("Transaction.Zero"), 'top', 'danger', 2000);
        return 
      }
    }

    this.router.navigate(
      ['/confirmorder'], 
      { 
        queryParams: { 
                        baseAmount  : this.baseAmount       , 
                        tipAmount   : this.tipAmount        ,
                        taxAmount   : this.taxAmount        ,
                        otherAmount : this.overChargedAmount,
                        totalAmount : this.totalAmount      , 
                        trxId       : this.trxId            , 
                        quota       : this.quotas 
                      } 
      }
      )

    //this.setNavigation(1,'confirmorder',this.baseAmount, this.tipAmount, this.taxAmount, this.totalAmount);
  }

 
  getTotal () 
  {
    
    if (!this.baseAmount) 
    {
      this.baseAmount = "0"
    }

    if (!this.tipAmount) 
    {
      this.tipAmount = "0"
    }

    if (!this.taxAmount) 
    {
      this.taxAmount = "0"
    }

    if (this.baseAmount == "") 
    {
      this.baseAmount = "0"
    }
    
    if (this.tipAmount == "") 
    {
      this.tipAmount = "0"
    }

    if (this.taxAmount == "") 
    {
      this.taxAmount = "0"
    }
    
    if (!this.overChargedAmount) 
    {
      this.overChargedAmount = "0"
    }

     let _baseAmount        = parseInt ( this.baseAmount.replace(',', '').replace('.', '') )

     let _tipAmount         = parseInt  ( this.tipAmount.replace(',', '').replace('.', '') )

     let _taxAmount         = parseInt  ( this.taxAmount.replace(',', '').replace('.', '') )

     let _overchargedAmount = parseInt  ( this.overChargedAmount.replace(',', '').replace('.', '') )

     let iTotalAmount = _baseAmount + _tipAmount + _taxAmount + _overchargedAmount

     this.totalAmount = this.formatNumber ( (iTotalAmount).toString() )

   }

  
  setNavigation (
                  param       : any     ,
                  url         : string  ,
                  _baseAmount  : any     ,   
                  _tipAmount   : any     , 
                  _taxAmount   : any     , 
                  _totalAmount : any
                )
  {

    let params: any = 
    {
      type        : param       ,
      baseAmount  : _baseAmount ,
      tipAmount   : _tipAmount  , 
      taxAmount   : _taxAmount  , 
      totalAmount : _totalAmount
    }
    
    this.navCtrl.navigateForward(url,{ state: params });
  }



     // Format expiry date
     onBaseAmountChange(event: any) 
     {
        let value = event.target.value

        let amountValue = this.formatNumber (value)
        
        if (amountValue) 
        {
          event.target.value = amountValue

          this.baseAmount =   amountValue
        }
     
        this.automatic_tax        ( );

        this.automatic_surcharge  ( );

        if (!this.selected_tip) 
        {
          this.selected_tip = 0
        }

        this.calculateTip ( this.selected_tip );

        this.getTotal() 
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
     
        this.getTotal() 
     }

      // Format expiry date
    onOverChargedAmountChange(event: any) 
    {
        let value = event.target.value

        let amountValue = this.formatNumber (value)
        
        if (amountValue) 
        {
          event.target.value = amountValue

          this.overChargedAmount =   amountValue
        }
    
        this.getTotal() 
    }


    onQuotaChange (event: any) 
    {
        let value = event.target.value

        let amountValue = this.formatNumber (value,  '.', 0, '0')
        
        if (amountValue) 
        {
          event.target.value = amountValue

          this.quotas =   amountValue
        }
    
    }


     /*
     getTotal () 
     {
       
        let _baseAmount = parseInt ( this.baseAmount.replace(',', '').replace('.', '') )

        let _tipAmount = parseInt  ( this.tipAmount.replace(',', '').replace('.', '') )

        let _taxAmount = parseInt  ( this.taxAmount.replace(',', '').replace('.', '') )

        let iTotalAmount = _baseAmount + _tipAmount + _taxAmount
  
        this.totalAmount = this.formatNumber ( (iTotalAmount / 100).toString() )

      }
      */


  formatNumber(e: any, separador: string = '.', decimais: number = 2, defaultZero: string = '0.00') 
  {
    if (e == "") 
    {
      return defaultZero
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

}
