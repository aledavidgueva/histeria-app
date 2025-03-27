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
  selector: 'calculator-history',
  template: `
    <div>
      <h3>Histórico:</h3>

      @if (history.length) {
        <ul>
          @for (entry of history; track $index) {
            <li>{{ entry }}</li>
          }
        </ul>
      } @else {
        <p>Aún no se ejecutaron operaciones.</p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorHistoryView implements IObserver, OnInit, OnDestroy {
  private controller: CalculatorController;

  public history: Array<string>;

  public constructor(
    @Inject(CALCULATOR_CONTROLLER) controller: CalculatorController,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.controller = controller;
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
}
