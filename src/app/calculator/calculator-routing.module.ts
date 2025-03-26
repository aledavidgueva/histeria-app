import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculatorSelectorView } from './views/calculator-selector-view';
import { CalculatorSumView } from './views/calculator-sum-view';
import { CalculatorSubView } from './views/calculator-sub-view';

const routes: Routes = [
  {
    path: '',
    component: CalculatorSelectorView,
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
