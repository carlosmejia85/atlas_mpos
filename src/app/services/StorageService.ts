import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { globalVars } from 'src/contantes';
import { CryptoService } from './CryptoService';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    public cryptoService : CryptoService
  ) 
  {
       
  }

  //-------------------------------------------
  // Set Login Data 
  //-------------------------------------------

  saveLoginData     ( credentials   ) 
  {

    let strData = this.cryptoService.encrypt (  JSON.stringify(credentials) ); 

    localStorage.setItem (
                            globalVars.database.loginData, 
                            strData
                            //JSON.stringify(credentials)
                          )
  }

  //-------------------------------------------
  // Get Login Data 
  //-------------------------------------------
  getLoginData      (               ) 
  {

    return this.cryptoService.decrypt (  this.getTagData ( globalVars.database.loginData ) ); 

    //return this.getTagData ( globalVars.database.loginData )               
  }

  //------------------------------------------
  // Get a Tag value from local storage
  //-------------------------------------------
  getTagData ( tag ) 
  {
    return localStorage.getItem ( tag )
  } 


  //-------------------------------------------
  // Get Selected Device 
  //-------------------------------------------
  getSelectedDevice      (               ) 
  {
    return this.getTagData ( globalVars.database.deviceName )               
  }

  //-------------------------------------------
  // Set Selected Device 
  //-------------------------------------------
  setSelectedDevice      (     deviceName          ) 
  {
    localStorage.setItem (
                            globalVars.database.deviceName, 
                            deviceName
                          )           
  }


  //-------------------------------------------
  // Transactions
  //-------------------------------------------

  setTransactions ( transactions) 
  {
    if (transactions) 
    {
      localStorage.setItem (globalVars.database.transactions, JSON.stringify(transactions))
    }
    
  }
  
  getTransactions ( ) 
  {
    return this.getTagData ( globalVars.database.transactions )              
  }


  getTerminalId ( ) 
  {
    return this.getTagData ( globalVars.database.terminalId )              
  }

  getMerchantId ( ) 
  {
    return this.getTagData ( globalVars.database.merchantId )              
  }

  setTerminalId ( id ) 
  {
    localStorage.setItem ( globalVars.database.terminalId, id)   
  }

  setMerchantId ( id ) 
  {
    localStorage.setItem ( globalVars.database.merchantId, id)            
  }

  setTax ( tax ) 
  {
    localStorage.setItem ( globalVars.database.tax, tax)            
  }

  getTax (  ) 
  {
    return localStorage.getItem ( globalVars.database.tax )            
  }

  setEnabledTax ( enable ) 
  {
    localStorage.setItem ( globalVars.database.enabledTax, enable)            
  }

  isEnabledTax (  ) 
  {
    return localStorage.getItem ( globalVars.database.enabledTax )            
  }

  setTip1 ( tip ) 
  {
    let temp = "0.00"

    if (tip) 
    {
        temp = tip
    }
             
    localStorage.setItem ( globalVars.database.tip1, temp)         
  }

  getTip1 (  ) 
  {
    return localStorage.getItem ( globalVars.database.tip1 )            
  }

  setTip2 ( tip ) 
  {
    let temp = "0.00"

    if (tip) 
    {
        temp = tip
    }
             
    localStorage.setItem ( globalVars.database.tip2, temp)  
  }

  getTip2 (  ) 
  {
    return localStorage.getItem ( globalVars.database.tip2 )            
  }

  setTip3 ( tip ) 
  {
    let temp = "0.00"

    if (tip) 
    {
        temp = tip
    }
             
    localStorage.setItem ( globalVars.database.tip3, temp)          
  }

  getTip3 (  ) 
  {
    return localStorage.getItem ( globalVars.database.tip3 )            
  }

  setTip4 ( tip ) 
  {
    let temp = "0.00"

    if (tip) 
    {
        temp = tip
    }
             
    localStorage.setItem ( globalVars.database.tip4, temp)            
  }

  getTip4 (  ) 
  {
    return localStorage.getItem ( globalVars.database.tip4 )            
  }

  setEnabledTip       (   enable        ) 
  {
    localStorage.setItem ( globalVars.database.enabledTip, enable)            
  }

  isEnabledTip        (                 )   
  {
    return localStorage.getItem ( globalVars.database.enabledTip )            
  }


  setEnabledOverCharged       (   enable        ) 
  {
    localStorage.setItem ( globalVars.database.overCharged, enable)            
  }

  isEnabledOverCharged        (                 )   
  {
    return localStorage.getItem ( globalVars.database.overCharged )            
  }


  setLanguage         ( language        ) 
  {
    localStorage.setItem ( globalVars.database.language, language)            
  }

  getLanguage         (                 ) 
  {
    return localStorage.getItem ( globalVars.database.language )            
  }

  getSelectedLanguage  (                 ) 
  {
    let selectedLanguage = localStorage.getItem ( globalVars.database.language )            
  
    if (selectedLanguage === 'English') 
    {
      selectedLanguage = 'en'
    }
    else if (selectedLanguage === 'Spanish') 
    {
      selectedLanguage = 'es'
    }
    else 
    {
      selectedLanguage = 'en'
    }

    return selectedLanguage
  }


  setEnableBiometric  ( biometric       ) 
  {
    localStorage.setItem ( globalVars.database.enableBiometric, biometric)            
  }

  getEnableBiometric  (                 ) 
  {
    return localStorage.getItem ( globalVars.database.enableBiometric)            
  }


  setPasswordBiometric (password) 
  {
    localStorage.setItem ( globalVars.database.password, password)            
  }

  getPasswordBiometric () 
  {
    return this.cryptoService.decrypt ( localStorage.getItem ( globalVars.database.password)  )
  }

  setUsernameBiometric (username) 
  {
    localStorage.setItem ( globalVars.database.username, username)            
  }

  getUsernameBiometric () 
  {
    return  this.cryptoService.decrypt ( localStorage.getItem ( globalVars.database.username) )
  }


  setRefundEnabled         ( enabled        ) 
  {
    localStorage.setItem ( globalVars.database.refund, enabled)            
  }

  isRefundEnabled         (                 ) 
  {
    return localStorage.getItem ( globalVars.database.refund )            
  }

  setPointsEnabled         ( enabled        ) 
  {
    localStorage.setItem ( globalVars.database.points, enabled)            
  }

  isPointsEnabled         (                 ) 
  {
    return localStorage.getItem ( globalVars.database.points )            
  }

  setInstallmentEnabled         ( enabled        ) 
  {
    localStorage.setItem ( globalVars.database.installment, enabled)            
  }

  isInstallmentEnabled         (                 ) 
  {
    return localStorage.getItem ( globalVars.database.installment )            
  }

  setSurcharge ( surcharge ) 
  {
    localStorage.setItem ( globalVars.database.surcharge, surcharge)            
  }

  getSurcharge (  ) 
  {
    return localStorage.getItem ( globalVars.database.surcharge )            
  }

  setRememberMe (remember) 
  {
    localStorage.setItem ( globalVars.database.rememberMe, remember)            
  }

  getRememberMe () 
  {
    let value = localStorage.getItem ( globalVars.database.rememberMe)
    
    if (!value) 
    {
      return 'false'
    }

    return value;
  }


  getTimeout ( ) 
  {
    let timeout  = this.getTagData ( globalVars.database.timeout )     
    
    if (timeout) 
    {
      return timeout
    }
    else 
    {
      return "10"
    }
  }

  setTimeout ( timeout ) 
  {
    localStorage.setItem ( globalVars.database.timeout, timeout)            
  }



}