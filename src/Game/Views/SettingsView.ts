import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GAME_CONTROLLER,
  GameController,
  GameControllerValidationException,
} from '../Controllers/GameController';
import { IObserver } from '../Utils/IObserver';

@Component({
  selector: 'game-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div>
      <div class="mb-3 col-12 col-md-6 mx-auto">
        <label for="inputNick" class="form-label"
          >Ingresá tu nombre o apodo</label
        >
        <input
          id="inputNick"
          class="form-control"
          type="text"
          placeholder="Tu apodo"
          [(ngModel)]="player"
          autofocus
        />
      </div>

      <div class="mb-3 col-12 col-md-6 mx-auto">
        <label class="form-label">Elegí la dificultad de la partida</label>
      </div>

      <div class="mb-2 col-12 col-md-6 mx-auto">
        <div class="row">
          <div class="col-4 col-md-3 text-start">
            <label class="form-label">Filas</label>
          </div>
          <div class="col-6 col-md-7">
            <input
              type="range"
              class="form-range"
              [attr.min]="minRows"
              [attr.max]="maxRows"
              (change)="onSettingsChange()"
              [(ngModel)]="rows"
            />
          </div>
          <div class="col-2 text-end">{{ rows }}</div>
        </div>
      </div>

      <div class="mb-2 col-12 col-md-6 mx-auto">
        <div class="row">
          <div class="col-4 col-md-3 text-start">
            <label class="form-label">Columnas</label>
          </div>
          <div class="col-6 col-md-7">
            <input
              type="range"
              class="form-range"
              [attr.min]="minColumns"
              [attr.max]="maxColumns"
              (change)="onSettingsChange()"
              [(ngModel)]="columns"
            />
          </div>
          <div class="col-2 text-end">{{ columns }}</div>
        </div>
      </div>

      <div class="mb-2 col-12 col-md-6 mx-auto">
        <div class="row">
          <div class="col-4 col-md-3 text-start">
            <label class="form-label">Colores</label>
          </div>
          <div class="col-6 col-md-7">
            <input
              type="range"
              class="form-range"
              [attr.min]="minColors"
              [attr.max]="maxColors"
              (change)="onSettingsChange()"
              [(ngModel)]="colors"
            />
          </div>
          <div class="col-2 text-end">{{ colors }}</div>
        </div>
      </div>

      <div class="mb-2 col-12 col-md-6 mx-auto">
        <u>Dificultad</u>: {{ difficulty }}
        <br />
        <small>
          Mala suerte
          {{ mischance * 100 | number: '1.0-2' }}% x
          {{ rows * columns }} casillas
        </small>
      </div>

      <div class="col-12 col-md-6 mx-auto"></div>

      <div class="col-12 col-md-6 mx-auto">
        <hr />
        <div class="d-flex justify-content-between">
          <button class="btn btn-secondary" (click)="goToMenuScreen()">
            Atrás
          </button>
          <button class="btn btn-primary" (click)="playMatch()">
            Comenzar
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

      input {
        text-align: center;
      }
    `,
  ],
})
export class SettingsView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;
  private readonly cdRef: ChangeDetectorRef;

  public player: string;
  public rows: number;
  public columns: number;
  public colors: number;

  public minRows: number;
  public maxRows: number;
  public minColumns: number;
  public maxColumns: number;
  public minColors: number;
  public maxColors: number;

  public mischance: number;
  public difficulty: string;

  public constructor(
    @Inject(GAME_CONTROLLER) gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.player = '';
    this.rows = 0;
    this.columns = 0;
    this.colors = 0;
    this.minRows = 0;
    this.maxRows = 0;
    this.minColumns = 0;
    this.maxColumns = 0;
    this.minColors = 0;
    this.maxColors = 0;
    this.mischance = 0;
    this.difficulty = '';
  }

  public goToMenuScreen(): void {
    this.gameController.goToMenuScreen();
  }

  public playMatch(): void {
    try {
      this.gameController.playMatch(
        this.player,
        this.columns,
        this.rows,
        this.colors,
      );
    } catch (err) {
      if (err instanceof GameControllerValidationException) {
        alert(err.message);
      } else {
        alert('Hubo un error inesperado. Contacte al administrador.');
      }
    }
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
    this.notify();
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public notify(): void {
    this.minRows = this.gameController.getMinRows();
    this.maxRows = this.gameController.getMaxRows();
    this.minColumns = this.gameController.getMinColumns();
    this.maxColumns = this.gameController.getMaxColumns();
    this.minColors = this.gameController.getMinColors();
    this.maxColors = this.gameController.getMaxColors();
    this.rows = this.gameController.getDefaultRows(this.rows);
    this.columns = this.gameController.getDefaultColumns(this.columns);
    this.colors = this.gameController.getDefaultColors(this.colors);
    this.onSettingsChange();
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  public onSettingsChange(): void {
    this.difficulty = this.gameController.getDifficultyLevel(
      this.colors,
      this.columns,
      this.rows,
    );
    this.mischance = this.gameController.getMischance(this.colors);
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
