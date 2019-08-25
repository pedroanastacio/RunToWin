import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database'; 



@Injectable()
export class UsuariosProvider {
  private PATH2 = 'usuarios/';
  userID: any;
  items: any;
  constructor(private db: AngularFireDatabase, public afAuth: AngularFireAuth) {
  }

  getPerfil(){
    this.userID = this.afAuth.auth.currentUser.uid
    return this.db.list(this.PATH2 + this.userID , ref => ref.orderByChild('userID').equalTo(this.userID))
    .snapshotChanges()
    .map(changes => {
      return changes.map(p => ({ key: p.payload.key, ...p.payload.val() }));
    })
  }

 

  get(key: string){
    return this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/perfil/' + key).snapshotChanges()
    .map(p => {
      return { key: p.key, ...p.payload.val() };
    });
  }

 
  save(userperfil: any){
    return new Promise((resolve, reject) => { 
      if (userperfil.key) {
        this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/perfil/' + userperfil.key)
          .update( { name: userperfil.name, sexo: userperfil.sexo, altura: userperfil.altura, peso: userperfil.peso })
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/perfil/')
          .set({ name: userperfil.name, sexo: userperfil.sexo, altura: userperfil.altura, peso: userperfil.peso })
          .then(() => resolve());
      }
    }) 
  }

  saveUserId(userID: any){
    this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/perfil/')
      .update({ userID: userID})
  }

  createTotalDistance(){
    let totalDistance:number = 0;
    let kmPoints: number =0;
    let totalTime: number=0;
    let totalCal: number=0;
    this.db.object('usuarios/' + this.afAuth.auth.currentUser.uid + '/dados/')
      .update({
         totalDistance: totalDistance,
         KmPointsUser: kmPoints,
         totalTimeRun: totalTime,
         totalCal: totalCal
      })
  }

  
}
