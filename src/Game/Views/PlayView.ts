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
import { GameScreen } from '../Models/GameModel';

@Component({
  selector: 'game-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <p class="mb-0">
      <small>JUGANDO | Nivel {{ difficulty }}</small>
    </p>
    <h2><{{ player }}></h2>

    <div class="col-12 col-md-6 mx-auto">
      <div class="row">
        <div class="col-6">
          <p class="mb-0"><small>Turnos</small></p>
          <game-moves></game-moves>
        </div>
        <div class="col-6">
          <p class="mb-0"><small>Tiempo</small></p>
          <game-timer></game-timer>
        </div>
      </div>
    </div>

    <div class="position-relative">
      <game-board></game-board>
      @if (isGameOver()) {
        <div id="backdrop"></div>
        <div id="winner" class="animate__animated animate__heartBeat">
          <div class="card shadow">
            <div class="card-header">¡Ganaste!</div>
            <div class="card-body">
              <p class="mb-1">
                <small class="text-muted">FELICITACIONES</small>
              </p>
              <h5 class="card-title">{{ player }}</h5>
              <hr />
              <p>Dificultad: {{ difficulty }}</p>
              <p>Turnos: <game-moves></game-moves></p>
              <p>Tiempo: <game-timer></game-timer></p>
              <button
                class="btn btn-primary mt-3"
                (click)="goToRecordsScreen()"
              >
                Ver records
              </button>
            </div>
          </div>
        </div>
      }
    </div>

    <div class="mt-4 col-12 col-md-6 mx-auto">
      <div class="d-flex justify-content-around">
        <button
          class="btn btn-secondary"
          (click)="goToMenu()"
          [disabled]="!isPlaying()"
        >
          Salir
        </button>
        <button
          class="btn btn-outline-primary"
          (click)="getHelp()"
          [disabled]="!isPlaying()"
        >
          Ayuda
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      #backdrop {
        position: absolute;
        z-index: 45;
        display: block;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
      }

      #winner {
        position: absolute;
        z-index: 50;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
      }
    `,
  ],
})
export class PlayView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;

  private readonly cdRef: ChangeDetectorRef;

  public player: string;

  public difficulty: string;

  public currentScreen: GameScreen;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.player = '';
    this.currentScreen = GameScreen.MENU;
    this.difficulty = '';
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public goToMenu(): void {
    this.gameController.goToMenuScreen();
  }

  public getHelp(): void {
    this.gameController.getHelp();
  }

  public isPlaying(): boolean {
    return this.currentScreen === GameScreen.PLAY;
  }

  public isGameOver(): boolean {
    return this.currentScreen === GameScreen.GAMEOVER;
  }

  public goToRecordsScreen(): void {
    this.gameController.goToRecordsScreen();
  }

  public notify(): void {
    if (!this.gameController.hasMatch()) return;
    this.currentScreen = this.gameController.getCurrentScreen();
    this.difficulty = this.gameController.getMatchDifficultyLevel();
    const player: string = this.gameController.getPlayer();
    if (player.localeCompare(this.player) !== 0) {
      this.player = player;
    }
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
