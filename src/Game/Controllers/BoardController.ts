import { InjectionToken } from '@angular/core';
import { BoardModel } from '../Models/BoardModel';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';
import { Square } from '../Utils/Square';

export const BOARD_CONTROLLER = new InjectionToken<BoardController>(
  'BoardController',
);

/**
 * Clase de control del board
 */
export class BoardController implements IObservable {
  private boardModel: BoardModel;

  public constructor(boardModel: BoardModel) {
    this.boardModel = boardModel;
  }

  public getSquares(): Array<Array<Square>> {
    return this.boardModel.getSquares();
  }

  public getColumns(): number {
    return this.boardModel.getColumns();
  }

  public getRows(): number {
    return this.boardModel.getRows();
  }

  public addObserver(observer: IObserver): void {
    this.boardModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.boardModel.removeObserver(observer);
  }
}
