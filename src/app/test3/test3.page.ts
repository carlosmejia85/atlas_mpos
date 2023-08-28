import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-test3',
  templateUrl: './test3.page.html',
  styleUrls: ['./test3.page.scss'],
})
export class Test3Page implements OnInit {
  coordsx: any;
  coordsy: any;

  @ViewChild('position') HoldPosition: ElementRef;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private animationCtrl: AnimationController,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.renderer.setStyle(
      this.HoldPosition.nativeElement,
      'transform',
      `translate3d(${this.coordsx}px, ${this.coordsy}px, 0)`
    );
    this.renderer.setStyle(
      this.HoldPosition.nativeElement,
      'transition',
      '2s ease-in-out'
    );
    setTimeout(() => {
      this.renderer.removeStyle(this.HoldPosition.nativeElement, 'transform');
    }, 50);
  }

  show() {
    // this.offsetTop =this.HoldPosition.nativeElement.offsetTop;

  console.log(this.HoldPosition.nativeElement.offsetTop);


  // this.offsetLeft =this.HoldPosition.nativeElement.offsetLeft ;

  console.log(this.HoldPosition.nativeElement.offsetLeft);
  
  }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const params = this.router.getCurrentNavigation().extras.state;
      // this.stock = params.type;
      this.coordsx = params.xcordinate;
      this.coordsy = params.ycordinate;

      console.log(params.xcordinate, params.ycordinate);
    }
  }
}
