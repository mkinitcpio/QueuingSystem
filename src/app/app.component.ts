import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Channel } from './channel';
import { SecondPhase } from './second-phase';
import { Phase, Completed } from './typings';
import { Task } from './task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private secondPhase: Phase = new SecondPhase(2, this.getTime);

  private firstTask: Task = new Task('1');
  private secondTask: Task = new Task('2');
  private thirdTask: Task = new Task('3');

  ngOnInit(): void {
    if (this.secondPhase.setTask(this.firstTask)) {
      console.log('First Ok');
    } else {
      console.log('First BAD');
    }
    if (this.secondPhase.setTask(this.secondTask)) {
      console.log('Second Ok');
    } else {
      console.log('Second BAD');
    }
    if (this.secondPhase.setTask(this.thirdTask)) {
      console.log('Third Ok');
    } else {
      console.log('Third BAD');
    }

    this.secondPhase.getCompleted().subscribe((completed: Completed) => {
      this.log(completed);
    });
  }

  private getTime(): number {
    return 5000;
  }

  private log(completed: Completed) {
    console.log(completed.idChannel, completed.task.getID());
  }
}
