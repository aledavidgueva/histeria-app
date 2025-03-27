// app.module.ts
import { NgModule } from '@angular/core';
import {
  CALCULATOR_CONTROLLER,
  CalculatorController,
} from './controllers/calculator.controller';
import { Calculator, CALCULATOR_MODEL } from './models/calculator.model';
import { FormsModule } from '@angular/forms';
import { CalculatorSumView } from './views/calculator-sum.view';
import { CalculatorSubView } from './views/calculator-sub.view';
import { CalculatorMenuView } from './views/calculator-menu.view';
import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorHistoryView } from './views/calculator-history.view';
import { CalculatorTitleView } from './views/calculator-title.view';
import { CalculatorView } from './views/calculator.view';
import { CalculatorResultView } from './views/calculator-result.view';

@NgModule({
  declarations: [
    CalculatorView,
    CalculatorTitleView,
    CalculatorMenuView,
    CalculatorSumView,
    CalculatorSubView,
    CalculatorResultView,
    CalculatorHistoryView,
  ],
  imports: [FormsModule, CalculatorRoutingModule],
  providers: [
    {
      provide: CALCULATOR_MODEL,
      useValue: new Calculator(),
    },
    {
      provide: CALCULATOR_CONTROLLER,
      useFactory: (calculator: Calculator) =>
        new CalculatorController(calculator),
      deps: [CALCULATOR_MODEL],
    },
  ],
})
export class CalculatorModule {}
