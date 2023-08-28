import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selectpaymentmodal',
  templateUrl: './selectpaymentmodal.page.html',
  styleUrls: ['./selectpaymentmodal.page.scss'],
})
export class SelectpaymentmodalPage implements OnInit {
  Paymethod:any = 'debit';

  methods:any[];
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.methods = [
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
  }

  setMethod(ev)
  {
    this.Paymethod = ev.detail.value;

    console.log(this.Paymethod);
  }

  close(method)
  {
    let data = {selectmethod:method}
    this.modalController.dismiss(data);
    console.log(method);
  }
}
