import { InjectionToken } from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';
import { GameSettings } from '../Utils/GeneralSettings';
import { Match } from '../Utils/Match';
import { TimerModel } from './TimerModel';
import { BoardModel } from './BoardModel';
import { Color } from '../Utils/Color';

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

  /**
   * Setear color en casilla.
   * Esto luego dispara evento de control de estado del juego.
   */
  public setColorForSquare(column: number, row: number): void {
    if (!this.match)
      throw new GameModelRuntimeException('No hay partida en curso.');

    const square = this.match.getBoard().getSquare(column, row);
    if (!square)
      throw new GameModelRuntimeException(
        'Las coordenadas no apuntan a ninguna casilla válida.',
      );

    const squareColor = this.getRandomColor(square.getColor());
    square.setColor(squareColor);

    this.notifyObservers();
  }

  /**
   * Obtener un color aleatorio de parte de la lista de colores disponible
   * en función de la cantidad de colores que se juegan en la partida actual
   * Opcionalmente se puede indicar la exclusión de un color en el sorteo
   */
  private getRandomColor(excludedColor: Color | null): Color {
    const colorList = this.getMatchColorList();

    let color: Color | null = null;
    do {
      color = colorList[Math.floor(Math.random() * colorList.length)]!;
    } while (excludedColor && excludedColor.isEquals(color));

    if (!color)
      throw new GameModelRuntimeException(
        'Error inesperado en el randomizador de colores.',
      );

    return color;
  }

  private getMatchColorList(): Array<Color> {
    if (!this.match)
      throw new GameModelRuntimeException('No hay partida en curso.');

    return this.gameSettings.getPartialColorList(
      this.match.getBoard().getColors(),
    );
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

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}

export class GameModelException extends Error {}
export class GameModelRuntimeException extends GameModelException {}
