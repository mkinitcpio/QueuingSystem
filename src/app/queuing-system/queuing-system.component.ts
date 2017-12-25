import { Component, OnInit,Input } from '@angular/core';
import { Model } from '../typings';

@Component({
  selector: 'app-queuing-system',
  templateUrl: './queuing-system.component.html',
  styleUrls: ['./queuing-system.component.css']
})
export class QueuingSystemComponent implements OnInit {
  
  @Input()
  model: Model;
  
  constructor() { }

  ngOnInit() {
  }

}
