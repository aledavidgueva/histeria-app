import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';

@Component({
  selector: 'game-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <input type="text" placeholder="Tu nick" [(ngModel)]="player" />
    <input type="number" placeholder="Número de filas" [(ngModel)]="rows" />
    <input
      type="number"
      placeholder="Número de columnas"
      [(ngModel)]="colums"
    />
    <input type="number" placeholder="Número de colores" [(ngModel)]="colors" />
    <button (click)="playMatch()">Comenzar</button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SettingsView {
  private readonly gameController: GameController;

  public player: string;
  public rows: string;
  public colums: string;
  public colors: string;

  public constructor(@Inject(GAME_CONTROLLER) gameController: GameController) {
    this.gameController = gameController;
    this.player = '';
    this.rows = '';
    this.colums = '';
    this.colors = '';
  }

  public playMatch(): void {
    this.gameController.playMatch(
      this.player,
      this.colums,
      this.rows,
      this.colors,
    );
  }
}
