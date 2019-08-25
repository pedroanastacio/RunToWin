import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Clipboard } from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';



@IonicPage()
@Component({
  selector: 'page-meus-cupons',
  templateUrl: 'meus-cupons.html',
})
export class MeusCuponsPage {
uid: any = this.afAuth.auth.currentUser.uid;  
cupons: any;
loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase,
  public afAuth: AngularFireAuth, private toast: ToastController, private clipboard: Clipboard,
  private iab: InAppBrowser, public loadingController:LoadingController) {
    this.cupons = this.getAll();
  }

  getAll(){
    this.loading = this.loadingController.create({ content: "Carregando cupons..." });
    this.loading.present();
    return this.db.list('usuarios/' + this.uid + '/cupons/')
      .snapshotChanges()
      .map(changes => {
        this.loading.dismissAll();
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
      })
  }

  removerCupom(key: string){
    this.db.list('usuarios/' + this.uid + '/cupons/').remove(key)
      .then(() => {
        this.toast.create({ message: 'Cupom removido com sucesso.', duration: 3000 }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao remover cupom.', duration: 3000 }).present();
      });
  }

  copiarCodigo(codigo: string){
    this.clipboard.copy(codigo);
  }

  irParaLoja(link: string){
    const browser = this.iab.create(link, '_system');
    browser.show();
  }
}
