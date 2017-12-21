import { Subject } from 'rxjs/Subject';

export class Channel {
    private id: number;
    private status: ChannelStatus;
    private channelDistributionFunction: any;

    private onEdit$: Subject<any> = new Subject();

    constructor(id: number, channelDistributionFunction: any) {
        this.id = id;
        this.channelDistributionFunction = channelDistributionFunction;
        this.status = ChannelStatus.EMPTY;
    }

    getID() { return this.id; }
    getStatus() { return this.status; }

    setStatus(newStatus: ChannelStatus) {
        this.status = newStatus;
    }

    takeTask() {
        if (this.status === ChannelStatus.EMPTY) {

            let processingTime = 0;
            this.status = ChannelStatus.SERVICE;
            const that = this;

            console.log(processingTime);
            console.log(this.channelDistributionFunction);
            console.log(this.channelDistributionFunction());

            processingTime = this.channelDistributionFunction();
            setTimeout(function () {
                that.status = 0;
                that.onEdit$.next(true);

                console.log(this.totalProcessingTime);
            }
                , processingTime);
            this.status = ChannelStatus.EMPTY;
            return true;
        }
        return false;
    }

    onEdit(): Subject<any> {
        return this.onEdit$;
    }
}

export enum ChannelStatus {
    EMPTY,
    BLOCK,
    SERVICE
}
