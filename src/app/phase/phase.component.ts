import { Component, OnInit, Input } from '@angular/core';
import { ChannelStatus } from '../typings';

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class PhaseComponent implements OnInit {
  
  public ChannelStatus = ChannelStatus;

  @Input()
  channels= [];

  constructor() { }

  ngOnInit() {
  }

}
