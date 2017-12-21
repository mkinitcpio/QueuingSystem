import { Channel } from "./channel";
import { Subject } from 'rxjs';

class App {
    timeCounter = 1;
    counter: number = 0;

    getTimer() {
        return this.timeCounter++;
    }

    check(): void {
        console.log(this.counter++);
    }

    start(): void {
        let channel: Channel = new Channel(1, this.getTimer);
        channel.takeTask();
        // channel.onEdit().subscribe(() => {
        //     this.check();
        // })
    }
}