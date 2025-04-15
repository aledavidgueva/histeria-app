import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import * as Config from './Config';
import { GAME_MODEL, GameModel } from './Models/GameModel';
import { GameSettings } from './Utils/GeneralSettings';
import { GAME_CONTROLLER, GameController } from './Controllers/GameController';
import { GameView } from './Views/GameView';
import { MenuView } from './Views/MenuView';
import { SettingsView } from './Views/SettingsView';
import { MatchModule } from './MatchModule';
import { RecordsView } from './Views/RecordsView';

@NgModule({
  declarations: [GameView, MenuView, SettingsView, RecordsView],
  imports: [BrowserModule, FormsModule, MatchModule],
  providers: [
    {
      provide: GAME_MODEL,
      useFactory: () => {
        const gameSettings = new GameSettings(
          Config.minRows,
          Config.maxRows,
          Config.minColumns,
          Config.maxColumns,
          Config.minColors,
          Config.colors,
          Config.levels,
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
