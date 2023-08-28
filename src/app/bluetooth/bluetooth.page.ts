import { Component, OnInit, defineInjectable      } from '@angular/core'                              ;
import { BluetoothLE            } from '@awesome-cordova-plugins/bluetooth-le/ngx'  ;
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular' ;
import { ToastService           } from '../services/toast.service'                  ;
import { ProSolution            } from 'd135connector'                              ;
import { StorageService         } from '../services/StorageService'                 ;
import { ActivatedRoute, Router } from '@angular/router'                            ;
import { TranslateConfigService } from '../services/translate-config.service'       ;

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {

  constructor
      ( 
              private     bluetooth_le          : BluetoothLE           , 
              private     loadingController     : LoadingController     , 
              private     toastService          : ToastService          , 
              private     storage               : StorageService        , 
              private     router                : Router                , 
              private     route                 : ActivatedRoute        ,  
              private     platform              : Platform              , 
              private     actionSheetController : ActionSheetController ,
              private     translateConfigService: TranslateConfigService          
      ) 
  {

  }

  paired_devices  : any = [] 
  new_devices     : any = [] 
  selected            = false     ;
  Categories          = 'registered'
  isScanning          = false 
  isFinding           = false

  public messages : string[][] = 
  [ 
    [ 
      "Tabs.Sale"                           , 
      "TransactionView.SelectAction"        , 
      "TransactionView.Cancel"              , 
      "Tabs.Refund"                         ,   
      "Tabs.Points"                         ,   
      "Tabs.PointsBalance"                  ,   
      "Tabs.Settlement"                     ,
      "Tabs.Installments"                   , 
      "Transaction.ProcessingSettlement"    , 
      "Transaction.BatchEmpty"              ,
      "Devices.Connect"                     , 
      "Devices.Disconnect"
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
      ""
    ]
  ]

  ngOnInit() 
  {
    
    const eventListener =  (ProSolution as any).addListener('bluetooth_new_device', (eventData: any) => this.bluetooth_new_device(eventData) );
    

    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
     });


    this.bluetooth_le.initialize(); 

    this.route.queryParams
    .subscribe(params => 
    {

      this.setUpLanguage            (                   ) 
        
      this.getTransalationMessages  (                   )

      this.requestLocationPermission(                   );  
    });

  }

  bluetooth_new_device (eventData) 
  {

    console.log ("--------------------- bluetooth_new_device ---------------------")
    
    
      console.log (eventData)

      if (eventData.value == 1) // || eventData.value == 101) 
      {
          let newDevice =  
          {
            "name"    : eventData.name, 
            "address" : eventData.address
          } 

          this.new_devices.push (  eventData.name + "|" +  eventData.address)
      }
    
  }

  requestBluetoothScan      () 
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

  requestBluetoothConnect   () 
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

            this.getListOfPairedDevices ( );
          })
        }
        else  
        {
          console.log ("permission.requestPermissionBtConnect == true");  
          console.log (" this.bluetooth_le.enable();");  
          this.bluetooth_le.enable    (
        
           );

          this.getListOfPairedDevices ( );

        }
    })
  }

  requestLocationPermission () 
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

  async getListOfPairedDevices () 
  {
    this.isFinding = true 

    ProSolution.getPairedDeviceList () .then
    ( 
      data =>  
      {
        console.log ("paired devices")
        console.log ( data.value    );
      
        this.paired_devices = data.value;
        this.isFinding      = false 

      }, 
      error => 
      {
        this.isFinding      = false 
        console.log ("data error = " );
        console.log (error);
      }
     );
  }

  async SetSelectedDevice2 ( deviceName ) 
  {

    this.showBluetoothOptions (deviceName); 

  }

  async SetSelectedDevice ( deviceName ) 
  {

    //--------------------------------
    // si es un nuevo dispositivo 
    // que se desconecte del actual
    //--------------------------------
    if (this.Categories == 'new' ) 
    {
      await this.disconnectFromDevice ();
    }
      
    let options = {"d135_name": deviceName}

    // Proceed with loading overlay
    const loading = await this.loadingController.create({
      cssClass: 'default-loading',
      message: '<p>Connecting to ' + deviceName.split("|")[0],
      spinner: 'crescent'
    });

    loading.onDidDismiss().then( (response) => 
    {
       //console.log('Loader dismissed', response);
    });

    await loading.present();

    ProSolution.connect (  options ).then (
      data => 
      {
        console.log ( data );

        loading.dismiss(); 

        if (data.value == 0 || data.value == 1001) 
        {

          this.storage.setSelectedDevice ( deviceName )
          
          // Display success message and go back
          this.toastService.presentToast('Success', 'Connected to ' + deviceName.split("|")[0], 'top', 'success', 2000);

          if (this.Categories == 'new' ) 
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

             this.getListOfPairedDevices()
          }

        }
        else 
        {
          this.toastService.presentToast('Error', 'Error connecting to device.', 'top', 'danger', 2000);
        }
      }, 
      err => 
      {
        loading.dismiss();
        this.toastService.presentToast('Error', 'Error connecting to device.', 'top', 'danger', 2000);
      }
    );
  }

  FindSelectedDevice ( deviceName ) 
  {

    let tmpName = this.storage.getSelectedDevice()

    //let tmpName = localStorage.getItem('selected_device');
  
    return (tmpName == deviceName) ;
   
  }

  async goToHome () 
  {
    this.router.navigate(['/tabs/tab1']);
  }


  segmentChanged(ev)
  {
    this.Categories = ev.detail.value
    console.log(this.Categories);
  }


  goToScan () 
  {
    this.isScanning = true 

    this.new_devices = []
   
    let options = 
    { 
      "params"    : "discover"
    } ; 

    ProSolution.sendCommand ( options ).then (
      (data: any)  => 
      {
        // ----- 
        // stop searching

        if (data.value == 0) 
        {
          this.isScanning = false
        }

      }, 
      err => 
      {
        this.isScanning = false 
      }
    );
  }

  //--------------------------------------
  // Disconnect device
  //--------------------------------------
  async disconnectFromDevice () 
  {
    let options = 
    { 
      "params"    : "disconnect"
    } ; 

    ProSolution.sendCommand ( options ).then (
      (data: any)  => 
      {
      
      }, 
      err => 
      {
 
      }
    );

  }


  //--------------------------------------
  // Unpair device 
  //--------------------------------------
  unPairDevice ( selectedDevice ) 
  {

    let options = 
    { 
      "params"    : "unpair," + selectedDevice
    } ; 

    ProSolution.sendCommand ( options ).then (
      (data: any)  => 
      {
        this.getListOfPairedDevices()
      }, 
      err => 
      {
        this.getListOfPairedDevices()
      }
    );

  }

  setNewDevice( device ) 
  {

  }

  async disconnect_connect (device) 
  {
    await this.disconnectFromDevice (         )
    await this.SetSelectedDevice    ( device  )
  }

  async showBluetoothOptions ( device ) 
  {
  
      var _buttons =  [
        {
          text: this.getTextMessage ('Devices.Connect'),
         
          handler: () => 
          {
            
              let selectedDevice = this.storage.getSelectedDevice() 

              if (selectedDevice) 
              {
                  //let deviceName = selectedDevice.split("|")[0]; 

                  if (selectedDevice === device) 
                  {
                      this.SetSelectedDevice    ( device  )
                  }
                  else 
                  {
                      this.disconnect_connect ( device )
                  }
              }
              else 
              {
                this.disconnect_connect ( device )
              }
              
          }
        }

      ]

      _buttons.push (
        {
          text    : this.getTextMessage ('Devices.Disconnect'),
          handler : () => 
          {

            this.disconnectFromDevice() 
            //this.unPairDevice( device )
          }
        }
      )
      
      let actionSheetButton  =  
      {
        text: this.getTextMessage ('TransactionView.Cancel'),
        icon: 'close',
        role: 'cancel', 
        handler: () => 
        {
        

        }
      }

      _buttons.push (
        actionSheetButton
      )

      const actionSheet = await this.actionSheetController.create({
        header: this.getTextMessage ('TransactionView.SelectAction'),
        cssClass: 'custom-action-sheet',
        buttons: _buttons
      });
      await actionSheet.present();
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



}
