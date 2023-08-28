import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ConvertmodalPage } from '../convertmodal/convertmodal.page';
import { SuccessmodalPage } from '../successmodal/successmodal.page';

@Component({
  selector: 'app-exchangemodal',
  templateUrl: './exchangemodal.page.html',
  styleUrls: ['./exchangemodal.page.scss'],
})
export class ExchangemodalPage implements OnInit {
  fromCurrency:any;
  toCurrency:any;
  currencies:any;
  currenciesList:any;
  isConverted:any;
  Category:any = 'buy';
  ShowCharts:boolean;

  @ViewChild('position') HoldPosition: ElementRef;
  constructor(private modalController: ModalController,private navCtrl: NavController) { 
   
  }

  ngOnInit() {
    this.fromCurrency = 'twitter';
    this.toCurrency = 'google';

    this.currencies = [
      {
        "id": 1,
        "name": "TWTR",
        "fullname": "Twitter",
        icon: "assets/imgs/twitter.svg",
        value:"twitter",
        amount:"156.56",
        status:'twitter'
      },
    
      {
        "id": 2,
        "name": "GOOGL",
        "fullname": "Google Cop",
        icon: "assets/imgs/google.svg",
        value:"google",
        amount:"156.56",
        status:'twitter'
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
    this.currenciesList = [
      {
        id: 1,
        name: "TWTR",
        fullname: "Twitter",
        icon: "assets/imgs/twitter.svg",
        value:"twitter",
        amount:"250.56",
        status:'down'
      },
    
      {
        id: 2,
        name: "GOOGL",
        fullname: "Google Cop",
        icon: "assets/imgs/google.svg",
        value:"google",
        amount:"2000.85",
        status:'up'
      },

      {
        id: 3,
        name: "SPTFY",
        fullname: "Spotify",
        icon: "assets/imgs/spotify.svg",
        value:"spotify",
        amount:"45.12",
        status:'up'
      },
    
      {
        id: 4,
        name: "MS",
        fullname: "Microsoft",
        icon: "assets/imgs/microsoft.svg",
        value:"mircosoft",
        amount:"5684.00",
        status:'down'
      },
    
      {
        id: 5,
        name: "TSL",
        fullname: "Tesla",
        icon: "assets/imgs/tesla.svg",
        value:"tesla",
        amount:"1250.58",
        status:'up'
      },
    ]
  
  }

  ionViewWillEnter()
  {
    this.ShowCharts = true;
    
  }
  ionViewDidLeave() {
    this.ShowCharts = false;
   
}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ConvertmodalPage,
      cssClass: 'convertmdoal',
      mode:'ios',
      swipeToClose:true,
      presentingElement: await this.modalController.getTop()
    });

    modal.onDidDismiss()
    .then((data:any) => {
      console.log(data.data.fromcurrency);
      console.log(data.data.tocurrency);
      this.fromCurrency = data.data.fromcurrency;
      this.toCurrency = data.data.tocurrency;
  });
    
    return await modal.present();
  }

  convert()
  {
      this.isConverted = "rotateanimation";
     setTimeout(() => {
     
      this.showSuccessModal();
      this.close();
      
     }, 2000);
  }

  async showSuccessModal() {
    const modal = await this.modalController.create({
    component: SuccessmodalPage,
    });
  
    await modal.present();
  
  }

  close()
  {
    this.modalController.dismiss();
  }

  segmentChanged(ev)
  {
    this.Category = ev.detail.value;
    console.log(this.Category);
  }


  goBuy(selectedstock:any)
  {
 
    
    this.modalController.dismiss().then(()=>{
     this.setNavigation(selectedstock,'buystock')


    })
  }
  
  setNavigation(param:any,url:string)
  {

    let params: any = {
      type: param,
    }
    
    this.navCtrl.navigateForward(url,{ state: params });
  }
}
