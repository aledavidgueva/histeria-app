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
    <div>
      {{ time }}
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

  public time: string;

  public constructor(
    @Inject(TIMER_CONTROLLER) timerController: TimerController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.timerController = timerController;
    this.time = '';
  }

  public ngOnInit(): void {
    this.timerController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.timerController.removeObserver(this);
  }

  public notify(): void {
    this.time = this.timerController.getTime();
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
