import { Board } from '../Utils/Board';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { TimerModel } from './TimerModel';

export class MatchModel implements IObservable {
  private observers: Array<IObserver>;

  private readonly player: string;
  private readonly timer: TimerModel;
  private readonly board: Board;
  private moves: number;

  public constructor(player: string, board: Board) {
    this.observers = new Array<IObserver>();
    this.player = player;
    this.timer = new TimerModel();
    this.board = board;
    this.moves = 0;
  }

  addMove(): void {
    this.moves++;
    this.notifyObservers();
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

  toString(): string {
    return `Player: ${this.player}, Timer: ${this.timer.toString()}, Board: ${this.board.toString()}`;
  }

  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
    observer.notify();
    this.debug(`Observer ${observer.constructor.name} agregado.`);
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(
      (current: IObserver) => current !== observer,
    );
    this.debug(`Observer ${observer.constructor.name} removido.`);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.notify();
      this.debug(`Observer ${observer.constructor.name} notificado.`);
    }
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
