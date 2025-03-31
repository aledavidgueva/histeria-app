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
          new Color(255, 179, 186), // Rosa pastel brillante
          new Color(181, 255, 223), // Menta pastel vibrante
          new Color(255, 223, 186), // Melocotón pastel
          new Color(186, 225, 255), // Azul cielo pastel
          new Color(255, 186, 255), // Lavanda rosada pastel
          new Color(223, 255, 186), // Verde lima pastel
          new Color(255, 240, 179), // Amarillo mantequilla pastel
          new Color(203, 195, 227), // Púrpura suave pastel
          new Color(255, 198, 172), // Coral pastel
          new Color(186, 255, 201), // Agua marina pastel
          new Color(255, 179, 235), // Magenta suave pastel
          new Color(198, 255, 255), // Turquesa pastel
          new Color(255, 214, 214), // Rosa salmón pastel
          new Color(210, 255, 179), // Verde primavera pastel
          new Color(237, 179, 255), // Violeta pastel
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
