import { Color } from './Color';

/**
 * Clase con la configuración del juego
 */
export class GameSettings {
  private minRows: number;
  private maxRows: number;
  private minColumns: number;
  private maxColumns: number;
  private minColors: number;
  private colors: Set<Color>;
  private maxColors: number;
  private levels: Array<string>;

  public constructor(
    minRows: number,
    maxRows: number,
    minColumns: number,
    maxColumns: number,
    minColors: number,
    colors: Set<Color>,
    levels: Array<string>,
  ) {
    if (
      !this.isValid(minRows, maxRows, minColumns, maxColumns, minColors, colors)
    )
      throw new GameSettingsArgException(
        `La configuración del juego no es válida.`,
      );

    this.minRows = minRows;
    this.maxRows = maxRows;
    this.minColumns = minColumns;
    this.maxColumns = maxColumns;
    this.minColors = minColors;
    this.colors = colors;
    this.maxColors = colors.size;
    this.levels = levels;
  }

  private isValid(
    minRows: number,
    maxRows: number,
    minColumns: number,
    maxColumns: number,
    minColors: number,
    colors: Set<Color>,
  ): boolean {
    return (
      this.isValidRange(minRows, maxRows) &&
      this.isValidRange(minColumns, maxColumns) &&
      this.isValidRange(minColors, colors.size)
    );
  }

  private isValidRange(min: number, max: number): boolean {
    return (
      Number.isInteger(min) && Number.isInteger(max) && min > 0 && min < max
    );
  }

  public getMinRows(): number {
    return this.minRows;
  }

  public getMaxRows(): number {
    return this.maxRows;
  }

  public getMinColumns(): number {
    return this.minColumns;
  }

  public getMaxColumns(): number {
    return this.maxColumns;
  }

  public getMinColors(): number {
    return this.minColors;
  }

  public getMaxColors(): number {
    return this.maxColors;
  }

  public getLevels(): Array<string> {
    return this.levels;
  }

  public getColors(): Set<Color> {
    return this.colors;
  }

  public getPartialColorList(maxColors: number): Array<Color> {
    if (maxColors < this.minColors || maxColors > this.maxColors)
      throw new GameSettingsRuntimeException(
        `El número de colores no es válido.`,
      );

    return Array.from(this.colors).slice(0, maxColors);
  }
}

export class GameSettingsArgException extends Error {}
export class GameSettingsRuntimeException extends Error {}
