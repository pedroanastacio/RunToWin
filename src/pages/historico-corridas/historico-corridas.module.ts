import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoricoCorridasPage } from './historico-corridas';

@NgModule({
  declarations: [
    HistoricoCorridasPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoricoCorridasPage),
  ],
})
export class HistoricoCorridasPageModule {}
