import { InjectionToken } from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';
import { GameSettings } from '../Utils/GeneralSettings';
import { Color } from '../Utils/Color';
import { Square } from '../Utils/Square';
import { Board } from '../Utils/Board';
import { Match } from '../Utils/Match';
import { MatchRecord } from '../Utils/MatchRecord';
import { Coordinate } from '../Utils/Coordinate';
import { MatchRecordsStorage } from '../Utils/Storage';
import { TimerModel } from './TimerModel';

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

  private match: Match | null;

  public static GameDifficultyLevels: Array<string> = [
    'Principiante',
    'Muy Fácil',
    'Fácil',
    'Normal',
    'Medio',
    'Moderado',
    'Intermedio',
    'Aceptable',
    'Estándar',
    'Competente',
    'Desafiante',
    'Difícil',
    'Avanzado',
    'Experto',
    'Maestro',
    'Veterano',
    'Élite',
    'Extremo',
    'Pesadilla',
    'Infernal',
    'Implacable',
    'Brutal',
    'Imposible',
  ];

  private currentScreen: GameScreen;

  private matchRecordsStorage: MatchRecordsStorage;

  public constructor(gameSettings: GameSettings) {
    this.observers = new Array<IObserver>();
    this.gameSettings = gameSettings;
    this.match = null;
    this.currentScreen = GameScreen.MENU;
    this.matchRecordsStorage = new MatchRecordsStorage();
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
    const match = new Match(player, board);
    this.debug('Iniciando nueva partida...', match.toString());
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
    if (this.match) {
      this.match.getTimer().pause();
      this.match = null;
    }
  }

  public getGameSettings(): GameSettings {
    return this.gameSettings;
  }

  public hasMatch(): boolean {
    return this.match !== null;
  }

  public getMatch(): Match {
    if (!this.match)
      throw new GameModelRuntimeException('No hay partida en curso.');

    return this.match;
  }

  public getSquare(column: number, row: number): Square {
    const match: Match = this.getMatch();
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
    const match: Match = this.getMatch();
    const square: Square = this.getSquare(column, row);
    this.setColorForSquare(square);
    match.addMove();
    //
    if (this.hasNeighborsSameColor(square)) {
      this.resetColorOfSquareAndNeighbors(square);
    }
    // Si gano, detener
    if (this.hasWinner()) {
      const timer: TimerModel = match.getTimer();
      const board: Board = match.getBoard();
      timer.pause();
      this.currentScreen = GameScreen.GAMEOVER;
      // Guardar record
      this.saveMatchRecord(
        new MatchRecord(
          match.getPlayer(),
          match.getMoves(),
          `${timer.getHours()}:${timer.getMinutes()}:${timer.getSeconds()}`,
          board.getColumns(),
          board.getRows(),
          board.getColors(),
        ),
      );
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

  /**
   * Obtener una lista parcial del listado de colores disponible
   */
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
    const match: Match = this.getMatch();
    const board: Board = match.getBoard();
    const position: Coordinate = square.getCoordinate();
    // Vecinos
    const top: Square | null = board.getTopSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    const bottom: Square | null = board.getBottomSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    const left: Square | null = board.getLeftSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    const right: Square | null = board.getRightSquareOf(
      position.getColumn(),
      position.getRow(),
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
    const match: Match = this.getMatch();
    const board: Board = match.getBoard();
    const position: Coordinate = square.getCoordinate();
    square.resetColor();
    // Reiniciar vecinos, si existen
    board.getTopSquareOf(position.getColumn(), position.getRow())?.resetColor();
    board
      .getBottomSquareOf(position.getColumn(), position.getRow())
      ?.resetColor();
    board
      .getLeftSquareOf(position.getColumn(), position.getRow())
      ?.resetColor();
    board
      .getRightSquareOf(position.getColumn(), position.getRow())
      ?.resetColor();
  }

  /**
   * Verificar si ganó
   */
  public hasWinner(): boolean {
    const board: Board = this.getMatch().getBoard();
    let ret = true;
    // Recorrer tablero
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

  /**
   * Obtener la probabilidad de mala suerte en base a cantidad de colores y cantidad de casillas vecinas con color.
   * El cálculo es sin fórmula, sino que arma la tabla de posibles combinaciones para hallar la probabilidad de mala suerte
   * @todo Pasar a modelo matemático para incrementar performance.
   */
  public calcMischance(colors: number, squares: number = 4) {
    if (squares < 1 || squares > 4)
      throw new GameModelRuntimeException('Error inesperado de argumento');

    const posibilities: number = colors ** (squares + 1);
    let digits: Array<number> = new Array(squares + 1).fill(0);
    let matches: number = 0;

    for (let i = 0; i < posibilities; i++) {
      let match = false;
      for (let d = 1; d < digits.length; d++) {
        match = match || digits[0] === digits[d];
      }
      if (match) matches++;
      digits[0]!++;
      for (let d = 0; d < digits.length; d++) {
        if (digits[d]! >= colors) {
          digits[d] = 0;
          if (d + 1 < digits.length) digits[d + 1]!++;
        }
      }
    }

    this.debug('Mala suerte:', matches.toString(), posibilities.toString());

    return matches / posibilities;
  }

  /**
   * Calcula la dicultad aproximando valores de combinaciones de dificultad del juego a un texto más humano
   * A mayor cantidad de casillas (c*r) y menor cantidad de colores, mayor dificultad
   * Al no ser proporciona, para obtener un numero que vaya de menor a mayor utilizo complemento de cantidad de colores (o invierto)
   */
  public getDifficultyLevel(
    colors: number,
    columns: number,
    rows: number,
  ): string {
    const levels: Array<string> = this.gameSettings.getLevels();

    const levelIndex: number = this.mapValueToRange(
      this.getLevel(colors, columns, rows),
      this.getMinLevel(),
      this.getMaxLevel(),
      0,
      levels.length - 1,
    );

    return levels[levelIndex]!;
  }

  /**
   * Level actual - (hago complemento para encontrar un numero entre min y max)
   */
  private getLevel(colors: number, columns: number, rows: number): number {
    return (
      columns *
      rows *
      this.calcComplement(
        this.gameSettings.getMinColors(),
        this.gameSettings.getMaxColors(),
        colors,
      )
    );
  }

  /**
   * Min level - Menor dificultad cuanto menos casillas y mayor cantidad de colores (hago complemento para obtener numero bajo)
   */
  private getMinLevel(): number {
    return (
      this.gameSettings.getMinColumns() *
      this.gameSettings.getMinRows() *
      this.calcComplement(
        this.gameSettings.getMinColors(),
        this.gameSettings.getMaxColors(),
        this.gameSettings.getMaxColors(),
      )
    );
  }

  /**
   * Max level - Mayor dificultad cuanto más casillas y menor cantidad de colores (hago complemento para obtener numero alto)
   */
  private getMaxLevel(): number {
    return (
      this.gameSettings.getMaxColumns() *
      this.gameSettings.getMaxRows() *
      this.calcComplement(
        this.gameSettings.getMinColors(),
        this.gameSettings.getMaxColors(),
        this.gameSettings.getMinColors(),
      )
    );
  }

  /**
   * Calcular complemento
   * Ej. Si un número va de 5 a 14 y el valor actual es 9, entonces el complemento es 10. Si es 14 => 5.
   */
  private calcComplement(min: number, max: number, value: number): number {
    return min + max - value;
  }

  /**
   * Cálculo de interpolación lineal. Esto se basa en la relación proporcional entre dos rangos de números.
   * Esto es útil para compatibilizar el rango de dificultades numéricas con el rango de dificultades descripto con palabras
   */
  private mapValueToRange(
    value: number, // Número en rango A
    aMin: number, // Rango A
    aMax: number,
    bMin: number, // Rango B
    bMax: number,
  ): number {
    if (value < aMin || value > aMax)
      throw new GameModelRuntimeException(
        `Número fuera de rango: value<${value}> A<${aMin},${aMax}> B<${bMin},${bMax}>`,
      );

    return Math.round(bMin + ((value - aMin) * (bMax - bMin)) / (aMax - aMin));
  }

  public resetHelp(): void {
    const match: Match = this.getMatch();
    match.setSuggestedSquare(null);
    this.notifyObservers();
  }

  /**
   * De forma simple recomienda una posición de alguna de las disponibles asumiendo que la mejor opción es aquella
   * que tiene menor cantidad de vecinos con los cuales tener conflictos
   * Recorro tablero, almaceno posibles candidatos en un mapa, luego sorteo alguna de las mejores opciones
   * @todo Hacer que la recomendación sea distinta a la anterior revisando que se recomendó antes.
   */
  public getHelp(): void {
    if (this.hasWinner())
      throw new GameModelRuntimeException('La partida ya finalizó');

    const minNeighbors: number = 1;
    const maxNeighbors: number = 4;
    const match: Match = this.getMatch();
    const board: Board = match.getBoard();
    // Inicializar mapa - clave vecinos libres, valor lista de coordenadas
    const freeMap: Map<number, Array<Coordinate>> = new Map();
    for (let i = minNeighbors; i <= maxNeighbors; i++)
      freeMap.set(i, new Array());

    // Recorrer tablero
    for (let column: number = 0; column < board.getColumns(); column++) {
      for (let row: number = 0; row < board.getRows(); row++) {
        const square: Square = this.getSquare(column, row);
        // Solo los vacios
        if (square.getColor() === null) {
          const position: Coordinate = square.getCoordinate();
          // Vecinos - solo suman si no existen (bordes) o si no tienen color
          const free = this.getFreeNeighbors(position);
          if (free > 0) {
            freeMap.get(free)!.push(position);
          }
        }
      }
    }

    // Ahora en este punto, elijo alguno de las mejores posibilidades.
    let candidate: Coordinate | null = null;
    for (let i = maxNeighbors; i >= minNeighbors; i--) {
      const list = freeMap.get(i)!;
      if (candidate === null && list.length > 0) {
        // Sortear un valor de la lista
        candidate = list[Math.floor(Math.random() * list.length)]!;
      }
    }

    match.setSuggestedSquare(candidate);
    this.notifyObservers();
  }

  /**
   * Obtener la cantidad de vecinos libres o sin conflicto
   */
  private getFreeNeighbors(position: Coordinate): number {
    const board: Board = this.getMatch().getBoard();
    let free = 0;
    // Vecinos - solo suman si no existen (bordes) o si no tienen color
    const top: Square | null = board.getTopSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    //
    if (top === null || top.getColor() === null) free++;
    const bottom: Square | null = board.getBottomSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    //
    if (bottom === null || bottom.getColor() === null) free++;
    const left: Square | null = board.getLeftSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    //
    if (left === null || left.getColor() === null) free++;
    const right: Square | null = board.getRightSquareOf(
      position.getColumn(),
      position.getRow(),
    );
    if (right === null || right.getColor() === null) free++;
    //
    return free;
  }

  public getMatchRecords(): Array<MatchRecord> {
    return this.matchRecordsStorage.get();
  }

  /**
   * Guardar un registro en records.
   * Los guarda ordenado
   */
  private saveMatchRecord(matchRecord: MatchRecord) {
    const records = this.matchRecordsStorage.get();
    records.push(matchRecord);
    // Ordenar - Nivel descendente - Tiempo ascendente - Turnos ascendente
    records.sort((a: MatchRecord, b: MatchRecord) => {
      const aLevel: number = this.getLevel(
        a.getColors(),
        a.getColumns(),
        a.getRows(),
      );
      const bLevel: number = this.getLevel(
        b.getColors(),
        b.getColumns(),
        b.getRows(),
      );
      //
      if (aLevel !== bLevel) return bLevel - aLevel;
      //
      const aTime: number = a.getTime();
      const bTime: number = b.getTime();
      if (aTime !== bTime) return aLevel - bLevel;
      //
      return a.getMoves() - b.getMoves();
    });
    // Ahora si, guardar
    this.matchRecordsStorage.set(records);
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

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}

export class GameModelException extends Error {}
export class GameModelRuntimeException extends GameModelException {}
