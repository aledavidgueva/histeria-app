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

@Component({
  selector: 'game-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <h1>Jugando - Pantalla: {{ currentScreen }}</h1>

    <h2>Jugador: {{ player }}</h2>

    <h3>Movimientos: <game-moves></game-moves></h3>
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

  public player: string;

  public currentScreen: string;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.player = '';
    this.currentScreen = '';
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public notify(): void {
    const player: string = this.gameController.getPlayer();
    this.currentScreen = this.gameController.getCurrentScreen();
    if (player.localeCompare(this.player) !== 0) {
      this.player = player;
    }
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
