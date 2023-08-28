import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'balancecard',
  templateUrl: './balancecard.component.html',
  styleUrls: ['./balancecard.component.scss'],
})
export class BalancecardComponent implements OnInit {
  @Input() data: any[];
  @Input() mainAmount: string;
  @Input() cardTitle: string;
  @Input() subAmount: string;
  @Input() salePercentage: string;
  @Input() voidPercentage: string;
  @Input() showStatus: boolean = false;
  @Input() saleTitle: string;
  @Input() voidTitle: string;
  @Input() revTitle: string;
  constructor() { }

  ngOnInit() {}

}
