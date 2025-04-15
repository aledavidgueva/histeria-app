import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GameModule } from './Game/GameModule';

platformBrowserDynamic()
  .bootstrapModule(GameModule)
  .catch((err) => console.error(err));
