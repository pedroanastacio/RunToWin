import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { fullPathModel } from '../../models/fullPathModel';


@Injectable()
export class ProdutosProvider {
  private PATH = 'produtos/';
  listaProdutos: any;
  dadosProduto: any;
  produto: any;
  fullPath: any;
  
 

  constructor(private db: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private fb: FirebaseApp) {

  }
  
  getAll(){
    return this.db.list(this.PATH, ref => ref.orderByChild('nomeProduto'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
      })
  }

  getListMarca(searchTerms){
    return this.db.list(this.PATH, ref => ref.orderByChild('marca').equalTo(searchTerms.searchTerm))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() }));
      })
  }

  getListPorcentagem(searchTerms){
    return this.db.list(this.PATH, ref => ref.orderByChild('porcentagem').equalTo(searchTerms.searchTerm))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() }));
      })
  }

  getListLoja(searchTerms){
    return this.db.list(this.PATH, ref => ref.orderByChild('loja').equalTo(searchTerms.searchTerm))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() }));
      })
  }

  save(produto: any, precoDesconto:any, kmPoints: any){
    return new Promise((resolve, reject) => { 
      if (produto.key) {
        this.db.object(this.PATH + produto.key)
          .update({ nomeProduto: produto.nomeProduto,
                    Preco: produto.preco,
                    Desconto: produto.porcentagem, 
                    PrecoDesconto: precoDesconto,
                    Sexo: produto.sexo, 
                    Categoria: produto.categoria, 
                    Marca: produto.marca, 
                    Tamanho: produto.tamanho, 
                    Loja: produto.loja,
                    KmPoints: kmPoints
          })
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ nomeProduto: produto.nomeProduto, 
                  Preco: produto.preco, 
                  Desconto: produto.porcentagem, 
                  PrecoDesconto: precoDesconto,
                  Sexo: produto.sexo, 
                  Categoria: produto.categoria, 
                  Marca: produto.marca, 
                  Tamanho: produto.tamanho, 
                  Loja: produto.loja,
                  KmPoints: kmPoints
          })
          .then(() =>{
            setTimeout(() =>{
              this.addKeyProduto();
            }, 2000)
          })
      }
    })
  }

  uploadAndSave(nomeProduto: any, keyProduto: any, fileToUpload: any){
      let item = {
        fullPath: '',
        url: '',
        fileToUpload: fileToUpload
      }  
      
      let storageRef = this.fb.storage().ref();
      let basePath = '/produtos/' + keyProduto;
      item.fullPath = basePath + '/' + nomeProduto + '.jpg';
      let uploadTask = storageRef.child(item.fullPath).putString(item.fileToUpload, 'base64');

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
        
        },
        (error) => {
          console.error(error);
        },
        () => {
          item.url = uploadTask.snapshot.downloadURL;
          this.db.object(this.PATH + keyProduto)
          .update({
              url: item.url,
              fullPath: item.fullPath
          })
        });
  }


  addKeyProduto(){
    this.db.list('produtos/').snapshotChanges()
      .subscribe(listaProdutos => {
        this.listaProdutos =  listaProdutos;
        
        for(let i=0; i<this.listaProdutos.length; i++){
          var ref = firebase.database().ref("produtos/" + this.listaProdutos[i].key)
          ref.once("value", (snapshot)=> {
            if(!snapshot.child("key").exists()){
              this.db.object("produtos/" + this.listaProdutos[i].key)
              .update({
                key: this.listaProdutos[i].key
              })
            }
          
          }); 
        }
      })
  }

  

  pegarFullPath(key: any){
    this.dadosProduto = new Array();
    var ref = firebase.database().ref(this.PATH + key);
    ref.on("value", (dataSnapshot) => {
    let produtos = dataSnapshot.val();
    for(let dados in produtos){
      this.dadosProduto.push(
        this.produto =  new fullPathModel(
              produtos[dados].fullPath,
              
          )
      )}
      this.fullPath = produtos.fullPath;
      console.log(this.fullPath);
  }); 
  }
 

  remove(key: string){
    this.pegarFullPath(key);
    return this.db.list(this.PATH).remove(key)
      .then(() => {
      this.removeFile(this.fullPath)
    });
  }
  
  
  removeFile(fullPath: string) {
    let storageRef = this.fb.storage().ref();
    storageRef.child(fullPath).delete();
  }
}
