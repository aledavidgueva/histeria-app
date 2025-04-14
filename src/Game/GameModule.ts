import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { GAME_MODEL, GameModel } from './Models/GameModel';
import { GameSettings } from './Utils/GeneralSettings';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';
import { Color } from './Utils/Color';
import { GameView } from './Views/GameView';
import { MenuView } from './Views/MenuView';
import { SettingsView } from './Views/SettingsView';
import { PlayModule } from './PlayModule';

@NgModule({
  declarations: [GameView, MenuView, SettingsView],
  imports: [BrowserModule, FormsModule, PlayModule],
  providers: [
    {
      provide: GAME_MODEL,
      useFactory: () => {
        const colors = new Set<Color>([
          new Color(204, 65, 37), // rgb(204, 65, 37)
          new Color(255, 217, 102), // rgb(255, 217, 102)
          new Color(147, 196, 125), // rgb(147, 196, 125)
          new Color(109, 158, 235), // rgb(109, 158, 235)
          new Color(142, 124, 195), // rgb(142, 124, 195)
          new Color(194, 123, 160), // rgb(194, 123, 160)
          new Color(246, 178, 107), // rgb(246, 178, 107)
          new Color(118, 165, 175), // rgb(118, 165, 175)
          new Color(224, 102, 102), // rgb(224, 102, 102)
          new Color(153, 49, 28), // rgb(153, 49, 28)
          new Color(191, 163, 77), // rgb(191, 163, 77)
          new Color(110, 147, 94), // rgb(110, 147, 94)
          new Color(82, 119, 176), // rgb(82, 119, 176)
          new Color(107, 93, 146), // rgb(107, 93, 146)
          new Color(146, 92, 120), // rgb(146, 92, 120)
          new Color(184, 134, 80), // rgb(184, 134, 80)
          new Color(89, 124, 131), // rgb(89, 124, 131)
          new Color(168, 77, 77), // rgb(168, 77, 77)
        ]);

        const minRows: number = 5;
        const maxRows: number = 50;
        const minColums: number = 5;
        const maxColums: number = 50;
        const minColors: number = 5;

        const gameSettings = new GameSettings(
          minRows,
          maxRows,
          minColums,
          maxColums,
          minColors,
          colors,
        );

        return new GameModel(gameSettings);
      },
    },
    {
      provide: GAME_CONTROLLER,
      useFactory: (gameModel: GameModel) => new GameController(gameModel),
      deps: [GAME_MODEL],
    },
  ],
  bootstrap: [GameView],
})
export class GameModule {}
