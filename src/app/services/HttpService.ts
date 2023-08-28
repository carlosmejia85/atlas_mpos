

import { Injectable } from "@angular/core";
//import { HTTP } from '@ionic-native/http/ngx';
import { from } from 'rxjs';
import { Http } from '@capacitor-community/http';
import { isPlatform, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProSolution } from 'd135connector'


@Injectable ( { providedIn: "root"}  )
export class HttpService 
{

    constructor ( 
                    public nativeHttp         :     HttpClient
                    //public http               :     HTTP        
                )
    {
       
      var echo = ProSolution.echo ({ value: "carlos" }).then
        ( 
            data =>  
            {
                
                console.log (data);
                
            }, 
            error => 
            {
                console.log ("data error = " );
                console.log (error);
            }
       );
      
    }

    //------------------------------------------
    // use this for cellphone 
    //------------------------------------------

    //_baseUrl = "http://200.85.162.54:5001"
    //_baseUrl    = "http://192.168.128.97:5001"
    _baseUrl    = "http://18.191.155.95:5001"
    _url        = this._baseUrl;

    //------------------------------------------
    // use this for web, run the proxy command too
    // refer to ProSolution Cookbook
    //------------------------------------------
    //_url = '/api';
    //---------------------------------------------------------------
    //  name        : doGet
    //  description : Realiza el get http para obtener informacion del web service
    //  note        : Para que funcione la llamada del web service en el web 
    //                debemos habilitar CORS en el browser, en el mobile no se hace
    //                porque no sucede ese problema. En mi caso de Gogle Chorme utilice una 
    //                extension para deshabilitarlo Allow CORS: Access-Control-Allow-Origin
    //  author      : Carlos Mejia
    //  date        : Mar 15, 2022
    //----------------------------------------------------------------
    doGet ( controller, webServiceFunction  ) 
    {

        let tempUrl = this._url + controller; 

        if (isPlatform('capacitor')) 
        {
            console.log ('Mobile Platform - Capacitor ' + tempUrl + JSON.stringify(webServiceFunction))

            const options = 
            {
                url     : (tempUrl ), 
                method  : "POST",
                headers : { "content-type": "application/json"  }, 

                data    : JSON.stringify(webServiceFunction)

            };

            return from(Http.post (  options )); 
        }
        else 
        {
          
            console.log ('Web Platform');

            tempUrl = "/api" + controller 

            //tempUrl += controller 
        
            const headers = new HttpHeaders({
                "Content-Type"  : "application/json",
                "Accept"        : "*/*"
                
              });
        
              return  this.nativeHttp
                  .post(tempUrl,
                     (webServiceFunction), 
                  {
                      headers: headers
                  })
        }
       
    }


    doGetWithToken ( webServiceFunction , token ) 
    {

        if (isPlatform('capacitor')) 
        {
            console.log ('Mobile Platform - Capacitor ' + this._url + JSON.stringify(webServiceFunction))

            const options = 
            {
                url     : (this._url ), 
                method  : "POST",
                headers : { 
                            "content-type": "application/json" , 
                            "Authorization" : "Bearer " + token }, 
                data    : JSON.stringify(webServiceFunction)

            };

            return from(Http.post (  options )); 
        }
        else 
        {
          
            console.log ('Web Platform');

        
            const headers = new HttpHeaders({
                "Content-Type"  : "application/json",
                "Accept"        : "application/json",
                "Authorization" : "Bearer " + token 
              });
        
              
              return  this.nativeHttp
                  .post(this._url,
                     (webServiceFunction), 
                  {
                      headers: headers
                  })
                  
        
        }
       
    }


    MPOS_doPut ( functionName, webServiceData ) 
    {
        
        if (isPlatform('capacitor')) 
        {
            console.log ('Mobile Platform - Capacitor ' + this._url + functionName + JSON.stringify(webServiceData))

            const options = 
            {
                url     : ( this._url + functionName ), 
                method  : "POST",
                headers : { "content-type": "application/json"  }, 
                data    : JSON.stringify(webServiceData)

            };

            return from(Http.post (  options )); 
        }

        else 
        {
          
            console.log ('Web Platform');

            //"access-control-allow-origin" : "*"

            const headers = new HttpHeaders({
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"
            
              });
        
              
              return  this.nativeHttp
                  .post(this._url + functionName,
                     (webServiceData), 
                  {
                      headers: headers
                  })
                  
            /*
            return this.nativeHttp.request ("POST", this._url,  
            {
                body: JSON.stringify(webServiceFunction), 
                headers:  
                {
                    "content-type": "application/json"      
                }
            }
            );*/

        }

       
    }
    


}