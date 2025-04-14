import { NgModule } from '@angular/core';
import { PlayView } from './Views/PlayView';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';
import { MatchModule } from './MatchModule';
import { TimerModule } from './TimerModule';

@NgModule({
  declarations: [PlayView],
  imports: [MatchModule, TimerModule],
  providers: [
    {
      provide: GAME_CONTROLLER,
      useExisting: GameController,
    },
  ],
  exports: [PlayView],
})
export class PlayModule {}
