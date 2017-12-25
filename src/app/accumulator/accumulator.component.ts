import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-accumulator',
  templateUrl: './accumulator.component.html',
  styleUrls: ['./accumulator.component.css']
})
export class AccumulatorComponent implements OnInit {


  @Input()
  tasks: Array<Task> = [];

  @Input()
  accumulatorCapacity: number = 0;
  public accumulatorArray = [];
  constructor() { }
  ngOnInit() {
    this.accumulatorArray = Array.from({ length: this.accumulatorCapacity });
  }
}
