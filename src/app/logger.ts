export class Logger {
    static write(text: string): void {
        console.log(text);
    }

    static newTaskAppeared(
        taskId: string
    ): void {
        console.log(`Заявка ${taskId} появилась в системе.`);
    }

    static startProcessingTask(
        taskId: string,
        phaseId: number,
        channelId: number
    ): void {
        console.log(`Заявка ${taskId} начала обрабатываться в фазе ${phaseId} каналом ${channelId}.`);
    }

    static OnCompletedTask(
        phaseId: number,
        channelId: number,
        taskId: string,
        time: number
    ): void {
        console.log(`Заявка ${taskId} обработана фазой ${phaseId} каналом ${channelId} за время ${time}ms.`);
    }

    static resultTimeOfProcessingTask(
        time: number
    ): void {
        console.log(`Время обработки заявки: ${time}.`);
    }

    static rejectTask(
        taskId: string,
        phaseId: number
    ): void {
        console.log(`Заявка ${taskId} отклонена фазой ${phaseId}.`);
    }

    static successfullyCompletedTask(
        taskId: string,
        phaseId: number
    ): void {
        console.log(`Заявка ${taskId} успешно обработана системой.`);
    }
}