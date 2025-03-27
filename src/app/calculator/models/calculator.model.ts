import { InjectionToken } from '@angular/core';
import { IObserver } from '../views/iobserver.interface';
import { IObservable } from './iobservable.interface';

export const CALCULATOR_MODEL = new InjectionToken<Calculator>('Calculator');

export class Calculator implements IObservable {
  private history: Array<string>;
  private observers: Array<IObserver>;
  private result: number;

  public constructor() {
    this.history = new Array<string>();
    this.observers = new Array<IObserver>();
    this.result = 0;
    console.log(`Clase Calculator instanciada.`);
  }

  // Agrega un observer a la lista
  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
    console.log('Observer agregado');
  }

  // Agrega un observer a la lista
  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(
      (current: IObserver) => current !== observer,
    );
    console.log('Observer removido');
  }

  // Notifica a todos los observers
  public notifyObservers(): void {
    console.log('len observer list: ' + this.observers.length);
    for (const observer of this.observers) {
      observer.notify();
      console.log('observer notificado');
    }
  }

  // Método que realiza la suma y actualiza el historial
  public sum(a: number, b: number): number {
    const result: number = a + b;
    this.history.push(a + ' + ' + b + ' = ' + result);
    this.result = result;
    this.notifyObservers();
    return result;
  }

  public sub(a: number, b: number): number {
    const result: number = a - b;
    this.history.push(a + ' - ' + b + ' = ' + result);
    this.result = result;
    this.notifyObservers();
    return result;
  }

  public getResult() {
    return this.result;
  }

  // Devuelve el historial de operaciones
  public getHistory(): Array<string> {
    return this.history;
  }
}
