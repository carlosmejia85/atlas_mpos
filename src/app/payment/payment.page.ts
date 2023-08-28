import { SelectpaymentmodalPage } from './../modals/selectpaymentmodal/selectpaymentmodal.page';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  stock:any;
  amount:any = 0;
  methods:any[] = [
    {
      id:1,
      icon:'assets/imgs/dbcard.svg',
      methodname:'Debit Card',
      desc:'Invest small amounts',
      value:'debit',
    },
    {
      id:2,
      icon:'assets/imgs/bt.svg',
      methodname:'Bank Transfer',
      desc:'Invest big amounts',
      value:'bt',
    },
    {
      id:3,
      icon:'assets/imgs/apay.svg',
      methodname:'Apple Pay',
      desc:'Connect your Apple Pay',
      value:'apay',
    },
    {
      id:4,
      icon:'assets/imgs/pp.svg',
      methodname:'Paypal',
      desc:'Connect your PayPal account',
      value:'pp',
    }

  ]
  selectedmethod:any = '';
  constructor(private navCtrl: NavController,private router: Router,private modalController: ModalController) { }

  ngOnInit() 
  {
    if (this.router.getCurrentNavigation().extras.state) 
    {
      const params = this.router.getCurrentNavigation().extras.state;
      this.stock = params.type;
      this.amount = params.amount;
      console.log(this.amount);
    }

  }


  async presentModal() {
    const modal = await this.modalController.create({
    component: SelectpaymentmodalPage,
    componentProps: { value: 123 }
    });

    modal.onDidDismiss()
    .then((data:any) => {
      this.selectedmethod = data.data.selectmethod;
      console.log(this.selectedmethod);

  });
  
    await modal.present();
  
  
  }

  goConfirmOrder()
  {
    this.navCtrl.navigateForward('confirmorder');
  }
 

}
