import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'topic-card',
  templateUrl: './topiccard.component.html',
  styleUrls: ['./topiccard.component.scss'],
})
export class TopiccardComponent implements OnInit {

  @Input() topicimg: string;
  @Input() fulltopic: string;
  @Input() bgColor: string;
  @Input() title: string;
  constructor() { }

  ngOnInit() {}

}
