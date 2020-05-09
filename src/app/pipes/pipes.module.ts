import { NgModule } from '@angular/core';
import { RomanizePipe } from './romanize.pipe';

@NgModule({
  declarations: [RomanizePipe],
  exports: [RomanizePipe],
})
export class PipesModule {}
