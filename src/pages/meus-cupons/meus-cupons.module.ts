import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeusCuponsPage } from './meus-cupons';

@NgModule({
  declarations: [
    MeusCuponsPage,
  ],
  imports: [
    IonicPageModule.forChild(MeusCuponsPage),
  ],
})
export class MeusCuponsPageModule {}
