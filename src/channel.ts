export class Channel {
    private id: number;
    private status: ChannelStatus;
    private channelDistributionFunction: any;
    private totalProcessingTime: number;
    private processedTasksNumber: number;

    constructor(id: number, channelDistributionFunction: any) {
        this.id = id;
        this.channelDistributionFunction = channelDistributionFunction;
        this.status = ChannelStatus.EMPTY;
        this.processedTasksNumber = 0;
        this.totalProcessingTime = 0;
    }

    getID() { return this.id; }
    getStatus() { return this.status; }
    getProcessedTasksNumber() { return this.processedTasksNumber; }
    getTotalProcessingTime() { return this.totalProcessingTime; }

    setStatus(newStatus: ChannelStatus) {
        this.status = newStatus;
    }

    takeTask() {
        if (this.status === ChannelStatus.EMPTY) {

            let processingTime;
            this.status = ChannelStatus.SERVICE;
            const that = this;
            this.totalProcessingTime += (processingTime = this.channelDistributionFunction());
            setTimeout(function () {
                that.status = 0;
                return that.processedTasksNumber++;
            }
                , processingTime);
            return true;
        }
        return false;
    }
}
export enum ChannelStatus {
    EMPTY,
    BLOCK,
    SERVICE
}