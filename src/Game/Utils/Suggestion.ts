export class Suggestion {
  private readonly column: number;
  private readonly row: number;
  private readonly probability: number;

  public constructor(column: number, row: number, probability: number) {
    if (!this.isValid(column, row))
      throw new SuggestionArgException(`Coordenadas no válidas.`);

    this.column = column;
    this.row = row;
    this.probability = probability;
  }

  private isValid(column: number, row: number): boolean {
    return (
      Number.isInteger(column) &&
      Number.isInteger(row) &&
      column >= 0 &&
      row >= 0
    );
  }

  getColumn(): number {
    return this.column;
  }

  getRow(): number {
    return this.row;
  }

  getProbability(): number {
    return this.probability;
  }

  toString(): string {
    return `Sugerencia: (C:${this.column}|F:${this.row}) con probabilidad ${this.probability}`;
  }
}

export class SuggestionArgException extends Error {}
