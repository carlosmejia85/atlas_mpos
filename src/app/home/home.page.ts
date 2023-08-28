import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProSolution } from 'd135connector';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ToastService } from '../services/toast.service';
import { StorageService } from '../services/StorageService';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { LoadingController, Platform }  from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { globalVars } from 'src/contantes';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sampleData:any;
  ShowCharts:boolean;
  @ViewChild('swiper') swiper: SwiperComponent;
  
  
    
    public SwiperConfig: SwiperOptions = {
      speed:1000,
      pagination:false,
      slidesPerView:1.8
    }


  titles:any[];

  saleAmount    = "0.00"
  voidAmount    = "0.00"
  voidPercentage= "0"
  salePercentage= "0"

  transactions : any = []

  transactionName = "" 

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


    constructor(
      private     router                  : Router            , 
      private     route                   : ActivatedRoute    , 
      private     toastService            : ToastService      ,
      private     storage                 : StorageService    ,
      private     bluetooth_le            : BluetoothLE       , 
      private     loadingController       : LoadingController , 
      private     translateConfigService  : TranslateConfigService  , 
      private     platform                : Platform                 
    ) { }
  

  getDemoData () {
    
    this.transactions = [] 
    
    this.transactions.push (
      {
        id              : 1                       ,
        total_amount    : 100.00                  ,
        base_amount     : 100.00                  ,
        tip_amount      : 0                       ,
        tax_amount      : 0                       ,
        rrn             : '123456789012'          ,
        card            : "4523 **** **** 2200 "  ,
        voided          : false                   ,
        settled         : false                   ,
        note            : "Coffee"                ,
        stan            : "209988"                ,
        auth            : "109543"                ,
        trx_date        : "April 1, 2023"         ,
        trx_time        : "14:54:12"              ,
        trx_date_number : '01/04/2023'            ,
        trx_date_string : "April 1, 2023 14:54:12", 
        response_code   : '00'                    , 
        signature       : ''                      ,   
        entryMode       : '052'                   ,
        toEmail         : ''                      ,
        trxId           : 'sale'                  , 
        quotas          : 0
    }
     )
  

     this.storage.setTransactions ( this.transactions )
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


    ngOnInit() 
    {      

      const eventListener =  (ProSolution as any).addListener('bluetooth_state_changed', (eventData: any) => this.bluetooth_state_changed(eventData) );
    

      let priority = 9999

      this.platform.backButton.subscribeWithPriority(priority, () => {
        // do on back button click
      });

      this.route.queryParams
      .subscribe(params => 
      { 
  
        this.getTransalationMessages() 

        this.sampleData = [
          {
            id:1,
            tradename:'APPL',
            tradeprecentage:'70%'
          },
    
          {
            id:1,
            tradename:'APPL',
            tradeprecentage:'70%'
          },
    
          {
            id:1,
            tradename:'APPL',
            tradeprecentage:'70%'
          }
        ]
    
         if(this.swiper)
          {
            this.swiper.updateSwiper({})
            this.swiper.swiperRef.allowTouchMove = false;
            
          }
  
  
        this.titles = 
        [
          {
            id:1,
            cardbg:'#E8F1FF',
            topicimg:'assets/imgs/gs.svg',
            fulltopic: this.getTextMessage ('FAQ.Title1'),
            title: this.getTextMessage ('FAQ.SubTitle1'),
          },
          {
            id:3,
            cardbg:'#F1FFFA',
            topicimg:'assets/imgs/hi.svg',
            fulltopic:this.getTextMessage ('FAQ.Title2'),
            title: this.getTextMessage ('FAQ.SubTitle1'),
          },
          {
            id:2,
            cardbg:'#FFEFEB',
            topicimg:'assets/imgs/payment.svg',
            fulltopic:this.getTextMessage ('FAQ.Title3'), 
            title: this.getTextMessage ('FAQ.SubTitle1')
          }
        ]

        let options = 
        { 
          "value"    : "Create Database"
        
        } ; 

        ProSolution.echo ( options ).then (
          (data: any)  => 
          {
        
          }, 
          err => 
          {
            
          }
        );

        this.setUpLanguage              (                                 );
        
        this.bluetooth_le.initialize    (                                 ); 
       
        ProSolution.enableBluetooth     (                                 ); 

        this.GetSelectedDevice          (                                 ); 

      
       /*
        this.transactions = JSON.parse  ( this.storage.getTransactions()  )

        if (!this.transactions)
        {
         
         this.transactions = []
        }
*/

        let username = this.getUsername (           );

        this.getTransactionsData        ( username  ) 

        this.getTotal_Batch             ( username  );

        //this.getDemoData              (           ) 

      });

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


    ionViewWillEnter()
    {
      this.ShowCharts = true;
    }
    ionViewDidLeave() {
      this.ShowCharts = false;
     
  }

  ngOnDestroy()	
  {
    console.log("destroyed");
  }
    


  bluetooth_state_changed (eventData) 
  {

    console.log ("--------------------- bluetooth state changed ---------------------")
    
    setTimeout(() => 
    {

      console.log (eventData)

      if (eventData.value == 0) // || eventData.value == 101) 
      {
        this.toastService.presentToast('Success', 'Connected to ' + eventData.name, 'top', 'success', 2000);

        this.storage.setSelectedDevice ( eventData.name + "|" + eventData.address)

        if (eventData.downloadFile) 
        {
          if (eventData.downloadFile == "1") 
          {
            this.downloadFile ();
          } 
        }
      }
      else 
      {
        this.toastService.presentToast('Error', 'Error connecting to device.', 'top', 'danger', 2000);
      }
     
      //this.toastService.presentToast('Success', 'Connected to ' + deviceName.split("|")[0], 'top', 'success', 2000);
      

    }, 3000);
    
  }

  async   GetSelectedDevice (   ) 
  {
      let deviceName = this.storage.getSelectedDevice(); 

      if (deviceName) 
      {
        let options = {"d135_name": deviceName}

        ProSolution.connect (  options ).then (
          data => 
          {
            console.log (deviceName + " data.value = " + data.value); 

            console.log ( data );

            if (data.value == 0 ) //|| data.value == 1001)
            {
               // Display success message and go back
               this.toastService.presentToast('Success', 'Connected to ' + deviceName.split("|")[0], 'top', 'success', 2000);
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
            console.log (deviceName + " data.value = " + data.value); 

            console.log ( data );

            if (data.value == 0 ) //|| data.value == 1001)
            {
               // Display success message and go back
               this.toastService.presentToast('Success', 'Connected to ' + deviceName.split("|")[0], 'top', 'success', 2000);
            }
          });
          
      }
  }

  async   downloadFile      (   ) 
  {

    console.log ("downloadFile")
    let deviceName = this.storage.getSelectedDevice() 

    let options = {"d135_name": deviceName}

    // Proceed with loading overlay
    const loading = await this.loadingController.create({
      cssClass: 'default-loading',
      message: '<p>Downloading Files to ' + deviceName.split("|")[0],
      spinner: 'crescent'
    });

    await loading.present();

    ProSolution.connect (  options ).then (
      data => 
      {
        if (data.value == 0 || data.value == 1001)
        {
            loading.message = "Downloading EMV File"; 

            ProSolution.downloadEmvFile( options ).then( 
            
              data => 
              {
                loading.dismiss();

                // Display success message and go back
                this.toastService.presentToast('Success', 'File Downloaded', 'top', 'success', 2000);
              }, 
              err => 
              {
                loading.dismiss();
              }
          );
        }
      }, 
      err => 
      {
        loading.dismiss();
      }
    );
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
  // name       : getTotal_Batch
  // description: Sum of all total transaction 
  // in the batch 
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  getTotal_Batch ( username ) 
  {

    this.saleAmount = "0.00"
    this.voidAmount = "0.00"

    let lBatch_total        = 0
    let lBatch_voided_total = 0

    let sale_count = 0; 
    let void_count = 0;

    if (!this.transactions) 
    {
        return
    }

    let length = this.transactions.length;
    
    for (let i =0 ; i < length; i++) 
    {
    
    
      if ( this.transactions[i].settled == true) 
      {
        continue;
      }

      if ( ! (this.transactions[i].username == username) ) 
      {
        continue;
      }

      if (this.transactions[i].voided == true)
      {
        void_count += 1;
        lBatch_voided_total += parseFloat(this.transactions[i].total_amount)
      }
      else 
      {
        sale_count += 1;
        lBatch_total += parseFloat(this.transactions[i].total_amount)
      }
       

      let totalTrans = this.transactions.length

      let tempSalePercentage = ((100 * sale_count) / totalTrans)

      this.voidPercentage = (100 - tempSalePercentage).toFixed(2)
      this.salePercentage = tempSalePercentage        .toFixed(2)

      this.saleAmount = lBatch_total        .toFixed(2)
      this.voidAmount = lBatch_voided_total .toFixed(2)

    }

  }
  

  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }


  viewAll() 
  {
    this.router.navigate(['/status']);
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

    return this.transactionName
  } 

}
