import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <calculator-title />
    <calculator-result />
    <calculator-menu />
    <div>
      <router-outlet />
    </div>
    <calculator-history />
  `,
  styles: `
    div {
      display: block;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #666;
      width: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorView {}
