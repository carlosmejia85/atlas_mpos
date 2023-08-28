import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, isPlatform } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpService } from '../services/HttpService';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { globalVars } from 'src/contantes';

@Component({
  selector: 'app-otpverify',
  templateUrl: './otpverify.page.html',
  styleUrls: ['./otpverify.page.scss'],
})
export class OtpverifyPage implements OnInit {
  inputBg1:any = 'transparentBg';
  inputBg2:any = 'transparentBg';
  inputBg3:any = 'transparentBg';
  inputBg4:any = 'transparentBg';
  otp11:any = "";
  otp22:any = "";
  otp33:any = "";
  otp44:any = "";
  isAllfilled:boolean = true;


  Email = ""
  Token = ""

  constructor(
    public      platform                : Platform          ,
    private     renderr                 : Renderer2         ,
    private     el                      : ElementRef        ,
    private     navCtrl                 : NavController     , 

    private     loadingController       : LoadingController ,
    private     toastService            : ToastService      ,
    private     router                  : Router            , 
    private     route                   : ActivatedRoute    , 
    public      httpService             : HttpService       ,
    public      alertController         : AlertController   , 
    private     storage                 : StorageService    , 
    private     translateConfigService  : TranslateConfigService   

     ) { }

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
      "PasswordRecovery.ErrorResetAccount"    , 
      "OTPVerify.ResendCodeMessage"        
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
     
      this.Email = params.email 

      this.setUpLanguage            ( )
      
      this.getTransalationMessages  ( )

    });

  }

  goSetupFaceId()
  {
    this.navCtrl.navigateForward('setupfaceid');
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


  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }




  async resendCode () 
  {

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
  


     // Proceed with loading overlay
     const loading = await this.loadingController.create({
       cssClass  : 'default-loading',
       message   :  this.getTextMessage ("SignUp.SendingRequest"),
       spinner   : 'crescent'
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
        
           loading.dismiss();
           
           if (isPlatform('capacitor')) 
           {
             globalVars.credential.username     = res.data.userName
           }
           else 
           {
             globalVars.credential.username     = res.userName
           }
 

           this.toastService.presentToast('Success', this.getTextMessage('OTPVerify.ResendCodeMessage') , 'top', 'success', 2000);
                     
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


 //------------------------------------------------
 // Authentication process
 //------------------------------------------------
 async goToConfirmOTP                     (    ) 
 {
   const alert =  await this.alertController.create(
     {
     subHeader : this.getTextMessage ("SignIn.Messages.Information"),
     message   : this.getTextMessage ("PasswordRecovery.ErrorResetAccount"),
     buttons   : ['OK']
     }
   );


   this.Token = this.otp11 + this.otp22 + this.otp33 + this.otp44

   // If email or password empty
   if (this.Email == '') 
   {
     this.toastService.presentToast('Error', this.getTextMessage ("SignIn.Messages.EmailPasswordRequired"), 'top', 'danger', 2000);
     return;
   }

   let i_timeout : number = parseInt(  this.storage.getTimeout() , 10) ; 


     // Proceed with loading overlay
     const loading = await this.loadingController.create({
       cssClass  : 'default-loading',
       message   :  this.getTextMessage ("SignUp.SendingRequest"),
       spinner   : 'crescent', 
       duration  : ( i_timeout * 1000)
     });
     await loading.present();

     var parameters = 
     {
       "email"      : this.Email   , 
       "Token"      : this.Token   ,   
       "Token2"     : ""
     }
 
     this.httpService.doGet ("/Users/ConfirmToken" , parameters)
     .subscribe( 
       async (res : any) => 
       {
        
           loading.dismiss();
           
           var success = false 
           var message = ''
           if (isPlatform('capacitor')) 
           {
             success      = res.data.success
             message      = res.data.message
           }
           else 
           {
            success      = res.success
            message      = res.message
           }
 

           if (success == true)
           {
              var params : any = []; 
      
              params = { 
                      email      :  this.Email, 
                      token      : this.Token
                    } 

              await this.router.navigate(['/change-password'], { queryParams: params });
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


}
