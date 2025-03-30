import { BoardModel } from '../Models/BoardModel';
import { TimerModel } from '../Models/TimerModel';

export class Match {
  private readonly player: string;
  private readonly timer: TimerModel;
  private readonly board: BoardModel;

  public constructor(player: string, timer: TimerModel, board: BoardModel) {
    this.player = player;
    this.timer = timer;
    this.board = board;
  }

  getPlayer(): string {
    return this.player;
  }

  getTimer(): TimerModel {
    return this.timer;
  }

  getBoard(): BoardModel {
    return this.board;
  }

  toString(): string {
    return `Player: ${this.player}, Timer: ${this.timer.toString()}, Board: ${this.board.toString()}`;
  }
}
