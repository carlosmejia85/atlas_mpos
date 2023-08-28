import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-setupfingerprint',
  templateUrl: './setupfingerprint.page.html',
  styleUrls: ['./setupfingerprint.page.scss'],
})
export class SetupfingerprintPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  setUpPin()
  {
    this.navCtrl.navigateRoot('tabs');
  }

}
