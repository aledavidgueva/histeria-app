import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
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
import { GAME_CONTROLLER, GameController } from '../Controllers/GameController';

export type ViewportOrientation = 'LANDSCAPE' | 'PORTRAIT';

@Component({
  selector: 'game-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="board">
      <div class="columns">
        @for (items of squares; track items) {
          <div class="rows">
            @for (square of items; track square) {
              <game-square
                class="square"
                [square]="square"
                [style.width]="
                  columns > rows
                    ? orientation === 'PORTRAIT'
                      ? 'calc(90vw / ' + columns + ')'
                      : 'calc(75vh / ' + columns + ')'
                    : orientation === 'PORTRAIT'
                      ? 'calc(90vw / ' + rows + ')'
                      : 'calc(75vh / ' + rows + ')'
                "
              >
                <!-- C{{ square.getColumn() }}F{{ square.getRow() }} -->
              </game-square>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .board {
        width: auto;
        margin: 0 auto;
        padding: 10px;
      }

      .columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .rows {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .square {
        aspect-ratio: 1;
        outline: 1px solid black;
        border: 1px solid black;
        box-sizing: border-box;
      }
    `,
  ],
})
export class BoardView implements IObserver, OnInit, OnDestroy {
  private readonly boardController: BoardController;
  private readonly cdRef: ChangeDetectorRef;

  public squares: Array<Array<Square>>;
  public columns: number;
  public rows: number;
  public orientation: ViewportOrientation;

  public constructor(
    @Inject(BOARD_CONTROLLER)
    boardController: BoardController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.boardController = boardController;
    this.squares = new Array();
    this.columns = 0;
    this.rows = 0;
    this.orientation = this.getOrientation(window); // window es global en este contexto
  }

  public ngOnInit(): void {
    this.boardController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.boardController.removeObserver(this);
  }

  public notify(): void {
    this.squares = [...this.boardController.getSquares()];
    this.columns = this.boardController.getColumns();
    this.rows = this.boardController.getRows();
    this.cdRef.detectChanges();
    this.log('Notified.');
  }

  private log(...message: string[]): void {
    console.log(`[${this.constructor.name}]`, ...message);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: Event): void {
    const orientation = this.getOrientation(event.target as Window);
    if (orientation !== this.orientation) {
      this.orientation = orientation;
      this.cdRef.detectChanges();
    }
  }

  private getOrientation(window: Window): ViewportOrientation {
    const orientation: ViewportOrientation =
      window.innerWidth < window.innerHeight ? 'PORTRAIT' : 'LANDSCAPE';
    return orientation;
  }
}
