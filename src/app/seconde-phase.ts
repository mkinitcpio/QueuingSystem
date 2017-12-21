import { Task } from './task';
import { Subject } from 'rxjs';

export class SecondPhase implements Phase {
    check(): void {
        throw new Error("Method not implemented.");
    }
    setTast(task: Task): void {
        throw new Error("Method not implemented.");
    }
    onEdit(): Subject<any> {
        throw new Error("Method not implemented.");
    }
    getChannelDistributionFunction(intensity: number) {
        throw new Error("Method not implemented.");
    }

}

export interface Phase {
    check(): void;
    setTast(task: Task): void;
    onEdit(): Subject<any>;
    getChannelDistributionFunction(intensity: number);
}
