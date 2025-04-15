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
import { GameScreen } from '../Models/GameModel';

@Component({
  selector: 'game-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="container">
      <div class="row">
        <div class="col text-center">
          <h1 class="display-6 fw-bold text-body-emphasis my-3">Histeria</h1>

          <div class="card">
            <div class="card-body">
              @if (screenIsMenu()) {
                <game-menu></game-menu>
              }

              @if (screenIsSettings()) {
                <game-settings></game-settings>
              }

              @if (screenIsPlayOrGameOver()) {
                <game-play></game-play>
              }

              @if (screenIsRecords()) {
                <game-records></game-records>
              }
            </div>
          </div>
        </div>
      </div>
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
export class GameView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;

  private readonly cdRef: ChangeDetectorRef;

  public currentScreen: GameScreen;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.gameController = gameController;
    this.cdRef = cdRef;
    this.currentScreen = GameScreen.MENU;
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public screenIsMenu(): boolean {
    return this.screenIs(GameScreen.MENU);
  }

  public screenIsSettings(): boolean {
    return this.screenIs(GameScreen.SETTINGS);
  }

  public screenIsRecords(): boolean {
    return this.screenIs(GameScreen.RECORDS);
  }

  public screenIsPlayOrGameOver(): boolean {
    return this.screenIs(GameScreen.PLAY) || this.screenIs(GameScreen.GAMEOVER);
  }

  public screenIs(screen: GameScreen): boolean {
    return this.currentScreen.localeCompare(screen) === 0;
  }

  public notify(): void {
    const currentScreen: GameScreen = this.gameController.getCurrentScreen();
    if (this.currentScreen.localeCompare(currentScreen) !== 0) {
      this.currentScreen = currentScreen;
      this.cdRef.detectChanges();
      this.debug('Notified.');
    }
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
