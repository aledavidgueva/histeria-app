import { NgModule } from '@angular/core';
import {
  TIMER_CONTROLLER,
  TimerController,
} from './Controllers/TimerController';
import { TimerView } from './Views/TimerView';
import { GAME_MODEL, GameModel } from './Models/GameModel';

@NgModule({
  declarations: [TimerView],
  imports: [],
  providers: [
    {
      provide: GAME_MODEL,
      useExisting: GameModel,
    },
    {
      provide: TIMER_CONTROLLER,
      useFactory: (game: GameModel) => {
        return new TimerController(game.getMatch().getTimer());
      },
      deps: [GAME_MODEL],
    },
  ],
  exports: [TimerView],
})
export class TimerModule {}
