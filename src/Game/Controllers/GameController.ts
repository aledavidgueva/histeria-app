import { InjectionToken } from '@angular/core';
import { GameModel, GameScreens } from '../Models/GameModel';
import { Match } from '../Utils/Match';
import { GameSettings } from '../Utils/GeneralSettings';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { Square } from '../Utils/Square';

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

  public addObserver(observer: IObserver): void {
    this.gameModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.gameModel.removeObserver(observer);
  }

  public getScreen(): GameScreens {
    return this.gameModel.getScreen();
  }

  public goToSettingsScreen(): void {
    this.gameModel.waitNewMatchSettings();
  }

  public goToRecordsScreen(): void {
    throw new Error('Method not implemented.');
  }

  public getGameSettings(): GameSettings {
    return this.gameModel.getGameSettings();
  }

  public getMatch(): Match | null {
    return this.gameModel.getMatch();
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

  public setRandomColor(): void {}

  public onSquareClick(square: Square): void {
    this.gameModel.setColorForSquare(square.getColumn(), square.getRow());
  }
}
