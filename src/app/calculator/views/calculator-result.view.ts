import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IObserver } from './iobserver.interface';
import {
  CALCULATOR_CONTROLLER,
  CalculatorController,
} from '../controllers/calculator.controller';

@Component({
  selector: 'calculator-result',
  template: `
    <div>
      <h2>{{ result }}</h2>
    </div>
  `,
  styles: `
    div {
      h2 {
        border: 1px solid #666;
        padding: 10px;
        margin: 0;
        width: 500px;
        text-align: right;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorResultView implements IObserver, OnInit, OnDestroy {
  private controller: CalculatorController;

  public result: number;

  public constructor(
    @Inject(CALCULATOR_CONTROLLER) controller: CalculatorController,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.controller = controller;
    this.result = this.controller.getResult();
  }

  public ngOnInit(): void {
    this.controller.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.controller.removeObserver(this);
  }

  public notify(): void {
    console.log('hi');
    this.result = this.controller.getResult();
    this.cdRef.markForCheck();
  }
}
