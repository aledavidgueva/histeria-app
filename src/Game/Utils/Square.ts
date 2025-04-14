import { Color } from './Color';

export class Square {
  private readonly column: number;
  private readonly row: number;
  private color: Color | null;

  public constructor(column: number, row: number, color: Color | null = null) {
    if (!this.isValid(column, row))
      throw new SquareArgException(`Coordenadas no válidas.`);

    this.column = column;
    this.row = row;
    this.color = color;
  }

  private isValid(column: number, row: number): boolean {
    return (
      Number.isInteger(column) &&
      Number.isInteger(row) &&
      column >= 0 &&
      row >= 0
    );
  }

  resetColor(): void {
    this.color = null;
  }

  setColor(color: Color): void {
    this.color = color;
  }

  getColumn(): number {
    return this.column;
  }

  getRow(): number {
    return this.row;
  }

  getColor(): Color | null {
    return this.color;
  }

  toString(): string {
    return `Casilla [C${this.column}F${this.row} - Color: ${this.color}]`;
  }
}

export class SquareArgException extends Error {}
