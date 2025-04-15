import { Color } from './Color';
import { Coordinate } from './Coordinate';

export class Square {
  private coordinate: Coordinate;

  private color: Color | null;

  public constructor(column: number, row: number, color: Color | null = null) {
    if (!this.isValid(column, row))
      throw new SquareArgException(`Coordenadas no válidas.`);

    this.coordinate = new Coordinate(column, row);
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

  getCoordinate(): Coordinate {
    return this.coordinate;
  }

  getColor(): Color | null {
    return this.color;
  }

  toString(): string {
    return `Casilla [C${this.coordinate.getColumn()}F${this.coordinate.getRow()} - Color: ${this.color}]`;
  }
}

export class SquareArgException extends Error {}
