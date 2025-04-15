import { Board } from './Board';
import { Coordinate } from './Coordinate';
import { IObserver } from './IObserver';
import { TimerModel } from '../Models/TimerModel';

export class Match {
  private readonly player: string;
  private readonly timer: TimerModel;
  private readonly board: Board;
  private moves: number;
  private suggestedSquare: Coordinate | null;

  public constructor(player: string, board: Board) {
    this.player = player;
    this.timer = new TimerModel();
    this.board = board;
    this.moves = 0;
    this.suggestedSquare = null;
  }

  addMove(): void {
    this.moves++;
  }

  getMoves(): number {
    return this.moves;
  }

  getPlayer(): string {
    return this.player;
  }

  getBoard(): Board {
    return this.board;
  }

  getTimer(): TimerModel {
    return this.timer;
  }

  setSuggestedSquare(suggestedSquare: Coordinate | null): void {
    this.suggestedSquare = suggestedSquare;
  }

  getSuggestedSquare(): Coordinate | null {
    return this.suggestedSquare;
  }

  toString(): string {
    return `Player: ${this.player}, Timer: ${this.timer.toString()}, Board: ${this.board.toString()}`;
  }
}
