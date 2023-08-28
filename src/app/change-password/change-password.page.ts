import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, isPlatform } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpService } from '../services/HttpService';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { globalVars } from 'src/contantes';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {



  ptype = 'password'
  
  length8_img         = './assets/imgs/cancel_void.png'
  number_img          = './assets/imgs/cancel_void.png'
  letter_lowwer_img   = './assets/imgs/cancel_void.png'
  letter_special_img  = './assets/imgs/cancel_void.png'
  letter_upper_img    = './assets/imgs/cancel_void.png'


  length8Valid      = false 
  numberValid       = false 
  lowerCaseValid    = false 
  specialCaseValid  = false 
  upperCaseValid    = false 

  // An array of password requirements with corresponding 
  // regular expressions and index of the requirement list item
 requirements = [
  { regex: /.{8,}/, index: 0 }, // Minimum of 8 characters
  { regex: /[0-9]/, index: 1 }, // At least one number
  { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
  { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
  { regex: /[A-Z]/, index: 4 }, // At least one uppercase letter
]

 eyeIcon         : any   
 requirementList : any 

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
    "OTPVerify.ResendCodeMessage"           , 
    "PasswordRecovery.PasswordMismatched"   , 
    "PasswordRecovery.PasswordChangedOk"    , 
    "PasswordRecovery.Title", 
    "PasswordRecovery.PasswordRequirementFailed"
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
    "", 
    "", 
    "", 
    "", 
    ""
  ], 

]

Email           = ''

Token           = ''

Password        = ''

ConfirmPassword = ''

  ngOnInit() 
  {
    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
    });

    this.eyeIcon          = document.querySelector(".pass-field i");
    this.requirementList  = document.querySelectorAll(".requirement-list li");

    this.route.queryParams
    .subscribe(params => 
    { 
     
      this.Email = params.email 

      this.Token = params.token

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


  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }


   bytesToBase64( value ) 
   {
   
    return btoa(value);
  }

 //------------------------------------------------
 // Authentication process
 //------------------------------------------------
 async resetPassword                     (     ) 
 {
   const alert =  await this.alertController.create(
     {
     subHeader : this.getTextMessage ("SignIn.Messages.Information"),
     message   : this.getTextMessage ("PasswordRecovery.ErrorResetAccount"),
     buttons   : ['OK']
     }
   );


   if ( !( this.length8Valid && this.numberValid && this.upperCaseValid && this.specialCaseValid && this.upperCaseValid ) ) 
   {
    this.toastService.presentToast('Error', this.getTextMessage ("PasswordRecovery.PasswordRequirementFailed"), 'top', 'danger', 2000);
    return;
   }


   // If email or password empty
   if (this.Email == '') 
   {
     this.toastService.presentToast('Error', this.getTextMessage ("SignIn.Messages.EmailPasswordRequired"), 'top', 'danger', 2000);
     return;
   }

   if (this.Password != this.ConfirmPassword) 
   {
      this.toastService.presentToast('Error', this.getTextMessage ("PasswordRecovery.PasswordMismatched"), 'top', 'danger', 2000);
     return;
   }

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
       "email"      : this.Email         , 
       "Token"      : this.Token    ,   
       Token2      : this.bytesToBase64 ( this.Password ) 
     }
 
     this.httpService.doGet ("/Users/ResetPassword" , parameters)
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
      
              params = 
              {
                message : this.getTextMessage ("PasswordRecovery.PasswordChangedOk"), 
                message2 : this.getTextMessage ("PasswordRecovery.Title")
              }
  
              await this.router.navigate(['/otpauth'], { queryParams: params });
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

changeType                    (                   )
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

onPassword1Change(event: any) 
  {
      let value = event.target.value


      this.requirements.forEach(item => {
        // Check if the password matches the requirement regex
        const isValid = item.regex.test( value );

        const requirementItem = this.requirementList[item.index];
        
        if (item.index == 0) 
        {
          if (isValid ) 
          {
            this.length8_img  = "./assets/imgs/icons_ok.png"
            this.length8Valid = true 
          }
          else 
          {
            this.length8_img  = "./assets/imgs/cancel_void.png"
            this.length8Valid = false 
          }
        }

        if (item.index == 1) 
        {
          if (isValid ) 
          {
            this.number_img = "./assets/imgs/icons_ok.png"
            this.numberValid = true 
          }
          else 
          {
            this.number_img = "./assets/imgs/cancel_void.png"
            this.numberValid = false 
          }
        }

        if (item.index == 2) 
        {
          if (isValid ) 
          {
            this.letter_lowwer_img  = "./assets/imgs/icons_ok.png"
            this.lowerCaseValid     = true;
          }
          else 
          {
            this.letter_lowwer_img  = "./assets/imgs/cancel_void.png"
            this.lowerCaseValid     = false;
          }
        }

        if (item.index == 3) 
        {
          if (isValid ) 
          {
            this.letter_special_img   = "./assets/imgs/icons_ok.png"
            this.specialCaseValid     = true;
          }
          else 
          {
            this.letter_special_img   = "./assets/imgs/cancel_void.png"
            this.specialCaseValid     = false;
          }
        }

        if (item.index == 4) 
        {
          if (isValid ) 
          {
            this.letter_upper_img = "./assets/imgs/icons_ok.png"
            this.upperCaseValid   = true 
          }
          else 
          {
            this.letter_upper_img = "./assets/imgs/cancel_void.png"
            this.upperCaseValid   = false
          }
        }

        /*
        if (isValid)
        {
            requirementItem.classList.add("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-check";
        }
         else 
        {
            requirementItem.classList.remove("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-circle";
        }*/
    });

    /*
      let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 

      const regex = new RegExp(emailPattern);
  
      t = ! (regex.test ( value ) )

      this.Password = value 
    */
   }


}
