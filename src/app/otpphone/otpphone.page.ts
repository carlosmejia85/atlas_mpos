import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-otpphone',
  templateUrl: './otpphone.page.html',
  styleUrls: ['./otpphone.page.scss'],
})
export class OtpphonePage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goOTPVerify()
  {
    this.navCtrl.navigateForward('otpverify')
  }

}
