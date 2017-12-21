import { Component } from '@angular/core';
import { Channel } from './channel';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  timeCounter = 1;
  counter = 0;
  channel: Channel;
  ngOnInit(): void {
    this.channel = new Channel(1, this.getTimer);

    this.channel.onEdit().subscribe(() => {
      this.check();
    });

    this.start();
  }

  getTimer() {
    return this.timeCounter++;
  }

  check(): void {
    console.log(this.counter++);
  }

  start(): void {
    this.channel.takeTask();
    this.channel.takeTask();
    this.channel.takeTask();
    this.channel.takeTask();
    this.channel.takeTask();
  }
}
