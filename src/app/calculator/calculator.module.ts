// app.module.ts
import { NgModule } from '@angular/core';
import {
  CALCULATOR_CONTROLLER,
  CalculatorController,
} from './controllers/calculator-controller';
import { Calculator, CALCULATOR_MODEL } from './models/calculator';
import { FormsModule } from '@angular/forms';
import { CalculatorSumView } from './views/calculator-sum-view';
import { CalculatorSubView } from './views/calculator-sub-view';
import { CalculatorSelectorView } from './views/calculator-selector-view';
import { CalculatorRoutingModule } from './calculator-routing.module';

@NgModule({
  declarations: [CalculatorSelectorView, CalculatorSumView, CalculatorSubView],
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
