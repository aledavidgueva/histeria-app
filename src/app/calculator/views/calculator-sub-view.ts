import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IObserver } from './i-observer';
import {
  CALCULATOR_CONTROLLER,
  CalculatorController,
} from '../controllers/calculator-controller';

@Component({
  template: `
    <h1>Calculadora que solo resta</h1>

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
        <button (click)="sub()">Restar</button>
      </div>
    </form>

    <div>Resultado: {{ result }}</div>

    <div>
      <h4>Histórico:</h4>

      @if (history.length) {
      <ul>
        @for (entry of history; track $index) {
        <li>{{ entry }}</li>
        }
      </ul>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorSubView implements IObserver, OnInit, OnDestroy {
  private controller: CalculatorController;

  public inputNum1: string;
  public inputNum2: string;
  public result: number;
  public history: Array<string>;

  public constructor(
    @Inject(CALCULATOR_CONTROLLER) controller: CalculatorController,
    private readonly cdRef: ChangeDetectorRef
  ) {
    this.controller = controller;
    this.inputNum1 = '';
    this.inputNum2 = '';
    this.result = 0;
    this.history = [];
  }

  public ngOnInit(): void {
    this.controller.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.controller.removeObserver(this);
  }

  public notify(): void {
    this.history = [...this.controller.getHistory()];
    this.cdRef.markForCheck();
  }

  public sub() {
    this.result = this.controller.handleSub(this.inputNum1, this.inputNum2);
    this.cdRef.markForCheck();
  }
}
