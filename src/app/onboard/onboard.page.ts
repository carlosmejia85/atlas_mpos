import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import SwiperCore, { Pagination, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Pagination]);
@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {
  private slides: any;
  activeIndex:any = 0;

  @ViewChild('swiper') swiper: SwiperComponent;

  public SwiperConfig: SwiperOptions = {
    speed:1000,
    pagination:true
  }
  constructor(private navCtrl: NavController) {

    
  }

 ngOnInit() {
   if(this.swiper)
   {
     this.swiper.updateSwiper({})
     this.swiper.swiperRef.allowTouchMove = false;
     
   }
 }

 ngAfterContentChecked() {
   if(this.swiper)
    {
    this.swiper.updateSwiper({})
    this.swiper.swiperRef.allowTouchMove = false;
    }
 
 }

 next()
 {
   this.swiper.swiperRef.slideNext(800);
 }

 onSlideChange(event) {
   
   this.activeIndex = this.swiper.swiperRef.activeIndex;

 }

 goSignIn()
 {
   this.navCtrl.navigateForward('signin');
 }

 goSignUp()
 {
   this.navCtrl.navigateForward('signup');
 }

}
