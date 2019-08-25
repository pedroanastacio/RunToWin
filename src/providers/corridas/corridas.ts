import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';

@Injectable()
export class CorridasProvider{
  private PATH = 'usuarios/' + this.afAuth.auth.currentUser.uid + '/routes/';
  private PATH2 = 'usuarios/' + this.afAuth.auth.currentUser.uid;

  totalDist: any = 0;
  constructor(private db: AngularFireDatabase, public afAuth: AngularFireAuth) {
  } 
  

  getAll(){
    return this.db.list(this.PATH, ref => ref.orderByChild('data'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
      })
  }

  getListDistance(){
    return this.db.list(this.PATH, ref => ref.orderByChild('distance'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
      })
  }

  getListTime(){
    return this.db.list(this.PATH, ref => ref.orderByChild('tempoTotal'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
      })
  }

  getTotalDistance(){
    return this.db.list(this.PATH, ref => ref.orderByChild('totalDistance'))
    .snapshotChanges()
    .map(changes => {
      return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
    })
  }

  getListCalorias(){
    return this.db.list(this.PATH, ref => ref.orderByChild('calorias'))
    .snapshotChanges()
    .map(changes => {
      return changes.map(p => ({ key: p.payload.key, ...p.payload.val() })); 
    })
  }
 
  
} 


