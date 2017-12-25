import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-rejected-tasks',
  templateUrl: './rejected-tasks.component.html',
  styleUrls: ['./rejected-tasks.component.css']
})
export class RejectedTasksComponent implements OnInit {

  @Input()
  rejectedTasks: Array<Task> = [];

  constructor() { }

  ngOnInit() {
  }

}
