import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/StorageService';
import { globalVars } from 'src/contantes';
import { ProSolution } from 'd135connector';
import { ToastService } from '../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  Username = ""

  constructor
      (
              private     navctrl             : NavController     , 
              private     router              : Router            , 
              private     route               : ActivatedRoute    , 
              private     storage             : StorageService    ,
              private     loadingController   : LoadingController , 
              private     toastService        : ToastService      , 
              public      alertController     : AlertController   , 
              private     _translate          : TranslateService  , 
              private     platform            : Platform    
      )
      {

      }

  
  selectedLanguage = "English"

  ngOnInit() 
  {

    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
    });
    
    
    this.route.queryParams
    .subscribe(params => 
    { 

      this.selectedLanguage = this.storage.getLanguage();
      
      let data = this.storage.getLoginData(); 

      if ( data ) 
      {
        globalVars.credential = JSON.parse ( data ); 

        this.Username = globalVars.credential.username
      }
      

    });

  }
  
  goEditProfile()
  {
    this.navctrl.navigateForward('editprofile');
  }

  goSettings()
  {
    this.navctrl.navigateForward('settings');
  }


  goReferral()
  {
    this.navctrl.navigateForward('referral');
  }

  goFAQ()
  {
    this.navctrl.navigateForward('faq');
  }

  async goTerminalSettting () 
  {
    await this.router.navigate(['/terminalconfig']);
  }
  
  async downloadFile () 
  {

    console.log ("downloadFile")
    let deviceName = this.storage.getSelectedDevice() 

    let options = {"d135_name": deviceName}

    // Proceed with loading overlay
    const loading = await this.loadingController.create({
      cssClass: 'default-loading',
      message: '<p>Downloading Files to ' + deviceName.split("|")[0],
      spinner: 'crescent'
    });

    await loading.present();

    ProSolution.connect (  options ).then (
      data => 
      {
        if (data.value == 0 || data.value == 1001)
        {
            loading.message = "Downloading EMV File"; 

            ProSolution.downloadEmvFile( options ).then( 
            
              data => 
              {
                loading.dismiss();

                // Display success message and go back
                this.toastService.presentToast('Success', 'File Downloaded', 'top', 'success', 2000);
              }, 
              err => 
              {
                loading.dismiss();
              }
          );
        }
      }, 
      err => 
      {
        loading.dismiss();
      }
    );
  } 

  async goDevicesSetting () 
  {
    this.router.navigate(['/bluetooth']);
  }

  async goLogOut() 
  {
    this.router.navigate(['/signin']);
  }

  async changeLanguage()
  {

    this.selectedLanguage = this.storage.getLanguage();

    this.alertController.create({
      header: 'Select Language',
     
      inputs: [
        {
          label   : 'English' ,
          type    : 'radio'   ,
          value   : 'English' ,
          checked : this.selectedLanguage === 'English'
        },
        {
          label   : 'Spanish' ,
          type    : 'radio'   ,
          value   : 'Spanish' , 
          checked : this.selectedLanguage === 'Spanish'
        }
     
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => 
          {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Save',
          handler: (data: any) => 
          {
            console.log('Saved Information', data);

            this.selectedLanguage = data
           
            this.storage.setLanguage ( this.selectedLanguage )

            this._translateLanguage   ()
          }
        }
      ]
    }).then(res => 
      {
      res.present();
    });
  }


  _translateLanguage(): void 
  {
    let language = 'en'; 

    if (this.selectedLanguage === 'Spanish') 
    {
      language = 'es'; 
    }
    else 
    {
      language = 'en'; 
    }

    this._translate.use(language);

  }

  ionViewWillEnter () 
  {
    console.log ("ionWillViewEnter")
  }

  ionViewDidEnter () 
  {
    console.log ("ionViewDidEnter")
  }

  ionViewWillLeave () 
  {
    console.log ("ionViewWillLeave")
  }

  ionViewDidLeave () 
  {
    console.log ("ionViewDidLeave")
  }

  ngOnDestroy () 
  {
    console.log ("ionViewDidLeave")
  }
}
