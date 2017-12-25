import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-source-tasks',
  templateUrl: './source-tasks.component.html',
  styleUrls: ['./source-tasks.component.css']
})
export class SourceTasksComponent implements OnInit {

  @Input()
  tasks: Array<Task> = [];

  constructor() { }

  ngOnInit() {
  }
}
