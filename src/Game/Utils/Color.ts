/**
 * Clase para abstracción de configuración del color
 */
export class Color {
  private readonly byteMinValue: number = 0;
  private readonly byteMaxValue: number = 255;

  private red: number;
  private green: number;
  private blue: number;

  public constructor(red: number, green: number, blue: number) {
    if (!this.isValid(red, green, blue))
      throw new ColorException(
        `La configuración de color no es válida para R<${red}> G<${green}> B<${blue}>.`,
      );

    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  private isValid(red: number, green: number, blue: number): boolean {
    return (
      this.isValidByte(red) && this.isValidByte(green) && this.isValidByte(blue)
    );
  }

  private isValidByte(num: number): boolean {
    return (
      Number.isInteger(num) &&
      num >= this.byteMinValue &&
      num <= this.byteMaxValue
    );
  }

  /**
   * Obtener rojo
   */
  public getRed(): number {
    return this.red;
  }

  /**
   * Obtener verde
   */
  public getGreen(): number {
    return this.green;
  }

  /**
   * Obtener azul
   */
  public getBlue(): number {
    return this.blue;
  }

  /**
   * Comparación de colores
   */
  public isEquals(color: Color): boolean {
    return (
      this.red === color.getRed() &&
      this.green === color.getGreen() &&
      this.blue === color.getBlue()
    );
  }

  /**
   * Obtener color css en rgb
   */
  public getCssRGB() {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }

  public toString(): string {
    return this.getCssRGB();
  }
}

export class ColorException extends Error {}
