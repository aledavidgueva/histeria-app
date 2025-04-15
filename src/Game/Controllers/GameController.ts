import { InjectionToken } from '@angular/core';
import { GameModel, GameScreen } from '../Models/GameModel';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { Board } from '../Utils/Board';
import { Coordinate } from '../Utils/Coordinate';
import { MatchRecord } from '../Utils/MatchRecord';

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

  public getMoves(): number {
    return this.hasMatch() ? this.gameModel.getMatch().getMoves() : 0;
  }

  public playMatch(
    inputPlayer: string,
    inputColumns: number,
    inputRows: number,
    inputColors: number,
  ): void {
    const columns = inputColumns;
    const rows = inputRows;
    const colors = inputColors;
    const player = inputPlayer.trim();
    const settings = this.gameModel.getGameSettings();

    if (player.length === 0) {
      throw new GameControllerValidationException(
        'El nombre de usuario no puede estar vacío',
      );
    }

    if (
      columns < settings.getMinColumns() ||
      columns > settings.getMaxColumns() ||
      rows < settings.getMinRows() ||
      rows > settings.getMaxRows() ||
      colors < settings.getMinColors() ||
      colors > settings.getMaxColors()
    )
      throw new GameControllerValidationException(
        'Los valores de configuración no son válidos',
      );

    this.gameModel.startNewMatch(player, columns, rows, colors);
  }

  public hasMatch(): boolean {
    return this.gameModel.hasMatch();
  }

  public onSquareClick(column: number, row: number): void {
    if (this.gameModel.hasMatch()) {
      this.gameModel.resetHelp();
      if (!this.gameModel.hasWinner())
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

  public getMinRows(): number {
    return this.gameModel.getGameSettings().getMinRows();
  }

  public getMaxRows(): number {
    return this.gameModel.getGameSettings().getMaxRows();
  }

  public getMinColumns(): number {
    return this.gameModel.getGameSettings().getMinColumns();
  }

  public getMaxColumns(): number {
    return this.gameModel.getGameSettings().getMaxColumns();
  }

  public getMinColors(): number {
    return this.gameModel.getGameSettings().getMinColors();
  }

  public getMaxColors(): number {
    return this.gameModel.getGameSettings().getMaxColors();
  }

  public getDefaultRows(currentValue: number): number {
    const minRows = this.getMinRows();
    const maxRows = this.getMaxRows();
    if (currentValue === 0 || currentValue < minRows) currentValue = minRows;
    if (currentValue > maxRows) currentValue = maxRows;
    return currentValue;
  }

  public getDefaultColumns(currentValue: number): number {
    const minColumns = this.getMinColumns();
    const maxColumns = this.getMaxColumns();
    if (currentValue === 0 || currentValue < minColumns)
      currentValue = minColumns;
    if (currentValue > maxColumns) currentValue = maxColumns;
    return currentValue;
  }

  public getDefaultColors(currentValue: number): number {
    const minColors = this.getMinColors();
    const maxColors = this.getMaxColors();
    if (currentValue === 0) currentValue = maxColors;
    if (currentValue < minColors) currentValue = minColors;
    if (currentValue > maxColors) currentValue = maxColors;
    return currentValue;
  }

  public getMischance(colors: number, squares?: number): number {
    return this.gameModel.calcMischance(colors, squares);
  }

  public getDifficultyLevel(
    colors: number,
    columns: number,
    rows: number,
  ): string {
    return this.gameModel.getDifficultyLevel(colors, columns, rows);
  }

  public getMatchDifficultyLevel(): string {
    if (!this.gameModel.hasMatch()) return 'Sin partida en curso';

    const board: Board = this.gameModel.getMatch().getBoard();
    return this.gameModel.getDifficultyLevel(
      board.getColors(),
      board.getColumns(),
      board.getRows(),
    );
  }

  public getHelp(): void {
    this.gameModel.getHelp();
  }

  public isSuggestedSquare(column: number, row: number): boolean {
    const suggestion: Coordinate | null = this.gameModel
      .getMatch()
      .getSuggestedSquare();
    return suggestion !== null
      ? suggestion.isEquals(new Coordinate(column, row))
      : false;
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

  public getMatchRecords(): Array<MatchRecord> {
    return this.gameModel.getMatchRecords();
  }

  public addObserver(observer: IObserver): void {
    this.gameModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.gameModel.removeObserver(observer);
  }
}

export class GameControllerValidationException extends Error {}
