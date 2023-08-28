import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { globalVars } from 'src/contantes';
import { TranslateConfigService } from '../services/translate-config.service';
import { CryptoService } from '../services/CryptoService';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public      alertController         : AlertController   , 
    public      storage                 : StorageService    ,
    public      toast                   : ToastService      , 
    private     route                   : ActivatedRoute    ,
    private     translateConfigService  : TranslateConfigService , 
    private     cryptoService           : CryptoService 
    
  ) { }

  enableFaceId = false 

  ngOnInit() 
  { 
    this.route.queryParams
    .subscribe(params => 
    { 

      this.setUpLanguage      (                   ) 

      let temp = this.storage.getEnableBiometric();

      this.enableFaceId = (temp === 'true' ? true : false );

    });
  }


  setUpLanguage                 (                   ) 
  {
    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }

  checkEnableFaceId() 
  {
    // this.enableFaceId = !this.enableFaceId ; 

    this.storage.setEnableBiometric (this.enableFaceId === true ? 'true' : 'false')

    if (this.enableFaceId == true) 
    {
      this.storage.setUsernameBiometric ( this.cryptoService.encrypt ( globalVars.credential.username )  )
      this.storage.setPasswordBiometric ( this.cryptoService.encrypt ( globalVars.credential.password )  )
    }
    
  }

  update(event)
  {
    this.enableFaceId = event 
    
    this.checkEnableFaceId();
  }
}
