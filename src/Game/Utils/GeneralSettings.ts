import { Color } from './Color';

/**
 * Clase con la configuración del juego
 */
export class GameSettings {
  private minRows: number;
  private maxRows: number;
  private minColums: number;
  private maxColums: number;
  private minColors: number;
  private colors: Set<Color>;
  private maxColors: number;

  public constructor(
    minRows: number,
    maxRows: number,
    minColums: number,
    maxColums: number,
    minColors: number,
    colors: Set<Color>,
  ) {
    if (
      !this.isValid(minRows, maxRows, minColums, maxColums, minColors, colors)
    )
      throw new GameSettingsArgException(
        `La configuración del juego no es válida.`,
      );

    this.minRows = minRows;
    this.maxRows = maxRows;
    this.minColums = minColums;
    this.maxColums = maxColums;
    this.minColors = minColors;
    this.colors = colors;
    this.maxColors = colors.size;
  }

  private isValid(
    minRows: number,
    maxRows: number,
    minColums: number,
    maxColums: number,
    minColors: number,
    colors: Set<Color>,
  ): boolean {
    return (
      this.isValidRange(minRows, maxRows) &&
      this.isValidRange(minColums, maxColums) &&
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

  public getMinColums(): number {
    return this.minColums;
  }

  public getMaxColums(): number {
    return this.maxColums;
  }

  public getMinColors(): number {
    return this.minColors;
  }

  public getMaxColors(): number {
    return this.maxColors;
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
