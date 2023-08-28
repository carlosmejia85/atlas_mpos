import { OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import SignaturePad from 'signature_pad';
import { StorageService } from '../services/StorageService';
import { TranslateConfigService } from '../services/translate-config.service';
import { ToastService } from '../services/toast.service';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {


  title         = "" 
  device_width  = 0
  device_heigth = 0

  signaturePad: SignaturePad;
  @ViewChild('canvas') canvasEl: ElementRef;
  signatureImg: string;

  auth    = ""
      
  amount  = ""
      
  id      = "" 

  view    = "false" 

  currentTransaction : any 

  constructor(
    private route                       : ActivatedRoute          , 
    private loadingController           : LoadingController       ,   
    private router                      : Router                  , 
    private platform                    : Platform                , 
    private location                    : Location                ,
    private storage                     : StorageService          , 
    private translateConfigService      : TranslateConfigService  , 
    private     toastService            : ToastService            
    )
    
  { 

    platform.ready().then(() => 
    {

      this.device_width   = platform.width  ( )
      this.device_heigth  = platform.height ( )

      console.log('Width  : ' + this.device_width   );
      console.log('Height : ' + this.device_heigth  );

    });

    let priority = 9999

    this.platform.backButton.subscribeWithPriority(priority, () => {
      // do on back button click
     });

  
  }



  ngOnInit() 
  {
    
    this.route.queryParams
    .subscribe(params => 
    { 

     
      this.setUpLanguage () 

      this.auth    = params.authorized
      
      this.amount  = params.total
      
      this.id      = params.stan 

      this.view    = params.view 

      if (!this.view) 
      {
        this.view = "false"
      }

      this.getTransactionsData (); 

      if (this.transactions) 
      {
        this.search_transaction ( this.auth, this.amount, this.id )
      }
    
      //this.title = "Please sign this transaction. Amount: $ " + this.amount + " Authorized = " + this.auth

    });
    
  }


  setUpLanguage                 (                   ) 
  {

    let selectedLanguage = this.storage.getSelectedLanguage();

    this.translateConfigService.setLanguage(selectedLanguage);
  }


  //---------------------------------------
  // name       : search_transaction
  // description: Find a transaction by its id 
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  search_transaction ( authorized, amount, id ) 
  {
    var filtered = this.transactions.filter(a => (a.id == id && a.auth == authorized ));
    
    if (filtered && filtered.length > 0) 
    {
      this.currentTransaction = filtered [ 0 ]
    }
  }


  transactions : any = []

    //---------------------------------------
  // name       : getTransactionsData
  // description: Get Transaction data
  // author     : Carlos Mejia 
  // date       : April 2, 2023 
  //---------------------------------------
  getTransactionsData   (               ) 
  {
     console.log("getTransactionsData"); 
 
     let trxJson = this.storage.getTransactions ()
 
     if (trxJson)
     {
       this.transactions = JSON.parse (trxJson)
     }
    
     console.log ( this.transactions );
   }

   

   ngAfterViewInit() 
   {
    if (this.view == 'false') 
    {
       this.signaturePad = new SignaturePad(this.canvasEl.nativeElement); 
    }
  }

  @ViewChild('canvas') signatureDiv: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) 
  {
      this.handleSignatureCanvasSize(); //handle the resizing of signature pad canvas on resizing screen
  }

  handleSignatureCanvasSize() 
  {
    //handle the resizing of signature pad canvas on resizing screen
    const canvas        = document.querySelector("canvas");
    const tempWidth     = String(this.signatureDiv.nativeElement.clientWidth);
    const tempHeight    = String(this.signatureDiv.nativeElement.clientHeight);
    const widthCanvas   = tempWidth .concat("px");
    const heightCanvas  = tempHeight.concat("px"); 

    canvas.setAttribute(  "width"   , widthCanvas   );
    canvas.setAttribute(  "height"  , heightCanvas  );
  }


  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }


  clearPad() 
  {
    if (this.signaturePad) 
    {
      this.signaturePad.clear(); 
    }

    if (this.currentTransaction) 
    {
      this.currentTransaction.signature = ""  

      this.storage.setTransactions ( this.transactions )
    }

  }

  drawComplete() 
  {
    // will be notified of szimek/signature_pad's onEnd event
    
    if (this.signaturePad) 
    {
      //console.log(this.signaturePad.toDataURL());

      if (this.currentTransaction) 
      {
        this.currentTransaction.signature = this.signaturePad.toDataURL()  
  
        this.storage.setTransactions ( this.transactions) 
      }
    }
  }

  async goBack () 
  {
    //this.location.back();

    this.router.navigate(
      ['/viewtransaction'], 
      { 
        queryParams: { 
                       
                        id       : this.id   , 
                      
                      } 
      }
      )

  }

  async savePad() 
  {

    this.signatureImg = this.signaturePad.toDataURL();

    this.drawComplete() 

    if (this.currentTransaction.signature == '') 
    {
        this.toastService.presentToast('Error', 'You have to sign first.', 'top', 'danger', 2000);

        return
    }

       // Loading overlay
       const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: '<p>Saving Signature...</p>',
        spinner: 'crescent'
      });
      
      await loading.present();

     // Fake timeout
     setTimeout(() => 
     {
        loading.dismiss();

        this.router.navigate( ['/tabs'] )

    }, 1000);

  }

  ionViewDidEnter() 
  { 

    if (this.signaturePad) 
    {    
      this.signaturePad.clear         ( ); 

  
      if (this.view && this.view == "true") 
      {
        if (this.currentTransaction) 
        {
          /*
          {
            'minWidth'    : 3    ,
            'canvasWidth' : 500  ,     
            'canvasHeight': 300
          };
          */

          this.signaturePad.fromDataURL ( this.currentTransaction.signature , { 'width'    : 3 } )
        }       
      } 

      this.handleSignatureCanvasSize  ( );
    }
  }


}
