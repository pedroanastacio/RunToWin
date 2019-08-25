import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProdutosPage } from './add-produtos';

@NgModule({
  declarations: [
    AddProdutosPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProdutosPage),
  ],
})
export class AddProdutosPageModule {}
