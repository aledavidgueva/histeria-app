export class MatchRecord {
  private readonly player: string;
  private readonly moves: number;
  private readonly duration: string;
  private readonly columns: number;
  private readonly rows: number;
  private readonly colors: number;

  public constructor(
    player: string,
    moves: number,
    duration: string,
    columns: number,
    rows: number,
    colors: number,
  ) {
    this.player = player;
    this.moves = moves;
    this.duration = duration;
    this.columns = columns;
    this.rows = rows;
    this.colors = colors;
  }

  public getPlayer(): string {
    return this.player;
  }

  public getMoves(): number {
    return this.moves;
  }

  public getDuration(): string {
    return this.duration;
  }

  public getColumns(): number {
    return this.columns;
  }

  public getRows(): number {
    return this.rows;
  }

  public getColors(): number {
    return this.colors;
  }

  // Función auxiliar para convertir "hh:mm:ss" a segundos
  public getTime(): number {
    const [h, m, s] = this.duration.split(':').map(Number);
    return h! * 3600 + m! * 60 + s!;
  }

  public static fromJSON(object: any): MatchRecord {
    const player: string = object['player'];
    const moves: number = object['moves'];
    const duration: string = object['duration'];
    const columns: number = object['columns'];
    const rows: number = object['rows'];
    const colors: number = object['colors'];

    return new MatchRecord(player, moves, duration, columns, rows, colors);
  }
}
