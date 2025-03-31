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
import { Square } from '../Utils/Square';

@Component({
  selector: 'game-square',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div
      *ngIf="square"
      [style.backgroundColor]="color"
      (click)="onSquareClick(square)"
    ></div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      div {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        background-color: #ccc;
      }
    `,
  ],
})
export class SquareView implements IObserver, OnInit, OnDestroy {
  private readonly gameController: GameController;
  private readonly cdRef: ChangeDetectorRef;

  public color: string | null;

  @Input()
  public square: Square | null;

  public constructor(
    @Inject(GAME_CONTROLLER)
    gameController: GameController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.gameController = gameController;
    this.color = null;
    this.square = null;
  }

  public ngOnInit(): void {
    this.gameController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.gameController.removeObserver(this);
  }

  public onSquareClick(square: Square): void {
    this.gameController.onSquareClick(square);
  }

  public notify(): void {
    const color = this.square?.getColor()?.getCssRGB() ?? null;
    if (color !== this.color) {
      this.color = color;
      this.cdRef.detectChanges();
    }
    this.log('Notified.');
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}
