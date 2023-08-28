import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  renderer: Renderer2;
  constructor(
    private platform: Platform,
    private rendererFactory: RendererFactory2,  @Inject(DOCUMENT)private document: Document
  ) {

    this.renderer = this.rendererFactory.createRenderer(null,null);
  }

  setLight()
  {
    
    this.renderer.removeClass(this.document.getElementById("IAP"),'dark-theme');
    
  }

  setDark()
  {
    this.renderer.addClass(this.document.getElementById("IAP"),'dark-theme');
  }
}
