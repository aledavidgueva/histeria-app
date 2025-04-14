import { InjectionToken } from '@angular/core';
import { TimerModel, TimerStatus } from '../Models/TimerModel';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';

export const TIMER_CONTROLLER = new InjectionToken<TimerController>(
  'TimerController',
);

/**
 * Clase de control del timer
 */
export class TimerController implements IObservable {
  private timerModel: TimerModel;

  public constructor(timerModel: TimerModel) {
    this.timerModel = timerModel;
  }

  public getTime(): string {
    const hours: string = this.timerModel.getHours().toString();
    const minutes: string = this.timerModel.getMinutes().toString();
    const seconds: string = this.timerModel.getSeconds().toString();

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }

  public getTimerStatus(): TimerStatus {
    return this.timerModel.getTimerStatus();
  }

  public addObserver(observer: IObserver): void {
    this.timerModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.timerModel.removeObserver(observer);
  }
}
