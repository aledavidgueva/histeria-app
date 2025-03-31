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
import { GameScreens } from '../Models/GameModel';

@Component({
  selector: 'game-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <h1>Histeria</h1>
    <game-menu *ngIf="screen === 'MAIN_MENU'"></game-menu>
    <game-settings *ngIf="screen === 'MATCH_SETTINGS'"></game-settings>
    <game-play *ngIf="screen === 'PLAY'"></game-play>
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

  public screen: GameScreens;

  private readonly cdRef: ChangeDetectorRef;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.gameController = gameController;
    this.cdRef = cdRef;

    this.screen = this.gameController.getScreen();
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public notify(): void {
    this.screen = this.gameController.getScreen();
    this.cdRef.detectChanges();
    this.log('Notified.');
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}
