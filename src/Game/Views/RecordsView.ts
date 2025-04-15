import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';
import { IObserver } from '../Utils/IObserver';
import { MatchRecord } from '../Utils/MatchRecord';

@Component({
  selector: 'game-records',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <h5>Records</h5>
    <hr />

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Apodo</th>
          <th scope="col">Dificultad</th>
          <th scope="col">Tablero</th>
          <th scope="col">Tiempo</th>
          <th scope="col">Turnos</th>
        </tr>
      </thead>
      <tbody>
        @for (record of matchRecords; track record; let idx = $index) {
          <tr>
            <th scope="row">{{ idx + 1 }}</th>
            <td>{{ record.getPlayer() }}</td>
            <td>{{ getDifficulty(record) }}</td>
            <td>
              {{ record.getColors() }}x{{ record.getColumns() }}x{{
                record.getRows()
              }}
            </td>
            <td>{{ record.getDuration() }}</td>
            <td>{{ record.getMoves() }}</td>
          </tr>
        } @empty {
          <tr>
            <td [colSpan]="6">Aún no hay records para mostrar</td>
          </tr>
        }
      </tbody>
    </table>

    <div class="d-grid gap-2 col-12 col-md-6 mx-auto">
      <button class="btn btn-primary" (click)="goToMenuScreen()">
        Ir al menú
      </button>
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
export class RecordsView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;
  private readonly cdRef: ChangeDetectorRef;

  public matchRecords: Array<MatchRecord>;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.matchRecords = new Array();
  }

  public goToMenuScreen(): void {
    this.gameController.goToMenuScreen();
  }

  public getDifficulty(record: MatchRecord): string {
    return this.gameController.getDifficultyLevel(
      record.getColors(),
      record.getColumns(),
      record.getRows(),
    );
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public notify(): void {
    this.matchRecords = this.gameController.getMatchRecords();
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
