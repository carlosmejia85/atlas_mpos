import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, Platform, isPlatform } from '@ionic/angular';
import { SuccessmodalPage } from '../modals/successmodal/successmodal.page';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { globalVars } from 'src/contantes';
import { HttpService } from '../services/HttpService';

@Component({
  selector: 'app-passrecovery',
  templateUrl: './passrecovery.page.html',
  styleUrls: ['./passrecovery.page.scss'],
})
export class PassrecoveryPage implements OnInit {

  Categories: any = 'email';

  inputBg1:any = 'transparentBg';
  inputBg2:any = 'transparentBg';
  inputBg3:any = 'transparentBg';
  inputBg4:any = 'transparentBg';
  otp11:any = "";
  otp22:any = "";
  otp33:any = "";
  otp44:any = "";
  isAllfilled:boolean = true;
  showSection1: boolean = true;
  showSection2: boolean = false;

  constructor(
    private     navCtrl                 : NavController     ,
    private     loadingController       : LoadingController ,
    private     toastService            : ToastService      ,
    private     router                  : Router            , 
    private     route                   : ActivatedRoute    , 
    public      httpService             : HttpService       ,
    public      platform                : Platform          ,
    public      alertController         : AlertController   , 
    private     storage                 : StorageService    , 
    private     translateConfigService  : TranslateConfigService     
  ) 
  {

  }

  ConfirmPassword     = ""
  Password            = ""
  Email               = ""
  emailError          = false

  ptype :any          = 'password';


  public messages : string[][] = 
  [ 
    [ "SignIn.Messages.Information"           , 
      "SignIn.Messages.BadCredentials"        , 
      "SignIn.Messages.EmailPasswordRequired" , 
      "SignIn.Messages.Authenticating"        , 
      "SignIn.Messages.BiometricFailed"       , 
      "SignUp.PasswordNoMatch"                , 
      "SignUp.MustSelectAgreement"            ,    
      "SignUp.SendingRequest"                 ,
      "ErrorCreatingAccount"                  , 
      "PasswordRecovery.ErrorResetAccount"               
    ], 
    [
      "",
      "", 
      "",
      "", 
      "", 
      "", 
      "", 
      "",
      ""
    ], 
  
  ]

  ngOnInit() 
  {

    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
    });

    this.route.queryParams
    .subscribe(params => 
    { 
      this.setUpLanguage            ( )
      
      this.getTransalationMessages  ( )
    });
  }




 //--------------------------------------
  // Language
  //--------------------------------------
  getTextMessage                ( key               ) 
  {

    let tmpIndex = -1; 
    let found = this.messages[0].find((element, index) => 
    {
      if (element.toLowerCase() === key.toLowerCase())  
      {
        tmpIndex = index; 
        return true;
      }
    });
    
    return ( this.messages[1][tmpIndex] );
  }

  async getTransalationMessages (                   ) 
  {
    this.translateConfigService.getText (this.messages[0]).subscribe(
      (values) => 
      {
        this.messages[1] = Object.keys(values).map(key => values[key]);
      }
    );
  }

  changeType()
  {
    if(this.ptype == 'password')
    {
      this.ptype = 'text'
    }

    else
    {
      this.ptype = "password"
    }
  }


  segmentChanged(ev)
  {
    this.Categories = ev.detail.value;
  }

  switchSections()
  {
    this.showSection1 = false;
    this.showSection2 = true;
  }

  next(el)
  {
    el.setFocus();
    this.changeBg1();
    this.changeBg2();
    this.changeBg3();
    this.changeBg4();
    console.log(el);
    this.checkAllFilled();

  }

  changeBg1()
  {
    
    if(this.otp11 == '')
    {
      this.inputBg1 = 'transparentBg'
    }

    else
    {
      this.inputBg1 = 'coloredBg'
    }

    
  }

  changeBg2()
  {
    
    if(this.otp22 == '')
    {
      this.inputBg2 = 'transparentBg'
    }

    else
    {
      this.inputBg2 = 'coloredBg'
    }

    
  }

  changeBg3()
  {
    
    if(this.otp33 == '')
    {
      this.inputBg3 = 'transparentBg'
    }

    else
    {
      this.inputBg3 = 'coloredBg'
    }

    
  }

  changeBg4()
  {
    
    if(this.otp44 == '')
    {
      this.inputBg4 = 'transparentBg'
    }

    else
    {
      this.inputBg4 = 'coloredBg'
    }

    
  }

  /*

  async showSuccessModal() {
    const modal = await this.modalController.create({
    component: SuccessmodalPage,
    });
    modal.onDidDismiss()
    .then(() => {
      
      this.navCtrl.navigateRoot('signin');
  });
  
    await modal.present();
  
  }
  */

  checkAllFilled()
  {
    if(this.otp11 != '' && this.otp22 != '' && this.otp33 != '' && this.otp44 != '')
    {
      this.isAllfilled = false;
    }

    else
    {
      this.isAllfilled = true;
    }
  }

  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }



  async resetPassword() 
  {
    this.sendResetPassword (this.Email, this.Password, this.ConfirmPassword)
  }

 //------------------------------------------------
 // Authentication process
 //------------------------------------------------
 async sendResetPassword                  (  email, password, confirmPassword   ) 
 {
   const alert =  await this.alertController.create(
     {
     subHeader : this.getTextMessage ("SignIn.Messages.Information"),
     message   : this.getTextMessage ("PasswordRecovery.ErrorResetAccount"),
     buttons   : ['OK']
     }
   );


   // If email or password empty
   if (email == '') 
   {
     this.toastService.presentToast('Error', this.getTextMessage ("SignIn.Messages.EmailPasswordRequired"), 'top', 'danger', 2000);
     return;
   }
  
   /*
   // If email or password empty
   if ( password != confirmPassword ) 
   {
     this.toastService.presentToast('Error', this.getTextMessage ("SignUp.PasswordNoMatch"), 'top', 'danger', 2000);
     return;
   }
*/

    let i_timeout : number = parseInt(  this.storage.getTimeout() , 10) ; 


     // Proceed with loading overlay
     const loading = await this.loadingController.create({
       cssClass  : 'default-loading',
       message   :  this.getTextMessage ("SignUp.SendingRequest"),
       spinner   : 'crescent', 
       duration  : (i_timeout * 1000)
     });
     await loading.present();

     var parameters = 
     {
       "email"      : email 
     }
 
     this.httpService.doGet ("/Users/ForgotPassword" , parameters)
     .subscribe( 
       async (res : any) => 
       {
        

          var success = false 
          var message = ''

           loading.dismiss();
          
           if (isPlatform('capacitor')) 
           {
             globalVars.credential.username     = res.data.userName
             success                            = res.data.success
             message                            = res.data.message
           }
           else 
           {
             globalVars.credential.username     = res.userName
             success                            = res.success
             message                            = res.message
           }

           
           if (success == true)
           {
              var params : any = []; 
      
              params = { 
                      email      :  this.Email
                    } 

              await this.router.navigate(['/otpverify'], { queryParams: params });
           }
           else 
           {
              this.toastService.presentToast('Error', message , 'top', 'danger', 2000);
           }
                     
       }, 
       async err => 
       {

         console.log (err); 

         let errorMessage = ''

         if (err.error && err.error.length > 0) 
         {
            errorMessage = err.error[0].description
         }
        
         if (errorMessage.length > 0) 
         {
            alert.message = errorMessage
         }
         
         loading.dismiss();
 
         await alert.present();
                  
       }
     )
    
}


onEmailChange(event: any) 
{
    let value = event.target.value

    let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 

    const regex = new RegExp(emailPattern);

    this.emailError = ! (regex.test ( value ) )
  
    this.Email = value
 }


 


}
