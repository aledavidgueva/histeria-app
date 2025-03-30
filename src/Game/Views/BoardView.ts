import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IObserver } from '../Utils/IObserver';
import {
  BOARD_CONTROLLER,
  BoardController,
} from '../Controllers/BoardController';
import { Square } from '../Utils/Square';

@Component({
  selector: 'game-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div style="display: flex; flex-direction: row;">
      @for (columns of squares; track columns) {
        <div style="">
          @for (row of columns; track row) {
            <div>C{{ row.getColumn() }} R{{ row.getRow() }}</div>
          }
        </div>
        <hr />
      }
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
export class BoardView implements IObserver, OnInit, OnDestroy {
  private readonly boardController: BoardController;
  private readonly cdRef: ChangeDetectorRef;

  public squares: Array<Array<Square>>;

  public constructor(
    @Inject(BOARD_CONTROLLER) boardController: BoardController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.boardController = boardController;
    this.squares = new Array();
  }

  public ngOnInit(): void {
    this.boardController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.boardController.removeObserver(this);
  }

  public notify(): void {
    this.squares = this.boardController.getSquares();
    this.cdRef.detectChanges();
    this.log('Notified.');
  }

  private log(...message: string[]) {
    console.log(`[${this.constructor.name}]`, ...message);
  }
}
