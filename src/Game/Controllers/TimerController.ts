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

  public getTimer(): string {
    return this.timerModel.toString();
  }

  public startTimer(): void {
    this.timerModel.start();
  }

  public pauseTimer(): void {
    this.timerModel.pause();
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
