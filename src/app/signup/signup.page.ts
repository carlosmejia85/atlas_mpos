import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform, isPlatform } from '@ionic/angular';
import { StorageService } from '../services/StorageService';
import { TranslateConfigService } from '../services/translate-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

import { globalVars } from 'src/contantes';
import { HttpService } from '../services/HttpService';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit 
{

  ptype:any= 'password';

  constructor(
    private     navCtrl                 : NavController     ,
    private     loadingController       : LoadingController ,
    private     toastService            : ToastService      ,
    private     router                  : Router            , 
    private     route                   : ActivatedRoute    , 
    public      httpService             : HttpService       ,
    public      platform                : Platform          ,
    public      alertController         : AlertController   , 
    private     bluetooth_le            : BluetoothLE       , 
    private     storage                 : StorageService    , 
    private     translateConfigService  : TranslateConfigService        ) 
    { 

    }



    ConfirmPassword     = ""
    Password            = ""
    Email               = ""
    emailError          = false
    isAgreementSelected = true 


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
      ""
    ], 
  
  ]


  ngOnInit() 
  {
    this.setUpLanguage            ()
    this.getTransalationMessages  ()

    this.eyeIcon          = document.querySelector(".pass-field i");
    this.requirementList  = document.querySelectorAll(".requirement-list li");

  }

  goAuth()
  {
    this.navCtrl.navigateForward('otpauth');
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

  setUpLanguage                 (                   ) 
  {

    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
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

 //------------------------------------------------
 // Authentication process
 //------------------------------------------------
 async signUp                  (  email, password, confirmPassword, isAgreementSelected   ) 
 {
   const alert =  await this.alertController.create(
     {
     subHeader : this.getTextMessage ("SignIn.Messages.Information"),
     message   : this.getTextMessage ("SignIn.Messages.ErrorCreatingAccount"),
     buttons   : ['OK']
     }
   );

   if (isAgreementSelected == false) 
   {
    this.toastService.presentToast('Error', this.getTextMessage ("SignUp.MustSelectAgreement"), 'top', 'danger', 2000);
    return 
   }

   // If email or password empty
   if (email == '' || password == '' || confirmPassword == '') 
   {
     this.toastService.presentToast('Error', this.getTextMessage ("SignIn.Messages.EmailPasswordRequired"), 'top', 'danger', 2000);
     return;
   }
  
   if ( !( this.length8Valid && this.numberValid && this.upperCaseValid && this.specialCaseValid && this.upperCaseValid ) ) 
   {
    this.toastService.presentToast('Error', this.getTextMessage ("PasswordRecovery.PasswordRequirementFailed"), 'top', 'danger', 2000);
    return;
   }
   
   // If email or password empty
   if ( password != confirmPassword ) 
   {
     this.toastService.presentToast('Error', this.getTextMessage ("SignUp.PasswordNoMatch"), 'top', 'danger', 2000);
     return;
   }
  
   
   {

     // Proceed with loading overlay
     const loading = await this.loadingController.create({
       cssClass  : 'default-loading',
       message   :  this.getTextMessage ("SignUp.SendingRequest"),
       spinner   : 'crescent'
     });
     await loading.present();

     var parameters = 
     {
       "userName" : email    ,
       "password" : password , 
       "Email"    : email 
  
     }
 
     this.httpService.doGet ("/Users" , parameters)
     .subscribe( 
       async (res : any) => 
       {
        
           loading.dismiss();
           
           if (res.error == true) 
           {

             if (isPlatform('capacitor')) 
             {
               alert.message    = res.data.description
             }
             else 
             {
               alert.message     = res.description
             }

             alert.present()
             return 
           }

           if (isPlatform('capacitor')) 
           {
             globalVars.credential.username     = res.data.userName
           }
           else 
           {
             globalVars.credential.username     = res.userName
           }
 
           {
             await this.router.navigate(['/otpauth']);
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


onEmailChange(event: any) 
{
    let value = event.target.value

    let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 

    const regex = new RegExp(emailPattern);

    this.emailError = ! (regex.test ( value ) )
  
    this.Email = value
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
