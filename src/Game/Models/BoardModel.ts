import { InjectionToken } from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';
import { Square } from '../Utils/Square';

export const BOARD_MODEL = new InjectionToken<BoardModel>('BoardModel');

/**
 * Clase de lógica de negocio del tablero
 */
export class BoardModel implements IObservable {
  private observers: Array<IObserver>;

  private readonly columns: number;
  private readonly rows: number;
  private readonly colors: number;
  private readonly squares: Array<Array<Square>>;

  public constructor(columns: number, rows: number, colors: number) {
    this.observers = new Array<IObserver>();
    this.columns = columns;
    this.rows = rows;
    this.colors = colors;
    this.squares = this.createSquares();
  }

  private createSquares(): Array<Array<Square>> {
    const squares: Array<Array<Square>> = new Array();
    for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
      const column: Array<Square> = new Array();
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        const square: Square = new Square(columnIndex, rowIndex);
        column.push(square);
      }
      squares.push(column);
    }
    return squares;
  }

  public getRows(): number {
    return this.rows;
  }

  public getColumns(): number {
    return this.columns;
  }

  public getColors(): number {
    return this.colors;
  }

  public getSquares(): Array<Array<Square>> {
    return this.squares;
  }

  public getSquare(column: number, row: number): Square | null {
    if (column < 0 || column >= this.columns || row < 0 || row >= this.rows)
      return null;
    // Garantizado por la creación de la matriz
    return this.squares[column]![row]!;
  }

  public getTopSquareOf(column: number, row: number): Square | null {
    return this.getSquare(column, row - 1);
  }

  public getBottomSquareOf(column: number, row: number): Square | null {
    return this.getSquare(column, row + 1);
  }

  public getLeftSquareOf(column: number, row: number): Square | null {
    return this.getSquare(column - 1, row);
  }

  public getRightSquareOf(column: number, row: number): Square | null {
    return this.getSquare(column + 1, row);
  }

  public toString(): string {
    return `Tablero: ${this.rows}x${this.columns}, Colores: ${this.colors}`;
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
