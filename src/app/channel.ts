import { Subject } from 'rxjs/Subject';
import { Completed, ChannelStatus } from './typings';
import { Task } from './task';
import { Observable } from 'rxjs';

export class Channel {
    private id: number;
    private status: ChannelStatus;
    private channelDistributionFunction: any;
    private task: Task;
    private onEdit$: Subject<Completed> = new Subject();

    constructor(id: number, distributionFunction: any) {
        this.id = id;
        this.channelDistributionFunction = distributionFunction;
        this.status = ChannelStatus.EMPTY;
    }

    public getID() { return this.id; }
    public getStatus() { return this.status; }
    
    public setStatus(newStatus: ChannelStatus) {
        this.status = newStatus;
    }

    public takeTask(task: Task) {
        if (this.status === ChannelStatus.EMPTY) {
            this.task = task;
            let processingTime = 0;
            this.status = ChannelStatus.SERVICE;

            processingTime = this.channelDistributionFunction() * 10;
            let timer = Observable.timer(processingTime).subscribe(()=>{
                this.status = ChannelStatus.EMPTY;
                this.task = null;
                const completed: Completed = {
                    task: task,
                    idChannel: this.id,
                    timeInChannel: processingTime
                };
                this.onEdit$.next(completed);
                timer.unsubscribe();
            });
            return true;
        }
        return false;
    }

    public onEdit(): Subject<Completed> {
        return this.onEdit$;
    }
}
