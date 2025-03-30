import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import {
  TIMER_CONTROLLER,
  TimerController,
} from '../Controllers/TimerController';

@Component({
  selector: 'game-timer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div (click)="toogleTimerStatus()">
      {{ timer }}
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TimerView implements IObserver, OnInit, OnDestroy {
  private readonly timerController: TimerController;
  private readonly cdRef: ChangeDetectorRef;

  public timer: string;

  public constructor(
    @Inject(TIMER_CONTROLLER) timerController: TimerController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.timerController = timerController;
    this.timer = '';
  }

  public toogleTimerStatus(): void {
    const timerStatus = this.timerController.getTimerStatus();
    if (timerStatus === 'RUNNING') {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  public startTimer(): void {
    this.timerController.startTimer();
  }

  public pauseTimer(): void {
    this.timerController.pauseTimer();
  }

  public getTimerStatus(): string {
    return this.timerController.getTimer();
  }

  public ngOnInit(): void {
    this.timerController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.timerController.removeObserver(this);
  }

  public notify(): void {
    this.timer = this.timerController.getTimer();
    this.cdRef.detectChanges();
    this.log('Notified.');
  }

  private log(...message: string[]) {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}
