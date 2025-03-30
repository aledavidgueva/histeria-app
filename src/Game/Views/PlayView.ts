import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';
import { IObserver } from '../Utils/IObserver';
import { Match } from '../Utils/Match';

@Component({
  selector: 'game-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <h1>Jugando</h1>

    <h2>Jugador: {{ player }}</h2>

    <h3>Tiempo: <game-timer></game-timer></h3>

    <game-board></game-board>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PlayView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;

  private readonly cdRef: ChangeDetectorRef;

  private match: Match | null = null;

  public player: string;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.player = '';
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public notify(): void {
    this.cdRef.detectChanges();
    this.log('Notified.');
  }

  private log(...message: string[]) {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}
