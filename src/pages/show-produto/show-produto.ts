import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { produtoModel } from '../../models/produtoModel';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { KmPointsUserModel } from '../../models/KmPointsUserModel';
import { Clipboard } from '@ionic-native/clipboard';


@IonicPage()
@Component({
  selector: 'page-show-produto',
  templateUrl: 'show-produto.html',
})
export class ShowProdutoPage {
  cupom: string;
  key: any;

  imgPath: string;
  fileToUpload: any;

  dadosProduto: any;
  produto: any;

  nomeProduto: any;
  preco: any;
  desconto: any;
  precoDesconto: any;
  sexo: any;
  loja: any;
  tamanhos: Array<String>;
  url: any;
  fullPath: any;
  kmPoints: number;
  dbKmPointsUser: any[];
  kmPointsUserDB: any;
  link: any;
  cor: any;

constructor(public navCtrl: NavController, public navParams: NavParams, private imagePicker: ImagePicker,
private provider: ProdutosProvider, public platform: Platform, private fb: FirebaseApp,
private db: AngularFireDatabase, public afAuth: AngularFireAuth, private clipboard: Clipboard,
private alertCtrl: AlertController, private iab: InAppBrowser) {
  
  this.key = this.navParams.data.key;
  this.pegaProduto();

  this.dbKmPointsUser = new Array();
  var ref = firebase.database().ref("usuarios/" + this.afAuth.auth.currentUser.uid + '/dados/')
  ref.on("value", (dataSnapshot) => {
    let users = dataSnapshot.val();
    for(let kmPointsUser in users){
      this.dbKmPointsUser.push(
        this.kmPointsUserDB =  new KmPointsUserModel(
              users[kmPointsUser].KmPointsUser,
          )
      )}
      
      this.kmPointsUserDB = users.KmPointsUser;
  })
    
}

pegaProduto(){
  this.dadosProduto = new Array();
  var ref = firebase.database().ref('produtos/' + this.key);
  ref.on("value", (dataSnapshot) => {
  let produtos = dataSnapshot.val();
  for(let dados in produtos){
    this.dadosProduto.push(
      this.produto =  new produtoModel(
            produtos[dados].nomeProduto,
            produtos[dados].Preco,
            produtos[dados].Desconto,
            produtos[dados].PrecoDesconto,
            produtos[dados].Sexo,
            produtos[dados].Loja,
            produtos[dados].Tamanho,
            produtos[dados].url,
            produtos[dados].fullPath,
            produtos[dados].KmPoints,
            produtos[dados].Link,
            produtos[dados].Cor,
            
        )
    )}
    this.nomeProduto = produtos.nomeProduto;
    this.preco = produtos.Preco;
    this.desconto = produtos.Desconto;
    this.precoDesconto = produtos.PrecoDesconto;
    this.sexo = produtos.Sexo;
    this.loja = produtos.Loja;
    this.tamanhos = produtos.Tamanho;
    this.url = produtos.url;
    this.fullPath = produtos.fullPath;
    this.kmPoints = produtos.KmPoints;
    this.link = produtos.Link;
    this.cor = produtos.Cor;
    
  });
}


escolherFoto() {
  this.platform.ready().then(() =>{
    this.imagePicker.hasReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.pegarImagem();
        } else {
          this.solicitarPermissao();
        }
      }).catch(error => {
        console.error('Erro ao verificar permissão', error);
    });
  })
}

solicitarPermissao() {
  this.imagePicker.requestReadPermission()
    .then(hasPermission => {
      if (hasPermission) {
        this.pegarImagem();
      } else {
        console.error('Permissão negada');
      }
    }).catch(error => {
      console.error('Erro ao solicitar permissão', error);
    });
}

pegarImagem() {
  this.imagePicker.getPictures({
    maximumImagesCount: 1, //Apenas uma imagem
    outputType: 1 //BASE 64
  })
    .then(results => {
      if (results.length > 0) {
        this.imgPath = 'data:image/png;base64,' + results[0];
        this.fileToUpload = results[0];

        this.provider.uploadAndSave(this.nomeProduto, this.key, this.fileToUpload)
      } else {
        this.imgPath = '';
        this.fileToUpload = null;
      }
    })
    .catch(error => {
      console.error('Erro ao recuperar a imagem', error);
    });
}

gerarCupom(){
  if(this.kmPoints > this.kmPointsUserDB){
    let alert = this.alertCtrl.create({
      title: 'Falhou! :(',
      subTitle: 'Seu saldo KmPoints não é suficiente.',
      buttons: [{text: 'Ok',
                cssClass: 'buttonAlert'
      }],
      cssClass: 'alertKmPoints'
      });
      alert.present();
  }
  else{
    this.kmPointsUserDB = this.kmPointsUserDB - this.kmPoints;
    this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/dados/')
      .update({
        KmPointsUser: this.kmPointsUserDB
      }).then(() =>{
        this.cupom = this.db.createPushId();
        this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/cupons/' + this.cupom)
          .set({
            produto: this.nomeProduto,
            urlFoto: this.url,
            loja: this.loja,
            codigo: this.cupom,
            status: true,
            link: this.link
          }).then(() =>{
              let codigo = this.cupom;
              let alert = this.alertCtrl.create({
                title: 'Cupom',
                subTitle: codigo,
                buttons: [
                  {
                    text: 'Cancelar',
                    cssClass: 'buttonCancelar',
                    handler: () =>{
                    console.log('Cancelar');
                    }
                  },
                  {
                    text: 'Copiar',
                    cssClass: 'buttonCopiar',
                    handler: () =>{
                    this.copyText();
                    }
                  },
                ],
                cssClass: 'alertCupom'
                });
                alert.present();
          })
      })
      .catch((e) =>{
        console.log(e);
        let alert = this.alertCtrl.create({
          title: 'Falhou! :(',
          subTitle: 'Houve um erro ao tentar pegar cupom',
          buttons: [{text: 'Ok',
                    cssClass: 'buttonAlert'
          }],
          cssClass: 'alertLogin'
          });
          alert.present();
      })
  }
}

copyText(){
  this.clipboard.copy(this.cupom);
}

irParaLoja(){
  const browser = this.iab.create(this.link, '_system');
  browser.show();
}

}
