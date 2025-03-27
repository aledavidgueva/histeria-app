import { IObserver } from '../views/iobserver.interface';

export interface IObservable {
  addObserver(observer: IObserver): void;
  removeObserver(observer: IObserver): void;
}
