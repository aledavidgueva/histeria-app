import { InjectionToken } from '@angular/core';
import { GameModel, GameScreen } from '../Models/GameModel';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { MatchModel } from '../Models/MatchModel';

export const GAME_CONTROLLER = new InjectionToken<GameController>(
  'GameController',
);

/**
 * Clase de control del juego
 */
export class GameController implements IObservable {
  private gameModel: GameModel;

  public constructor(gameModel: GameModel) {
    this.gameModel = gameModel;
  }

  public getCurrentScreen(): GameScreen {
    return this.gameModel.getCurrentScreen();
  }

  public goToMenuScreen(): void {
    this.gameModel.goToMenuScreen();
  }

  public goToSettingsScreen(): void {
    this.gameModel.goToSettingsScreen();
  }

  public goToRecordsScreen(): void {
    this.gameModel.goToRecordsScreen();
  }

  public getPlayer(): string {
    return this.gameModel.getMatch().getPlayer().toString();
  }

  public playMatch(
    inputPlayer: string,
    inputColumns: string,
    inputRows: string,
    inputColors: string,
  ): void {
    const columns = parseInt(inputColumns, 10);
    const rows = parseInt(inputRows, 10);
    const colors = parseInt(inputColors, 10);
    const player = inputPlayer.trim();
    const settings = this.gameModel.getGameSettings();

    if (player.length === 0) {
      throw new Error('El nombre de usuario no puede estar vacío');
    }

    if (
      !Number.isInteger(columns) ||
      !Number.isInteger(rows) ||
      !Number.isInteger(colors) ||
      columns < settings.getMinColums() ||
      columns > settings.getMaxColums() ||
      rows < settings.getMinRows() ||
      rows > settings.getMaxRows() ||
      colors < settings.getMinColors() ||
      colors > settings.getMaxColors()
    )
      throw new Error('Los valores de configuración no son válidos');

    this.gameModel.startNewMatch(player, columns, rows, colors);
  }

  public onSquareClick(column: number, row: number): void {
    if (this.gameModel.hasMatch() && !this.gameModel.hasWinner()) {
      this.gameModel.setColorForSquareAndCheck(column, row);
    }
  }

  public getBoardColumns(): number {
    return this.gameModel.hasMatch()
      ? this.gameModel.getMatch().getBoard().getColumns()
      : 0;
  }

  public getBoardRows(): number {
    return this.gameModel.hasMatch()
      ? this.gameModel.getMatch().getBoard().getRows()
      : 0;
  }

  /**
   * Retorna código de color para css
   */
  public getSquareCssColor(column: number, row: number): string | null {
    const square = this.gameModel.getSquare(column, row);
    const color = square.getColor();
    return color !== null
      ? `rgb(${color.getRed()}, ${color.getGreen()}, ${color.getBlue()})`
      : null;
  }

  public addObserver(observer: IObserver): void {
    this.gameModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.gameModel.removeObserver(observer);
  }
}
