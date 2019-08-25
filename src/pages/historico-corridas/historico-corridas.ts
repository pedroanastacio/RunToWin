import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CorridasProvider } from './../../providers/corridas/corridas';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DistanceTotalModel } from '../../models/DistanceTotalModel';
import { MapaCorridaPage } from '../mapa-corrida/mapa-corrida';

@IonicPage() 
@Component({
  selector: 'page-historico-corridas',
  templateUrl: 'historico-corridas.html',
})
export class HistoricoCorridasPage {
 

  corridas: Observable<any>;
  orderForm: FormGroup;
  reverse: boolean = false;

  dbTotalDist: any[];
  distanceTotal: DistanceTotalModel;
  totalDistance: Number;
  totalCal: Number;
  totalTimeRun: any;
  horas: any;
  minutos: any;
  minuto: any;
  segundos: any;
  horasFinal: number;
  minutosFinal: number;
  segundosFinal: number;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: CorridasProvider,
  private formBuilder: FormBuilder, public afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    
    this.orderForm = formBuilder.group({
			orderTerm: ['', Validators.required]
          });

          this.dbTotalDist = new Array();
          var ref = firebase.database().ref('usuarios/' + this.afAuth.auth.currentUser.uid + '/dados/');
          ref.on("value", (dataSnapshot) => {
          let users = dataSnapshot.val();
          for(let totalDistanceUser in users){
            this.dbTotalDist.push(
              this.distanceTotal =  new DistanceTotalModel(
                    users[totalDistanceUser].totalDistance,
                    users[totalDistanceUser].totalCal,
                    users[totalDistanceUser].totalTimeRun,
                    users[totalDistanceUser].KmPointsUser,
                )
            )}
            
            this.totalDistance = users.totalDistance;
            this.totalCal = users.totalCal;
            this.totalTimeRun = users.totalTimeRun;
            
            //Conversão do tempo
            this.horas = this.totalTimeRun/3600;
            let horasParc = parseInt(this.horas)
            this.minutos = (this.totalTimeRun -(3600*horasParc))/60;
            let minutosParc = parseInt(this.minutos);    
            this.segundos = (this.totalTimeRun -(3600*horasParc)-(minutosParc*60));
            let segundosParc = parseInt(this.segundos);

            this.horasFinal = horasParc;
            this.minutosFinal = minutosParc;
            this.segundosFinal = segundosParc;
           
          })           


  }

  ionViewDidLoad(){
    this.corridas = this.provider.getAll();
  }

orderDate(){
  this.reverse = false;
  this.provider.getAll();
  this.corridas = this.provider.getAll();
}
orderDateReverse(){
  this.reverse = true;
  this.corridas = this.provider.getAll();
}

orderDistance(){
  this.reverse = false;
  this.provider.getListDistance();
  this.corridas = this.provider.getListDistance();
}
orderDistanceReverse(){
  this.reverse = true;
  this.corridas = this.provider.getListDistance();
}

orderTime(){
  this.reverse = false;
  this.provider.getListTime();
  this.corridas = this.provider.getListTime();
}
orderTimeReverse(){
  this.reverse = true;
  this.corridas = this.provider.getListTime();
}

orderCalorias(){
  this.reverse = false;
  this.provider.getListCalorias();
  this.corridas = this.provider.getListCalorias();
}
orderCaloriasReverse(){
  this.reverse = true;
  this.corridas = this.provider.getListCalorias();
}

mostraTrajeto(key: any) {
  let uid = this.afAuth.auth.currentUser.uid;
  this.navCtrl.push(MapaCorridaPage, {key, uid})
}




}
