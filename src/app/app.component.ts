import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculatorModule } from './calculator/calculator.module';

@Component({
  selector: 'app-root',
  template: ` <router-outlet /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CalculatorModule],
})
export class AppComponent {
  title = 'histeria-app';
}
