import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRepeatDirective } from 'ngx-repeat';
import { MovesView } from './Views/MovesView';
import {
  MATCH_CONTROLLER,
  MatchController,
} from './Controllers/MatchController';
import { BoardView } from './Views/BoardView';
import { SquareView } from './Views/SquareView';
import { GAME_MODEL, GameModel } from './Models/GameModel';

@NgModule({
  declarations: [BoardView, SquareView, MovesView],
  imports: [CommonModule, NgxRepeatDirective],
  providers: [
    {
      provide: GAME_MODEL,
      useExisting: GameModel,
    },
    {
      provide: MATCH_CONTROLLER,
      useFactory: (game: GameModel) => {
        return new MatchController(game.getMatch());
      },
      deps: [GAME_MODEL],
    },
  ],
  exports: [BoardView, MovesView],
})
export class MatchModule {}
