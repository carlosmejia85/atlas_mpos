import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-setupfaceid',
  templateUrl: './setupfaceid.page.html',
  styleUrls: ['./setupfaceid.page.scss'],
})
export class SetupfaceidPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goFingerPrint()
  {
    this.navCtrl.navigateForward('setupfingerprint');
  }

}
