import { NgModule } from '@angular/core';
import {
  TIMER_CONTROLLER,
  TimerController,
} from './Controllers/TimerController';
import { TimerView } from './Views/TimerView';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';

@NgModule({
  declarations: [TimerView],
  imports: [],
  providers: [
    {
      provide: GAME_CONTROLLER,
      useExisting: GameController,
    },
    {
      provide: TIMER_CONTROLLER,
      useFactory: (gameController: GameController) => {
        const match = gameController.getMatch();
        if (match === null)
          throw new Error('Error de inicialización del TimerController');

        const timerModel = match.getTimer();
        return new TimerController(timerModel);
      },
      deps: [GAME_CONTROLLER],
    },
  ],
  exports: [TimerView],
})
export class TimerModule {}
