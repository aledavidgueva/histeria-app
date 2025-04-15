import { InjectionToken } from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';

export const TIMER_MODEL = new InjectionToken<TimerModel>('TimerModel');

export type TimerStatus = 'PAUSED' | 'RUNNING';

/**
 * Clase de lógica de negocio del temporizador
 */
export class TimerModel implements IObservable {
  private observers: Array<IObserver>;

  private seconds: number;
  private minutes: number;
  private hours: number;

  private timerStatus: TimerStatus;

  public constructor(
    seconds: number = 0,
    minutes: number = 0,
    hours: number = 0,
  ) {
    this.observers = new Array<IObserver>();
    this.timerStatus = 'PAUSED';
    this.seconds = seconds;
    this.minutes = minutes;
    this.hours = hours;
  }

  public reset(): void {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

  public start(): void {
    if (this.timerStatus === 'RUNNING') return;

    this.timerStatus = 'RUNNING';
    this.waitAndRun();
    this.notifyObservers();
    this.debug('Timer iniciado.');
  }

  public pause(): void {
    if (this.timerStatus === 'PAUSED') return;

    this.timerStatus = 'PAUSED';
    this.notifyObservers();
    this.debug('Timer pausado.');
  }

  public getTimerStatus(): TimerStatus {
    return this.timerStatus;
  }

  private waitAndRun(): void {
    setTimeout(() => this.tick(), 1000);
  }

  private tick(): void {
    if (this.timerStatus === 'RUNNING') {
      this.seconds++;
      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes++;
        if (this.minutes >= 60) {
          this.minutes = 0;
          this.hours++;
        }
      }
      this.waitAndRun();
      this.notifyObservers();
    }
  }

  public getHours(): number {
    return this.hours;
  }

  public getMinutes(): number {
    return this.minutes;
  }

  public getSeconds(): number {
    return this.seconds;
  }

  public toString(): string {
    return `${this.getHours()} Hs. ${this.getMinutes()} mins. ${this.getSeconds()} seg.`;
  }

  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
    observer.notify();
    this.debug(`Observer ${observer.constructor.name} agregado.`);
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(
      (current: IObserver) => current !== observer,
    );
    this.debug(`Observer ${observer.constructor.name} removido.`);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.notify();
      this.debug(`Observer ${observer.constructor.name} notificado.`);
    }
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
