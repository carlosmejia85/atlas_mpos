import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { LoadingController } from '@ionic/angular';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexDataLabels,
  ApexFill,
} from 'ng-apexcharts';
import { StorageService } from 'src/app/services/StorageService';
import { ToastService } from 'src/app/services/toast.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

export type ChartOptions = {
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;

  fill: ApexFill;
};

@Component({
  selector: 'chartcard',
  templateUrl: './chartcard.component.html',
  styleUrls: ['./chartcard.component.scss'],
})
export class ChartcardComponent implements OnInit {
  @Input() mainAmount: string;
  @Input() imgPath: string;
  @Input() precentAmount: string;
  @Input() isup: any;
  @Input() comShortName: string;
  @Input() comName: string;
  chartColor: string;

  @Input() data:
    | (number | null)[]
    | {
        x: any;
        y: any;
      }[]
    | [number, number | null][]
    | [number, (number | null)[]][];
  chartOptions: Partial<ChartOptions>;



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

    this.setChartColor();
    this.chartOptions = {
      stroke: {
        colors: [this.chartColor],
        curve: 'smooth',
        lineCap: 'square',
        width: 2,
      },
      fill: {
        colors: [this.chartColor],
      },
      dataLabels: {
        enabled: false,
      },
      series: [
        {
          name: 'My-series',
          data: this.data,
        },
      ],
      grid: {
        show: false,
      },
      chart: {
        toolbar: {
          show: false,
        },
        height: 80,
        type: 'area',
      },
      title: {},
      yaxis: {
        labels: {
          show: false,
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: [
          // 'Jan',
          // 'Feb',
          // 'Mar',
          // 'Apr',
          // 'May',
          // 'Jun',
          // 'Jul',
          // 'Aug',
          // 'Sep',
        ],
      },
    };

    let i = 0;
    setInterval(() => {
      i++;
      if (i > 8) {
        i = 0;
      }

      this.chartOptions.series[0].data[i] = Math.round(
        (Math.random() * 100) % 100
      );
      this.chartOptions.series = [...this.chartOptions.series];
    }, 500);
  }

  ngOnDestroy() {
    console.log('destroyed');
  }

  setChartColor()
  {
    if(this.isup == 'up')
    {
      this.chartColor = "#33D49E";
    }

    if(this.isup == 'down')
    {
      this.chartColor = "#FF6740";
    }
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
