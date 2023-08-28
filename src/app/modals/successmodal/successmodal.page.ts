import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-successmodal',
  templateUrl: './successmodal.page.html',
  styleUrls: ['./successmodal.page.scss'],
})
export class SuccessmodalPage implements OnInit {

  constructor(private modalController: ModalController,private navCtrl: NavController) { }

  ngOnInit() {
    setTimeout(() => {
      this.close();
  
    }, 3000);
  }

  close()
  {
    this.modalController.dismiss()
  }

}
