import { InjectionToken } from '@angular/core';
import { Calculator } from '../models/calculator.model';
import { IObserver } from '../views/iobserver.interface';

export const CALCULATOR_CONTROLLER = new InjectionToken<CalculatorController>(
  'CalculatorController',
);

export class CalculatorController {
  private model: Calculator;

  public constructor(calculator: Calculator) {
    this.model = calculator;
  }

  public addObserver(observer: IObserver): void {
    this.model.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.model.removeObserver(observer);
  }

  public handleSum(n1: string, n2: string): void {
    const num1: number = parseInt(n1);
    const num2: number = parseInt(n2);
    this.model.sum(num1, num2);
  }

  public handleSub(n1: string, n2: string): void {
    const num1: number = parseInt(n1);
    const num2: number = parseInt(n2);
    this.model.sub(num1, num2);
  }

  public getResult(): number {
    return this.model.getResult();
  }

  public getHistory(): Array<string> {
    return this.model.getHistory();
  }
}
