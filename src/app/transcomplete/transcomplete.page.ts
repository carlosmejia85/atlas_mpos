import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transcomplete',
  templateUrl: './transcomplete.page.html',
  styleUrls: ['./transcomplete.page.scss'],
})
export class TranscompletePage implements OnInit {

  base  : ""  
  tip   : ""  
  tax   : ""    
  total : ""


  constructor
  (
    private navCtrl       : NavController   , 
    private router        : Router          , 
    private route         : ActivatedRoute          
  ) 
  { 

  }

  ngOnInit() 
  {
    this.route.queryParams
    .subscribe(params => 
    { 
        this.base   = params.baseAmount   ;
        this.tip    = params.tipAmount    ;
        this.tax    = params.taxAmount    ;
        this.total  = params.totalAmount  ;
  });

  }

  goHome()
  {
    this.navCtrl.navigateRoot('tabs/tab1');
  }

}
