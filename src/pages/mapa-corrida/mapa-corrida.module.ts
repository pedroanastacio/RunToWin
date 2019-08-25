import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaCorridaPage } from './mapa-corrida';

@NgModule({
  declarations: [
    MapaCorridaPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaCorridaPage),
  ],
})
export class MapaCorridaPageModule {}
