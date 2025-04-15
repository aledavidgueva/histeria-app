import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';

@Component({
  selector: 'game-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="card animate__animated animate__pulse">
      <div class="card-body">
        <h5 class="card-title mb-3">¡Poné a prueba tu paciencia!</h5>
        <p class="card-text mb-5">
          ¿Están listos para volverse completamente locos?
        </p>
        <div class="d-grid gap-2 col-12 col-md-6 mx-auto">
          <button
            class="btn btn-primary btn-lg animate__animated animate__tada"
            (click)="goToSettingsScreen()"
          >
            Jugar
          </button>
          <div class="my-2"></div>
          <button
            class="btn btn-secondary btn-lg"
            (click)="goToRecordsScreen()"
          >
            Ver records
          </button>
        </div>
      </div>
    </div>
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
    this.gameController.goToRecordsScreen();
  }
}
