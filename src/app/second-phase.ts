import { Subject } from 'rxjs';

import { Phase, Completed } from './typings';
import { Task } from './task';
import { Channel } from './channel';
import { of } from 'rxjs/observable/of';

export class SecondPhase implements Phase {
    private channels: Channel[] = [];
    private completed$: Subject<Completed> = new Subject();

    constructor(channelsCount: number, distributionFunction: any) {
        this.createChannels(channelsCount, distributionFunction);
        this.onChange();
    }

    private createChannels(channelsCount: number, distributionFunction: any): void {
        for (let i = 0; i < channelsCount; i++) {
            this.channels[i] = new Channel(i + 1, distributionFunction);
        }
    }

    public setTask(task: Task): boolean {
        if (this.check(task)) {
            return true;
        } else {
            return false;
        }
    }

    public getCompleted(): Subject<Completed> {
        return this.completed$;
    }

    private check(task: Task): boolean {
        for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i].takeTask(task)) {
                return true;
            }
        }
        return false;
    }

    private onChange(): void {
        for (let i = 0; i < this.channels.length; i++) {
            this.channels[i].onEdit().subscribe((completed: Completed) => {
                this.completed$.next(completed);
            });
        }
    }
}
