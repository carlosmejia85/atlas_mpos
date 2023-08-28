import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/themeservice.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { StorageService } from './services/StorageService';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit
{

  idleState         = 'Not started.'          ;
  timedOut          = false                   ;
  lastPing?: Date   = null                    ;
  title             = 'angular-idle-timeout'  ;


  constructor( 
                private   themeService      : ThemeService    , 
                private   translateService  : TranslateService, 
                private   router            : Router          , 
                private   idle              : Idle            , 
                private   keepalive         : Keepalive       , 
                private   route             : ActivatedRoute  ,
                private   storage           : StorageService    
                ) 
    {
      this.setDefaultLang();

      //--------------------------------------------------
     // Disables back button history 
      //--------------------------------------------------

      //router.canceledNavigationResolution = 'computed';

    }
  
  ngOnInit(): void 
  {
    this.route.queryParams
      .subscribe(params => 
      { 


        let i_timeout : number = parseInt(  this.storage.getTimeout() , 10) ; 

        // sets an idle timeout of 5 seconds, for testing purposes.
        this.idle.setIdle        ( 5               );

        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout     (  i_timeout * 60 );

        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleEnd.subscribe(() => { 
          this.idleState = 'No longer idle.'
          console.log(this.idleState);
          this.reset();
        });
        
        this.idle.onTimeout.subscribe(() => 
        {
          this.idleState  = 'Timed out!';
          
          this.timedOut   = true;
          
          console.log(this.idleState);

          this.reset () ; 

          this.router.navigate(['/signin'] ); 

        });
        
        this.idle.onIdleStart.subscribe(() => 
        {
            this.idleState = 'You\'ve gone idle!'
            console.log(this.idleState);
            //this.childModal.show();
        });
        
        this.idle.onTimeoutWarning.subscribe((countdown) => 
        {
          if ( countdown <= 5) 
          {
            this.idleState = 'You will time out in ' + countdown + ' seconds!'
            console.log(this.idleState);
          }
          
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

        this.reset();
      })
  }

    reset() 
    {
      this.idle.watch();
      this.idleState = 'Started.';
      this.timedOut = false;
    }

  private setDefaultLang() 
  {
    this.translateService.addLangs(['en', 'es']); // array of available langs
    this.translateService.setDefaultLang('en');
  }

  onToggleColorTheme(event)
  {
    if(event.detail.checked)
    {
     this.themeService.setDark();
    }

    else
    {
      this.themeService.setLight();
    }
    
}
}