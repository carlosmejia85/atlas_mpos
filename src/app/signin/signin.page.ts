import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, isPlatform } from '@ionic/angular';
import { HttpService } from '../services/HttpService';
import { ToastService } from '../services/toast.service';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { globalVars } from 'src/contantes';
import { StorageService } from '../services/StorageService';
import { ProSolution } from 'd135connector';
import { TranslateConfigService } from '../services/translate-config.service';

import { Plugins } from "@capacitor/core";

const { BiometricAuth } = Plugins;

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit 
{

  public messages : string[][] = [ 
    [ "SignIn.Messages.Information"           , 
      "SignIn.Messages.BadCredentials"        , 
      "SignIn.Messages.EmailPasswordRequired" , 
      "SignIn.Messages.Authenticating"        , 
      "SignIn.Messages.BiometricFailed"       ,
      "SignIn.Messages.LoginTimeout"         
    ], 
    [
      "",
      "", 
      "",
      "", 
      "", 
      ""
    ], 
  
  ]

  emailError = false
/*
  email     = "newuser000@prosolution.pro"
  password  = "password"
  */

  
  email     = ""
  password  = ""

  rememberMe = false

  ptype:any = 'password';

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
      private     translateConfigService  : TranslateConfigService            
    ) 
    {

    }

  ngOnInit                      (                   ) 
  {

    this.route.queryParams
    .subscribe(params => 
    { 

      let options = { value: ""}

      ProSolution.echo( options ).then( (data) => 
      {

      }); 

      //this.translateConfigService.getDefaultLanguage()

      this.setUpLanguage            ()

      this.getTransalationMessages  ();

      this.setupBiometric           ()
      
      this.rememberMe = this.storage.getRememberMe () == 'true';

      if (this.rememberMe == true) 
      {
        
        let data = this.storage.getLoginData(); 

        if ( data ) 
        {
          globalVars.credential = JSON.parse ( data ); 

          this.email = globalVars.credential.username
        }

      }
    });

    this.bluetooth_le.initialize  (); 
        
    this.requestLocationPermission();  

    
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

  //--------------------------------------
  // Biometria 
  //--------------------------------------
  biometricAvailable = false 

  async setupBiometric          (                   ) 
  {
    if (this.storage.getEnableBiometric() === 'true') 
    {
      const available = await BiometricAuth.isAvailable()

      if (available.has) 
      {
        this. biometricAvailable = true 
  
        /*
        const authResult = await BiometricAuth.verify({})
  
        if (authResult.verified) 
        {
          // success authentication
        } else {
          // fail authentication
        }*/
      }
       else
      {
        this. biometricAvailable =  false 
        // biometric not available
      }
    }
    else 
    {
      this. biometricAvailable = false
    }
  }

  async verifyBiometric         (                   ) 
  {
   if ( this. biometricAvailable == true ) 
   {

     // If email or password empty
     if (this.email == '' ) 
     {
       this.toastService.presentToast('Error', this.getTextMessage ("SignIn.Messages.EmailPasswordRequired"), 'top', 'danger', 2000);
       return; 
     }

    const authResult = await BiometricAuth.verify({})
  
    if (authResult.verified) 
    {
      this.signIn( this.storage.getUsernameBiometric    (), this.storage.getPasswordBiometric ());
    }
     else 
    {
      this.toastService.presentToast('Error', this.getTextMessage("SignIn.Messages.BiometricFailed"), 'top', 'danger', 2000);
    }
   }
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

  async goHome                  (                   )
  {
    await this.router.navigate(['/tabs'] ); 
  }

  goResetPassword               (                   )
  {
    this.navCtrl.navigateForward('passrecovery');
  }

 //------------------------------------------------
 // Permission request
 //------------------------------------------------
    
  requestBluetoothScan          (                   ) 
  {
    console.log ("requestPermissionBtScan");  
    this.bluetooth_le.hasPermissionBtScan().then( permission => 
      {
        if (permission.hasPermission == false) 
        {
          this.bluetooth_le.requestPermissionBtScan().then ( (request) => 
          {
            console.log ("requestPermissionBtScan.hasPermission == false");  
            console.log (request.requestPermission);        

            this.requestBluetoothConnect();
          })
        }
        else  
        {
          console.log ("permission.requestPermissionBtScan == true");  
          this.requestBluetoothConnect()
        }
    })

  }

  requestBluetoothConnect       (                   ) 
  {
    console.log ("requestBluetoothConnect");  
    this.bluetooth_le.hasPermissionBtConnect().then( permission => 
      {
        if (permission.hasPermission == false) 
        {
          this.bluetooth_le.requestPermissionBtConnect().then ( (request) => 
          {
            console.log ("permission.requestPermissionBtConnect == false");  
            console.log (request.requestPermission);   
            
            console.log (" this.bluetooth_le.enable();");  
            this.bluetooth_le.enable    ( );

           
          })
        }
        else  
        {
          console.log ("permission.requestPermissionBtConnect == true");  
          console.log (" this.bluetooth_le.enable();");  
          this.bluetooth_le.enable    ( );

        }
    })
  }

  requestLocationPermission     (                   ) 
  {
   
        this.bluetooth_le.hasPermission().then ( permission => {

          if (permission.hasPermission == false)
          {
            this.bluetooth_le.requestPermission()
            .then ( (data) => 
              {
                this.requestBluetoothScan();
              } 
            )
          }
          else 
          {
            this.requestBluetoothScan();
          }
        }) 
  }

 //------------------------------------------------
 // Authentication process
 //------------------------------------------------
  async signIn                  (  email, password   ) 
  {
   
    
      const alert =  await this.alertController.create(
      {
          subHeader : this.getTextMessage ("SignIn.Messages.Information"),
          message   : this.getTextMessage ("SignIn.Messages.BadCredentials"),
          buttons   : ['OK']
      });

      const alertTimeout =  await this.alertController.create(
      {
          subHeader : this.getTextMessage ("SignIn.Messages.Information"),
          message   : this.getTextMessage ("SignIn.Messages.LoginTimeout"),
          buttons   : ['OK']
      });

        // If email or password empty
        if (email == '' || password == '' || this.emailError == true) 
        {
          this.toastService.presentToast('Error', this.getTextMessage ("SignIn.Messages.EmailPasswordRequired"), 'top', 'danger', 2000);
        }
        else 
        {
    
          let i_timeout : number = parseInt(  this.storage.getTimeout() , 10) ; 

          // Proceed with loading overlay
          const loading = await this.loadingController.create({
            cssClass  : 'default-loading',
            message   :  this.getTextMessage ("SignIn.Messages.Authenticating"),
            spinner   : 'crescent', 
            duration  : (i_timeout * 1000)
          });

          var timeout = true 

          loading.onDidDismiss ().then(data => 
          {
            if (timeout == true) 
            {
              alertTimeout.present()
            }
        
          });

          await loading.present();
    
          var parameters = 
          {
            "userName": email    ,
            "password": password 
          
          }

          this.storage.setRememberMe ( this.rememberMe == true ? 'true' : 'false' )
      
          this.httpService.doGet ("/Users/BearerToken" , parameters)
          .subscribe( 
            async (res : any) => 
            {
            
                timeout = false 

                loading.dismiss();


                if (res.error == true) 
                {
                  
                  if (isPlatform('capacitor')) 
                  {
                    if (res.data.message) 
                    {
                      alert.message    = res.data.message
                    }
                    
                  }
                  else 
                  {
                    if (res.message) 
                    {
                      alert.message     = res.message 
                    }
                  }

                  alert.present()
                  
                  return 
                }


                console.log ( " Login successfully " )
                console.log ( res )
                
                if (isPlatform('capacitor')) 
                {
                  globalVars.credential.token     = res.data.token
                }
                else 
                {
                  globalVars.credential.token     = res.token
                }
      
                globalVars.credential.password  = password
                globalVars.credential.username  = email

                console.log ("token     = " + globalVars.credential.token)
                console.log ("username  = " + globalVars.credential.username)
              
                this.storage.saveLoginData ( globalVars.credential ) ;

                {
                  await this.router.navigate(['/tabs']);
                }
                          
            }, 
            async err => 
            {
    
              timeout = false 

              console.log (err); 
              
              loading.dismiss();
      
              await alert.present();
                
              /*
              {
                await this.router.navigate(['/tabs']);
              }
              */
              
                        
            }
          )
          
          /*
          // Fake timeout
          setTimeout(async () => 
          {
    
            // Sign in success
            await this.router.navigate(['/home']);
            loading.dismiss();
          }, 2000);
          */
        }
  
  }


  onEmailChange(event: any) 
  {
      let value = event.target.value

      let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; 

      const regex = new RegExp(emailPattern);
  
      this.emailError = ! (regex.test ( value ) )

      this.email = value 
    
   }


}
