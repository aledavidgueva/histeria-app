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
  MATCH_CONTROLLER,
  MatchController,
} from '../Controllers/MatchController';

@Component({
  selector: 'game-moves',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div>
      {{ moves | number: '1.0' }}
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
export class MovesView implements IObserver, OnInit, OnDestroy {
  private readonly matchController: MatchController;
  private readonly cdRef: ChangeDetectorRef;

  public moves: number;

  public constructor(
    @Inject(MATCH_CONTROLLER) matchController: MatchController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.matchController = matchController;
    this.moves = 0;
  }

  public ngOnInit(): void {
    this.matchController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.matchController.removeObserver(this);
  }

  public notify(): void {
    this.moves = this.matchController.getMoves();
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
