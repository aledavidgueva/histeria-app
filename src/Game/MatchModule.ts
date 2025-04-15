import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRepeatDirective } from 'ngx-repeat';
import { MovesView } from './Views/MovesView';
import { BoardView } from './Views/BoardView';
import { SquareView } from './Views/SquareView';
import { TimerView } from './Views/TimerView';
import { PlayView } from './Views/PlayView';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';

@NgModule({
  declarations: [PlayView, BoardView, SquareView, MovesView, TimerView],
  imports: [CommonModule, NgxRepeatDirective],
  providers: [
    {
      provide: GAME_CONTROLLER,
      useExisting: GameController,
    },
  ],
  exports: [PlayView],
})
export class MatchModule {}
