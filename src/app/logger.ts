import { Controller } from './controller';

export class Logger {
    static write(text: string): void {
        //console.log(text);
    }

    static newTaskAppeared(
        taskId: string
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Заявка ${taskId} появилась в системе.</div>`
            element.innerHTML += newLog;
            // console.log(`Заявка ${taskId} появилась в системе.`);
        }
    }

    static startProcessingTask(
        taskId: string,
        phaseId: number,
        channelId: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Заявка ${taskId} начала обрабатываться в фазе ${phaseId} каналом ${channelId}.</div>`
            element.innerHTML += newLog;
            // console.log(`Заявка ${taskId} начала обрабатываться в фазе ${phaseId} каналом ${channelId}.`);
        }
    }

    static onCompletedTask(
        phaseId: number,
        channelId: number,
        taskId: string,
        time: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Заявка ${taskId} обработана фазой ${phaseId} каналом ${channelId} за время ${time} ms.</div>`
            element.innerHTML += newLog;
            // console.log(`Заявка ${taskId} обработана фазой ${phaseId} каналом ${channelId} за время ${time}ms.`);
        }
    }

    static addTaskToAccumulator(
        taskId: string,
        phaseId: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Заявка ${taskId} ожидает в очереди ${phaseId} фазы.</div>`
            element.innerHTML += newLog;
            //console.log(`Заявка ${taskId} ожидает в очереди ${phaseId} фазы.`);
        }
    };

    static resultTimeOfProcessingTask(
        time: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Время обработки заявки: ${time}.</div>`
            element.innerHTML += newLog;
            //console.log(`Время обработки заявки: ${time}.`);
        }
    }

    static blockChannel(
        phaseId: number,
        channelId: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Блокировка канала: ${channelId} в ${phaseId} фазе.</div>`
            element.innerHTML += newLog;
            //console.log(`Блокировка канала: ${channelId} в ${phaseId} фазе.`);
        }
    }

    static unblockChannel(
        phaseId: number,
        channelId: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Разблокировка канала: ${channelId} в ${phaseId} фазе.</div>`
            element.innerHTML += newLog;
            //console.log(`Разблокировка канала: ${channelId} в ${phaseId} фазе.`);
        }
    }

    static rejectTask(
        taskId: string,
        phaseId: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Заявка ${taskId} отклонена фазой ${phaseId}.</div>`
            element.innerHTML += newLog;
            //console.log(`Заявка ${taskId} отклонена фазой ${phaseId}.`);
        }
    }

    static successfullyCompletedTask(
        taskId: string,
        phaseId: number
    ): void {
        if (Controller.getState()) {
            let element = document.querySelector('#log');
            let newLog = `<div>Заявка ${taskId} успешно обработана системой.</div>`
            element.innerHTML += newLog;
            // console.log(`Заявка ${taskId} успешно обработана системой.`);
        }
    }
}