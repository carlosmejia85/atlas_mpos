import { ActionSheetController, AlertController, IonRouterOutlet, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStates
} from 'ng-apexcharts';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { ProSolution } from 'd135connector';
import { globalVars } from 'src/contantes';

export type ChartOptions = {
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  colors: string[];
  states:ApexStates;
};

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  chartOptions: Partial<ChartOptions>;
  ShowCharts:boolean;
  activeData:any;
  data1 = [2, 4, 8, 5, 3, 2, 9]
  data2 = [12, 20, 30, 24, 35, 28, 36]
  data3 = [80, 120, 150, 260, 200, 220, 180]
  data4 = [300, 200, 800, 600, 300, 850, 710]
  data5 = [1000, 1300, 1800, 1100, 2500, 1900, 2000]
  timerange:any = '1W';

  navCtrl: any;
  sale_count: number;
  void_count: number;
  saleTotalAmount: any;
  voidTotalAmount: any;


  constructor (
    private     modalController           : ModalController         , 
    private     routerOutlet              : IonRouterOutlet         , 
    private     router                    : Router                  , 
    private     route                     : ActivatedRoute          , 
    private     storage                   : StorageService          ,
    private     translateConfigService    : TranslateConfigService  ,
    private     actionSheetController     : ActionSheetController   , 
    private     loadingController         : LoadingController       , 
    private     toastService              : ToastService            , 
    private     alertController           : AlertController         ,  
    private     platform                  : Platform           
  ) 
{


}
  saleAmount    = "0.00"
  voidAmount    = "0.00"

  transactions : any = []

  ngOnInit() 
  {


    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
    });
    
    this.route.queryParams
    .subscribe(params => 
    { 

  
      this.setUpLanguage            (                   )

      this.getTransalationMessages  (                   )
/*

      this.activeData = this.data3;
      console.log(this.activeData);
      let i=0;

      this.chartOptions = {
        stroke: {
          curve: 'smooth',
          lineCap: "round"
        },
        dataLabels: {
          enabled: false
        },
        colors:["#33D49E"],
        series: [
          {
            name: '',
            data: this.activeData,
          },
        ],
        plotOptions: {
          bar: {
            borderRadius: 15
          }
        },
        states:{
          normal:{
            filter:{
              type: 'lighten',
              value: 0.2,
            }
          },
          active:{
            filter:{
              type: 'darken',
              value: 0.99,
            }
          }
        },
        chart: {
          toolbar: {
            show: false,
          },
          
          height: 350,
          type: 'bar',
          
        },
        title: {
          
        
        },
        yaxis: {
          labels:{
            formatter: (value) => { return  '$'+ '  ' +value },
          }
        },
        xaxis: {
          categories: [
            'Mo',
            'Tu',
            'We',
            'Thu',
            'Fri',
            'Sat',
            'Sun',
          ],
        },
      };
*/

      this.transactions = JSON.parse  ( this.storage.getTransactions()  )

      if (!this.transactions)
      {
        this.transactions = []
      }

      let username = this.getUsername () ;

      this.getTotal_Batch             (              username                   );

    });
    // setInterval(() => {
      
    //   i++;
    //   if(i>6)
    //   {
    //     i=0;
    //   }
      
     
    //   this.chartOptions.series[0].data[i] = Math.round(
    //     (Math.random() * 100) % 100
    //   );
    //   this.chartOptions.series = [...this.chartOptions.series];
    // }, 500);
  }

  ionViewWillEnter()
  {
    this.ShowCharts = false;
  }
  

  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }

  changeChart(ev)
  {
    this.timerange = ev.detail.value;
    console.log(this.timerange);
   
  
    if(this.timerange == '12H')
    {
      this.activeData = this.data1;
    }
    if(this.timerange == '1D')
    {
      this.activeData = this.data2;
    }
    if(this.timerange == '1W')
    {
      this.activeData = this.data3;
    }
    if(this.timerange == '1M')
    {
      this.activeData = this.data4;
    }

    if(this.timerange == '1Y')
    {
      this.activeData = this.data5;
    }

    this.regen();


  }

 regen()
 {
  this.chartOptions = {
    stroke: {
      curve: 'smooth',
      lineCap: "round"
    },
    dataLabels: {
      enabled: false
    },
    colors:["#33D49E"],
    series: [
      {
        name: '',
        data: this.activeData,
      },
    ],
    plotOptions: {
      bar: {
        borderRadius: 15
      }
    },
    states:{
      normal:{
        filter:{
          type: 'lighten',
          value: 0.2,
        }
      },
      active:{
        filter:{
          type: 'darken',
          value: 0.99,
        }
      }
    },
    chart: {
      toolbar: {
        show: false,
      },
      
      height: 350,
      type: 'bar',
      
    },
    title: {
      
     
    },
    yaxis: {
      labels:{
        formatter: (value) => { return  '$'+ '  ' +value },
      }
    },
    xaxis: {
      categories: [
        'Mo',
        'Tu',
        'We',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ],
    },
  };
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
     "Transaction.BatchEmpty"               ,
     "Transaction.AskSettle"              , 
     "TransactionView.Settled"
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
     ""
   ]
 ]

async getTransalationMessages (                   ) 
{
 this.translateConfigService.getText (this.messages[0]).subscribe(
   (values) => 
   {
     this.messages[1] = Object.keys(values).map(key => values[key]);
   }
 );
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

  

 goDetails()
 {
  this.navCtrl.navigateForward('stockdetail');
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

    let lBatch_total        = 0
    let lBatch_voided_total = 0

    let sale_count = 0; 
    let void_count = 0;

    this.saleAmount    = "0.00"
    this.voidAmount    = "0.00"

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
      
      this.saleAmount = lBatch_total.toFixed(2)
      this.voidAmount = lBatch_voided_total.toFixed(2)

      this.sale_count = sale_count
      this.void_count = void_count

      this.saleTotalAmount = this.saleAmount
      this.voidTotalAmount = this.voidAmount

    }

  }
  

  set_Batch_Closed () 
  {

    if (!this.transactions) 
    {
        return
    }

    let length = this.transactions.length;
    
    for (let i =0 ; i < length; i++) 
    {
      this.transactions[i].settled = true;
    }

    this.storage.setTransactions ( this.transactions )

  }

  async askSettlement () 
  {

    var alertError =  await this.alertController.create(
      {
      subHeader: 'Information',
      message: this.getTextMessage ("Transaction.AskSettle"),
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => 
          {
            this.sendSettlement()
          }
        }
      ]
      }
    );

    alertError.present()

  }
  
  async sendSettlement () 
  {


    // Proceed with loading overlay
    const loading = await this.loadingController.create({
      cssClass: 'default-loading',
      message: this.getTextMessage("Transaction.ProcessingSettlement"),
      spinner: 'crescent', 
      duration: 30000
    });

    await loading.present();

    this.transactions = JSON.parse  ( this.storage.getTransactions()  )

    if (!this.transactions)
    {
      this.transactions = []
    }

    let username = this.getUsername () 

    this.getTotal_Batch ( username )

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

          if (data.success === true ) 
          {
            //this.storage.setTransactions ( [] )

            this.set_Batch_Closed ();

            this.router.navigate(['/tabs'] ); 
          }
         
      }, 
      err => 
      {
        alertError.present()
      }
    )
  }




}
