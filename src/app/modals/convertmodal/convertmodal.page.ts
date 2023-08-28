import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-convertmodal',
  templateUrl: './convertmodal.page.html',
  styleUrls: ['./convertmodal.page.scss'],
})
export class ConvertmodalPage implements OnInit {

  filterTerm: string;
  fromCurrency:any='twitter';
  toCurrency:any='google';
  currencies:any;
  fromImg:any;
  toImg:any;

  method:any = 'from';

  

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.currencies = [
      {
        "id": 1,
        "name": "TWTR",
        "fullname": "Twitter",
        icon: "assets/imgs/twitter.svg",
        value:"twitter",
        status:'twitter'
      },
    
      {
        "id": 2,
        "name": "GGLE",
        "fullname": "Google",
        icon: "assets/imgs/google.svg",
        value:"google",
        status:'google'
      },
    
      {
        "id": 3,
        "name": "SPTFY",
        "fullname": "Spotify",
        icon: "assets/imgs/spotify.svg",
        value:"spotify",
        status:'spotify'
      },
      {
        "id": 4,
        "name": "MS",
        "fullname": "Microsoft",
        icon: "assets/imgs/microsoft.svg",
        value:"mircosoft",
        status:'mircosoft'
      },
    
      {
        "id": 5,
        "name": "TSL",
        "fullname": "Tesla",
        icon: "assets/imgs/tesla.svg",
        value:"tesla",
        status:'tesla'
      },
    ]

    console.log('from currency is'+this.fromCurrency);
    console.log('to currency is'+this.toCurrency);

    
  }



  segmentChanged(ev)
  {
    this.method = ev.detail.value;
    console.log(this.method);
  }



  setFromCurency(ev)
  {
    this.fromCurrency = ev.detail.value;
    console.log('from currency is'+this.fromCurrency);
  }

  setToCurency(ev)
  {
    this.toCurrency = ev.detail.value;
    console.log('to currency is'+this.toCurrency);
  }

  close()
  {
    let data = {fromcurrency:this.fromCurrency,tocurrency:this.toCurrency}
    console.log(data);
    this.modalCtrl.dismiss(data);
  }

  

}
