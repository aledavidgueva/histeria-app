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
    <h1>Elija una actividad</h1>
    <div>
      <a routerLink="./sum">Sumar</a>
      <br />
      <br />
      <a routerLink="./sub">Restar</a>
      <br />
      <br />
      <a routerLink="./">Cerrar</a>
    </div>

    <router-outlet />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalculatorSelectorView {}
