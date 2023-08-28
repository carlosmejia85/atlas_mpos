import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  Categories:string ='history';
  currencies:any;
  currenciesList:any;
  ShowCharts:boolean;
  
  constructor(
    private modalController: ModalController,
    private navCtrl: NavController, 

    private     route               : ActivatedRoute    , 
    private     toastService        : ToastService      ,
    private     storage             : StorageService    ,
    
    private     loadingController       : LoadingController , 
    private     translateConfigService  : TranslateConfigService , 
    private     platform                : Platform      ) 
    { }

  transactions : any =  []

  ngOnInit() 
  {


    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
    });

    this.route.queryParams
      .subscribe(params => 
      {  

        this.setUpLanguage () ;
        
        this.transactions = JSON.parse  ( this.storage.getTransactions()  )

        if (!this.transactions)
        {
          this.transactions = []
        }
    
      });
  }


  ionViewWillEnter()
  {
    this.ShowCharts = true;
    
  }
  ionViewDidLeave() {
    this.ShowCharts = false;
   
}

setUpLanguage                 (                   ) 
{
  let selectedLanguage = this.storage.getSelectedLanguage();

  this.translateConfigService.setLanguage(selectedLanguage);
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

  segmentChanged(ev)
  {
    this.Categories = ev.detail.value
    console.log(this.Categories);
  }

}
