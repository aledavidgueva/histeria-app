export class MatchRecord {
  private readonly player: string;
  private readonly moves: number;
  private readonly time: string;
  private readonly columns: number;
  private readonly rows: number;
  private readonly colors: number;
  private readonly difficulty: number;

  public constructor(
    player: string,
    moves: number,
    time: string,
    columns: number,
    rows: number,
    colors: number,
    difficulty: number,
  ) {
    this.player = player;
    this.moves = moves;
    this.time = time;
    this.columns = columns;
    this.rows = rows;
    this.colors = colors;
    this.difficulty = difficulty;
  }
}
