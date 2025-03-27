import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculatorSumView } from './views/calculator-sum.view';
import { CalculatorSubView } from './views/calculator-sub.view';
import { CalculatorView } from './views/calculator.view';

const routes: Routes = [
  {
    path: '',
    component: CalculatorView,
    children: [
      {
        path: 'sum',
        component: CalculatorSumView,
      },
      {
        path: 'sub',
        component: CalculatorSubView,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculatorRoutingModule {}
