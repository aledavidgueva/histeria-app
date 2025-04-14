import { InjectionToken } from '@angular/core';
import { MatchModel } from '../Models/MatchModel';
import { IObserver } from '../Utils/IObserver';
import { IObservable } from '../Utils/IObservable';

export const MATCH_CONTROLLER = new InjectionToken<MatchController>(
  'MatchController',
);

/**
 * Clase de control del match
 */
export class MatchController implements IObservable {
  private matchModel: MatchModel;

  public constructor(matchModel: MatchModel) {
    this.matchModel = matchModel;
  }

  public getMoves(): number {
    return this.matchModel.getMoves();
  }

  public addObserver(observer: IObserver): void {
    this.matchModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.matchModel.removeObserver(observer);
  }
}
