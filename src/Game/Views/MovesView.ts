import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';

@Component({
  selector: 'game-moves',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <span>
      {{ moves | number: '1.0' }}
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class MovesView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;
  private readonly cdRef: ChangeDetectorRef;

  public moves: number;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.moves = 0;
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public notify(): void {
    this.moves = this.gameController.getMoves();
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
