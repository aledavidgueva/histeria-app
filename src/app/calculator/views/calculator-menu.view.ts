import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'calculator-menu',
  template: `
    <div>
      <p>Elija una operación:</p>
      <a routerLink="./sum">Sumar</a>
      <a routerLink="./sub">Restar</a>
    </div>
  `,
  styles: `
    div {
      display: flex;
      align-items: center;
      width: 500px;
      a {
        padding: 2px 10px;
        margin: 0 10px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorMenuView {}
