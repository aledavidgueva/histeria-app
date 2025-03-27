import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  CALCULATOR_CONTROLLER,
  CalculatorController,
} from '../controllers/calculator.controller';

@Component({
  template: `
    <h2>Restar:</h2>

    <form>
      <div>
        <label>Ingrese primer número</label>
        <input
          type="text"
          [(ngModel)]="inputNum1"
          [ngModelOptions]="{ standalone: true }"
        />
      </div>
      <div>
        <label>Ingrese segundo número</label>
        <input
          type="text"
          [(ngModel)]="inputNum2"
          [ngModelOptions]="{ standalone: true }"
        />
      </div>
      <div>
        <button (click)="sub()">Calcular resta</button>
      </div>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorSubView {
  private controller: CalculatorController;

  public inputNum1: string;
  public inputNum2: string;

  public constructor(
    @Inject(CALCULATOR_CONTROLLER) controller: CalculatorController,
  ) {
    this.controller = controller;
    this.inputNum1 = '';
    this.inputNum2 = '';
  }

  public sub() {
    this.controller.handleSub(this.inputNum1, this.inputNum2);
  }
}
