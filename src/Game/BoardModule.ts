import { NgModule } from '@angular/core';
import {
  BOARD_CONTROLLER,
  BoardController,
} from './Controllers/BoardController';
import { BoardView } from './Views/BoardView';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';
import { JsonPipe } from '@angular/common';

@NgModule({
  declarations: [BoardView],
  imports: [JsonPipe],
  providers: [
    {
      provide: GAME_CONTROLLER,
      useExisting: GameController,
    },
    {
      provide: BOARD_CONTROLLER,
      useFactory: (gameController: GameController) => {
        const match = gameController.getMatch();
        if (match === null)
          throw new Error('Error de inicialización del BoardController');

        const boardModel = match.getBoard();
        return new BoardController(boardModel);
      },
      deps: [GAME_CONTROLLER],
    },
  ],
  exports: [BoardView],
})
export class BoardModule {}
