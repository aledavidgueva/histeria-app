import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';
import { IObserver } from '../Utils/IObserver';

@Component({
  selector: 'game-square',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    @if (column !== null && row !== null) {
      <div
        [style.backgroundColor]="color"
        [class.suggested]="suggested"
        (click)="onSquareClick()"
      ></div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      div {
        position: relative;
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        background-color: #ccc;
        cursor: pointer;
        transition: all ease-out 0.1s;

        &.suggested {
          z-index: 10;
          box-shadow: 0 0 0.5rem 0.25rem rgba(0, 255, 0, 0.9);
          background-color: #ddd;
        }

        &:hover {
          z-index: 10;
          box-shadow: 0 0 0.5rem 0.25rem rgba(0, 0, 0, 0.75);
        }
      }
    `,
  ],
})
export class SquareView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;
  private readonly cdRef: ChangeDetectorRef;

  public color: string | null;

  public suggested: boolean;

  @Input()
  public column: number | null;

  @Input()
  public row: number | null;

  public constructor(
    @Inject(GAME_CONTROLLER)
    gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.color = null;
    this.column = null;
    this.row = null;
    this.suggested = false;
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public onSquareClick(): void {
    if (this.column === null || this.row === null) return;

    this.gameController.onSquareClick(this.column, this.row);
  }

  public notify(): void {
    if (!this.gameController.hasMatch()) return;
    if (this.column === null || this.row === null) return;

    this.suggested = this.gameController.isSuggestedSquare(
      this.column,
      this.row,
    );
    const color = this.gameController.getSquareCssColor(this.column, this.row);
    if (
      (color === null && this.color !== null) ||
      (color !== null &&
        (this.color === null || color.localeCompare(this.color) !== 0))
    ) {
      this.color = color;
    }
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(
      `[${this.constructor.name}]`,
      `[C${this.column}F${this.row}]`,
      ...message,
    );
  }
}
