import { IObserver } from '../views/i-observer';

export interface IObservable {
  addObserver(observer: IObserver): void;
  removeObserver(observer: IObserver): void;
}
