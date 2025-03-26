import { Inject, InjectionToken } from '@angular/core';
import { Calculator, CALCULATOR_MODEL } from '../models/calculator';
import { IObserver } from '../views/i-observer';

export const CALCULATOR_CONTROLLER = new InjectionToken<CalculatorController>(
  'CalculatorController'
);

export class CalculatorController {
  private model: Calculator;

  public constructor(@Inject(CALCULATOR_MODEL) calculator: Calculator) {
    this.model = calculator;
  }

  public addObserver(observer: IObserver): void {
    this.model.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.model.removeObserver(observer);
  }

  public handleSum(n1: string, n2: string): number {
    const num1: number = parseInt(n1);
    const num2: number = parseInt(n2);
    return this.model.sum(num1, num2);
  }

  public handleSub(n1: string, n2: string): number {
    const num1: number = parseInt(n1);
    const num2: number = parseInt(n2);
    return this.model.sub(num1, num2);
  }

  public getHistory(): Array<string> {
    return this.model.getHistory();
  }
}
