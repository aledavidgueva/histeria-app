import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';

@Component({
  selector: 'game-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <button (click)="goToSettingsScreen()">Jugar</button>
    <button (click)="goToRecordsScreen()">Ver records</button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MenuView {
  private readonly gameController: GameController;

  public constructor(@Inject(GAME_CONTROLLER) gameController: GameController) {
    this.gameController = gameController;
  }

  public goToSettingsScreen(): void {
    this.gameController.goToSettingsScreen();
  }

  public goToRecordsScreen(): void {
    throw new Error('Method not implemented.');
  }
}
