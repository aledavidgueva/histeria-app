import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'calculator-title',
  template: ` <h1>Calculadora</h1> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorTitleView {}
