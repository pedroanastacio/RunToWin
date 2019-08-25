import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowProdutoPage } from './show-produto';

@NgModule({
  declarations: [
    ShowProdutoPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowProdutoPage),
  ],
})
export class ShowProdutoPageModule {}
