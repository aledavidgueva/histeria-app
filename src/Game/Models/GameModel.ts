import { InjectionToken } from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';
import { GameSettings } from '../Utils/GeneralSettings';
import { Color } from '../Utils/Color';
import { Square } from '../Utils/Square';
import { Board } from '../Utils/Board';
import { MatchModel } from './MatchModel';
import { MatchRecord } from '../Utils/MatchRecord';

export const GAME_MODEL = new InjectionToken<GameModel>('GameModel');

export enum GameScreen {
  MENU = 'MENU',
  SETTINGS = 'SETTINGS',
  PLAY = 'PLAY',
  GAMEOVER = 'GAMEOVER',
  RECORDS = 'RECORDS',
}

/**
 * Clase de lógica de negocio del juego
 */
export class GameModel implements IObservable {
  private observers: Array<IObserver>;

  private gameSettings: GameSettings;

  private match: MatchModel | null;

  private records: Array<MatchRecord>;

  private currentScreen: GameScreen;

  public constructor(gameSettings: GameSettings) {
    this.observers = new Array<IObserver>();
    this.gameSettings = gameSettings;
    this.match = null;
    this.currentScreen = GameScreen.MENU;
    this.records = new Array<MatchRecord>();
  }

  public getCurrentScreen() {
    return this.currentScreen;
  }

  public goToMenuScreen(): void {
    this.leaveMatch();
    this.setCurrentScreen(GameScreen.MENU);
  }

  public goToSettingsScreen(): void {
    this.leaveMatch();
    this.setCurrentScreen(GameScreen.SETTINGS);
  }

  public goToRecordsScreen(): void {
    this.leaveMatch();
    this.setCurrentScreen(GameScreen.RECORDS);
  }

  private setCurrentScreen(screen: GameScreen) {
    this.currentScreen = screen;
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
    if (this.match !== null) {
      throw new GameModelRuntimeException('Ya hay una partida en curso.');
    }

    const board = new Board(columns, rows, colors);
    const match = new MatchModel(player, board);
    this.log('Iniciando nueva partida...', match.toString());
    this.match = match;
    this.currentScreen = GameScreen.PLAY;
    this.match.getTimer().start();
    this.notifyObservers();
  }

  /**
   * Elimina la partida actual
   */
  public resetMatch(): void {
    this.match = null;
  }

  /**
   * Abandonar partida en curso, si es que la hay
   */
  private leaveMatch(): void {
    this.match = null;
    this.notifyObservers();
  }

  public getGameSettings(): GameSettings {
    return this.gameSettings;
  }

  public hasMatch(): boolean {
    return this.match !== null;
  }

  public getMatch(): MatchModel {
    if (!this.match)
      throw new GameModelRuntimeException('No hay partida en curso.');

    return this.match;
  }

  public getSquare(column: number, row: number): Square {
    const match: MatchModel = this.getMatch();
    const square = match.getBoard().getSquare(column, row);
    if (!square)
      throw new GameModelRuntimeException(
        'Las coordenadas no apuntan a ninguna casilla válida.',
      );

    return square;
  }

  /**
   * Setear color en casilla.
   * Verificar estado particular de la casilla seleccionada y sus vecinas.
   * Detección de estado general del juego.
   */
  public setColorForSquareAndCheck(column: number, row: number): void {
    if (this.hasWinner()) {
      throw new GameModelRuntimeException('La partida ya finalizó');
    }
    //
    const square: Square = this.getSquare(column, row);
    this.setColorForSquare(square);
    this.getMatch().addMove();
    //
    if (this.hasNeighborsSameColor(square)) {
      this.resetColorOfSquareAndNeighbors(square);
    }
    // Si gano, detener
    if (this.hasWinner()) {
      this.getMatch().getTimer().pause();
      this.currentScreen = GameScreen.GAMEOVER;
    }

    this.notifyObservers();
  }

  /**
   * Setear color random en la casilla
   */
  private setColorForSquare(square: Square): void {
    const squareColor = this.getRandomColor(square.getColor());
    square.setColor(squareColor);
  }

  /**
   * Obtener un color aleatorio de parte de la lista de colores disponible
   * en función de la cantidad de colores que se juegan en la partida actual
   * Opcionalmente se puede indicar la exclusión de un color en el sorteo
   */
  private getRandomColor(excludedColor: Color | null): Color {
    // Obtener lista desordenada de colores disponibles, para más entropía
    const colorList = this.getMatchColorList().sort(() => Math.random() - 0.5);

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
    return this.gameSettings.getPartialColorList(
      this.getMatch().getBoard().getColors(),
    );
  }

  /**
   * Compara el color de la casilla con el de sus vecinos y retorna verdadero si existe al menos uno con el mismo color.
   */
  private hasNeighborsSameColor(square: Square): boolean {
    const color: Color | null = square.getColor();
    if (color === null) {
      throw new GameModelRuntimeException(
        `Error inesperado en la casilla ${square}.`,
      );
    }
    //
    const match: MatchModel = this.getMatch();
    const board: Board = match.getBoard();
    // Vecinos
    const top: Square | null = board.getTopSquareOf(
      square.getColumn(),
      square.getRow(),
    );
    const bottom: Square | null = board.getBottomSquareOf(
      square.getColumn(),
      square.getRow(),
    );
    const left: Square | null = board.getLeftSquareOf(
      square.getColumn(),
      square.getRow(),
    );
    const right: Square | null = board.getRightSquareOf(
      square.getColumn(),
      square.getRow(),
    );
    // Comparación de color
    return (
      (top !== null && color.isEquals(top.getColor())) ||
      (bottom !== null && color.isEquals(bottom.getColor())) ||
      (left !== null && color.isEquals(left.getColor())) ||
      (right !== null && color.isEquals(right.getColor()))
    );
  }

  /**
   * Reinicia el color de una casilla y la de sus vecinas
   */
  private resetColorOfSquareAndNeighbors(square: Square): void {
    const match: MatchModel = this.getMatch();
    const board: Board = match.getBoard();
    square.resetColor();
    // Reiniciar vecinos, si existen
    board.getTopSquareOf(square.getColumn(), square.getRow())?.resetColor();
    board.getBottomSquareOf(square.getColumn(), square.getRow())?.resetColor();
    board.getLeftSquareOf(square.getColumn(), square.getRow())?.resetColor();
    board.getRightSquareOf(square.getColumn(), square.getRow())?.resetColor();
  }

  /**
   * Verificar si ganó
   */
  public hasWinner(): boolean {
    const match: MatchModel = this.getMatch();
    const board: Board = match.getBoard();
    let ret = true;
    for (let column: number = 0; column < board.getColumns(); column++) {
      for (let row: number = 0; row < board.getRows(); row++) {
        const square: Square = this.getSquare(column, row);
        ret =
          ret &&
          square.getColor() !== null &&
          !this.hasNeighborsSameColor(square);
      }
    }
    return ret;
  }

  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
    observer.notify();
    this.debug(`Observer ${observer.constructor.name} agregado.`);
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(
      (current: IObserver) => current !== observer,
    );
    this.debug(`Observer ${observer.constructor.name} removido.`);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.notify();
      this.debug(`Observer ${observer.constructor.name} notificado.`);
    }
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}

export class GameModelException extends Error {}
export class GameModelRuntimeException extends GameModelException {}
