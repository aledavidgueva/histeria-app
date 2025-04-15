// import { NgModule } from '@angular/core';
// import {
//   BOARD_CONTROLLER,
//   BoardController,
// } from './Controllers/BoardController';
// import { BoardView } from './Views/BoardView';
// import { GAME_CONTROLLER, GameController } from './Controllers/GameController';
// import { CommonModule } from '@angular/common';
// import { SquareView } from './Views/SquareView';
// import { NgxRepeatDirective } from 'ngx-repeat';
// import { Match } from './Utils/Match';
// import { BoardModel } from './Models/BoardModel';

// @NgModule({
//   declarations: [BoardView, SquareView],
//   imports: [CommonModule, NgxRepeatDirective],
//   providers: [
//     {
//       provide: GAME_CONTROLLER,
//       useExisting: GameController,
//     },
//     {
//       provide: BOARD_CONTROLLER,
//       useFactory: (gameController: GameController) => {
//         const match: Match = gameController.getMatch();
//         const boardModel: BoardModel = match.getBoard();
//         return new BoardController(boardModel);
//       },
//       deps: [GAME_CONTROLLER],
//     },
//   ],
//   exports: [BoardView],
// })
// export class BoardModule {}
