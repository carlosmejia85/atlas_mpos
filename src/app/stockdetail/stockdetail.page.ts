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
  ApexStates,
} from 'ng-apexcharts';

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
  states: ApexStates;
};
@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.page.html',
  styleUrls: ['./stockdetail.page.scss'],
})
export class StockdetailPage implements OnInit {
  isup: any = 'up';
  chartOptions: Partial<ChartOptions>;
  ShowCharts: boolean;
  activeData: any;
  data1 = [2, 4, 8, 5, 3, 2, 9];
  data2 = [12, 20, 30, 24, 35, 28, 36];
  data3 = [80, 120, 150, 260, 200, 220, 180];
  data4 = [300, 200, 800, 600, 300, 850, 710];
  data5 = [1000, 1300, 1800, 1100, 2500, 1900, 2000];
  timerange: any = '1W';

  constructor() {}

  ngOnInit() {
    this.activeData = this.data3;
    console.log(this.activeData);
    let i = 0;

    this.chartOptions = {
      stroke: {
        curve: 'smooth',
        lineCap: 'round',
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#33D49E'],
      series: [
        {
          name: '',
          data: this.activeData,
        },
      ],
      plotOptions: {
        bar: {
          borderRadius: 15,
        },
      },
     
      chart: {
        toolbar: {
          show: false,
        },

        height: 350,
        type: 'area',
      },
      title: {},
      yaxis: {
        labels: {
          formatter: (value) => {
            return '$' + '  ' + value;
          },
        },
      },
      xaxis: {
        categories: ['Mo', 'Tu', 'We', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    };
  
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

    ionViewWillEnter()
  {
    this.ShowCharts = true;
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
   
    chart: {
      toolbar: {
        show: false,
      },
      
      height: 350,
      type: 'area',
      
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
}
