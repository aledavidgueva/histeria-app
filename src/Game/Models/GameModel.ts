import { InjectionToken } from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';
import { GameSettings } from '../Utils/GeneralSettings';
import { Match } from '../Utils/Match';
import { TimerModel } from './TimerModel';
import { BoardModel } from './BoardModel';

export const GAME_MODEL = new InjectionToken<GameModel>('GameModel');

export type GameScreens = 'MAIN_MENU' | 'MATCH_SETTINGS' | 'PLAY' | 'RECORDS';

/**
 * Clase de lógica de negocio del juego
 */
export class GameModel implements IObservable {
  private observers: Array<IObserver>;

  private gameSettings: GameSettings;

  private currentScreen: GameScreens;

  private match: Match | null;

  public constructor(gameSettings: GameSettings) {
    this.observers = new Array<IObserver>();
    this.gameSettings = gameSettings;
    this.match = null;
    this.currentScreen = 'MAIN_MENU';
  }

  public waitUserChoiseOption() {
    this.currentScreen = 'MAIN_MENU';
    this.notifyObservers();
  }

  public waitNewMatchSettings() {
    this.currentScreen = 'MATCH_SETTINGS';
    this.notifyObservers();
  }

  /**
   * Iniciar una nueva partida
   */
  public startNewMatch(
    player: string,
    columns: number,
    rows: number,
    colors: number,
  ): void {
    const timer = new TimerModel();
    const board = new BoardModel(columns, rows, colors);
    const match = new Match(player, timer, board);
    this.log('Iniciando nueva partida...', match.toString());
    this.match = match;
    this.currentScreen = 'PLAY';
    timer.start();
    this.notifyObservers();
  }

  public startGame() {
    this.log('Iniciando juego...');
    this.currentScreen = 'PLAY';
    this.notifyObservers();
  }

  public getScreen(): GameScreens {
    return this.currentScreen;
  }

  public getGameSettings(): GameSettings {
    return this.gameSettings;
  }

  public getMatch(): Match | null {
    return this.match;
  }

  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
    observer.notify();
    this.log(`Observer ${observer.constructor.name} agregado.`);
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(
      (current: IObserver) => current !== observer,
    );
    this.log(`Observer ${observer.constructor.name} removido.`);
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.notify();
      this.log(`Observer ${observer.constructor.name} notificado.`);
    }
  }

  private log(...message: string[]) {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}
