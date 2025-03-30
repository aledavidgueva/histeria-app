import { NgModule } from '@angular/core';
import { PlayView } from './Views/PlayView';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';
import { TimerModule } from './TimerModule';
import { BoardModule } from './BoardModule';

@NgModule({
  declarations: [PlayView],
  imports: [TimerModule, BoardModule],
  providers: [
    {
      provide: GAME_CONTROLLER,
      useExisting: GameController,
    },
  ],
  exports: [PlayView],
})
export class PlayModule {}
