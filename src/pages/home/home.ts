import { Component, ViewChild, ElementRef, AnimationStyles } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Geolocation } from '@ionic-native/geolocation';
import * as moment from 'moment';
import { Stepcounter } from '@ionic-native/stepcounter';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { CorridasProvider } from '../../providers/corridas/corridas';
import { PerfilModel } from '../../models/PerfilModel';
import { DistanceTotalModel } from '../../models/DistanceTotalModel';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';


declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
  })
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;
  isTracking = false;
  isRun = false;
  isReady = false;
  isReadyToRun = false;
  isPaused = false;
  refreshIntervalId: any;
  trackedRoute = [];
  previousTracks = [];
  positionSubscription: Subscription;

  private PATH = 'usuarios/' + this.afAuth.auth.currentUser.uid + '/routes/';
  private PATH2 = 'usuarios/' + this.afAuth.auth.currentUser.uid + '/dados/';
  private PATH3 = 'usuarios/' + this.afAuth.auth.currentUser.uid + '/perfil/';
  
  userID: any;

  public hora:number = 0;
  public minuto:number = 0;
  public segundo:number = 0;
  segundos: number = 0;
  public contaLoop:Array<any> = [];
  public contador:any;
  pause: boolean;
  pause2: boolean;
  
  totalSteps: any;
  steps: any;
  i: number = 0;
  distance: any = 0 ;
  
  distanceArred: number = 0;
  distanceParcial: any = 0;
  velocidadeMedia: any =0;
  caloriasTotal2: number = 0;

  //pegando dados firebase db
  perfil: any;
  distanceTotal: any;
  peso: number =0;
  totalDistance: string;
  dadosPerfil: any;
  dbTotalDist: any;
  
    
  lat1: any;
  lng1: any;
  lat2: any;
  lng2:any;

  latParc1: any;
  latParc2: any;
  lngParc1: any; 
  lngParc2: any;  
  pesoFloat: number;
  speed: number;
  speedKm: number;  
  totalCal: any;
  totalTimeRun: any;
  totalDistanceParcial: number;
  velocidadeMediaDB: number;
  totalKmUserDB: number;
  totalKmPointsUserDBParcial: number;

  loading: any;
  stateScreen: any;
  notificationAlreadyReceived: boolean = false;
 
  constructor(public navCtrl: NavController, public plt: Platform, private geolocation: Geolocation, 
  private db: AngularFireDatabase, public afAuth: AngularFireAuth, private stepcounter: Stepcounter, 
  private alertCtrl: AlertController, private corridasProvider: CorridasProvider, 
  public loadingController:LoadingController, public backgroundMode: BackgroundMode,
  public localNotifications: LocalNotifications) {
    
    //LEMBRAR DE HABILITAR ORIENTATION LOCK
    this.pegarDadosCorrida();
    this.pegarPeso();

    this.plt.ready().then(() => {
      this.backgroundMode.on("activate").subscribe(() => {
        console.log("activated");
        setInterval(this.atualizaPosicao, 20);
      });
      this.backgroundMode.enable();
      this.backgroundMode.on("activate").subscribe(() => {
        if(this.isTracking == true && this.notificationAlreadyReceived === false){
          this.showNotification()
        }
      });
    })
  }  

  ionViewDidLoad() {
    google.maps.event.trigger(this.map, 'resize');
    this.loadMap();
    // this.checkStepCounter();
  /* this.dbTotalDist = this.db.database.ref().child(this.PATH2);
   this.dbTotalDist.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      console.log(child.val())
      var new_totalDist = parseFloat(child.val());
      console.log(new_totalDist);
    });
    
  });*/
 
  }

 /* checkStepCounter(){
    if(this.plt.is('android')){
      this.stepcounter.deviceCanCountSteps().then((res: any) => {
        if (res == true) {  
          console.log("Dispositivo pode contar passos.");
          this.isReady = true;
        }
      }).catch((e) => {
        let alert = this.alertCtrl.create({
        title: 'Erro',
        subTitle: 'Dispositivo não pode contar passos.',
        buttons: [{text: 'Ok',
                  cssClass: 'buttonAlert'
        }],
        cssClass: 'alertLogin'
        });
        alert.present();
        console.log("Dispositivo não pode contar passos.")
        this.isReady = false;
    })  
    }
  }  */
     
  loadMap(){
    this.loading = this.loadingController.create({ content: "Carregando mapa..." });
    this.loading.present();
        let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 5000,
      };

      let mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };
      
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
      this.geolocation.getCurrentPosition(options).then(pos => {
        this.loading.dismissAll();
        this.isReadyToRun = true;
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
        
      }).catch((error) => {
        this.loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Erro ao capturar localização atual.',
          buttons: [{text: 'Ok',
                     cssClass: 'buttonAlert'
          }],
          cssClass: 'alertLogin'
        });
      alert.present();
     
      
      })
      
  }
   
  startTracking() {
    this.map.setZoom(18);
    this.isTracking = true;
    this.isRun = true;
    this.comeca();
    this.showNotification();
     
   //this.startCountSteps();
   
    this.trackedRoute = [];
    
    let options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 3600000,
    };

    this.geolocation.getCurrentPosition(options).then(startPos => {
      this.lat1 = startPos.coords.latitude;
      this.lng1 = startPos.coords.longitude;
    })
 
    this.positionSubscription = this.geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 3600000,
    })
      .pipe(
        filter((p) => p.coords !== undefined) //Filter Out Errors
      )
      .subscribe(data => {
        setTimeout(() =>{
          this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
          this.redrawPath(this.trackedRoute);
          this.speed = data.coords.speed;
          let speedParc = (this.speed*3.6).toFixed(1);
          this.speedKm = parseFloat(speedParc);
          this.lat2 = data.coords.latitude
          this.lng2 = data.coords.longitude

          this.calculateDistance(this.lat1, this.lng1, this.lat2, this.lng2);
          this.lat1 = this.lat2;
          this.lng1 = this.lng2; 
          let ILocalNotification ={
            id: 1
          }
          this.localNotifications.update(ILocalNotification);
              
        },0)  
      });

  }

  atualizaPosicao = () =>{
    this.trackedRoute = [];
    
    let options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 3600000,
    };

    this.geolocation.getCurrentPosition(options).then(startPos => {
      this.lat1 = startPos.coords.latitude;
      this.lng1 = startPos.coords.longitude;
      if(this.isTracking == true){
        this.trackedRoute.push({ lat: startPos.coords.latitude, lng: startPos.coords.longitude });
        this.redrawPath(this.trackedRoute);
        this.speed = startPos.coords.speed;
        let speedParc = (this.speed*3.6).toFixed(1);
        this.speedKm = parseFloat(speedParc);
        this.lat2 = startPos.coords.latitude
        this.lng2 = startPos.coords.longitude

        this.calculateDistance(this.lat1, this.lng1, this.lat2, this.lng2);
        this.lat1 = this.lat2;
        this.lng1 = this.lng2; 
        let ILocalNotification ={
          id: 1
        }
        this.localNotifications.update(ILocalNotification);
      }     
    })
      
    
  }

  showNotification () {
    this.localNotifications.schedule({
      id: 1,
      title: 'RunToWin',
      text: this.distanceArred + ' - ' + this.hora + ":" + this.minuto + ":" + this.segundo,
      sound: null,
      lockscreen: true
    });

    this.notificationAlreadyReceived = true;
  }
 
  /*startCountSteps(){  
      let startingOffset = 0;
          this.stepcounter.start(startingOffset)
           .then( (res: any) =>
            setInterval(()=>{
              this.stepcounter.getStepCount().then(res => {
               this.steps = res;
              // this.calcDistance(this.steps);
              }).catch((e)=>{
                let alert = this.alertCtrl.create({
                  title: 'Erro',
                  subTitle: 'Erro ao tentar contar passos.',
                  buttons: [{text: 'Ok',
                            cssClass: 'buttonAlert'
                  }],
                  cssClass: 'alertLogin'
                  });
                  alert.present();
                  console.log("Não foi possível contar passos.")
                  this.isReady = false;
                  this.isTracking = false;
                 // this.checkStepCounter();
                  
              })
            },800)
          )
          .catch((e)=>{
             let alert = this.alertCtrl.create({
            title: 'Erro',
            subTitle: 'Erro ao tentar contar passos.',
            buttons: [{text: 'Ok',
                      cssClass: 'buttonAlert'
            }],
            cssClass: 'alertLogin'
            });
            alert.present();
            console.log("Erro ao tentar contar passos.")
            this.isReady = false;
            this.isTracking = false;
           // this.checkStepCounter();
            //;
          })
  }*/
      



redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }
    if (path.length > 1) {
      var linhaBorda = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ece41a',
        strokeOpacity: 1.0,
        strokeWeight: 12,
      });
  
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: 'black',
        strokeOpacity: 1.0,
        strokeWeight: 8,
      });

      linhaBorda.setMap(this.map)
      this.currentMapTrack.setMap(this.map);
    }
  }

  stopTracking() {
    this.isTracking = false;
    this.isPaused = false;
    this.calcVelocidadeMedia();
    this.totalKmPointsUserDBParcial = this.distanceArred;
    if(this.velocidadeMedia > 20){
      let alert = this.alertCtrl.create({
        title: 'Corrida inválida',
        subTitle: 'Sua velocidade foi superior à velocidade comum de um corredor, portanto esta corrida será considerada inválida.',
        buttons: [{text: 'Ok',
                  cssClass: 'buttonAlert'
        }],
        cssClass: 'alertLogin'
        });
        alert.present();
        
    }
    else{
        this.calcCaloria();
        this.calcDistanceTotal();
        
        //this.countDistance();
        /*this.stepcounter.stop().then(res => {
          this.totalSteps = res;
          })
          .catch(e =>{
            let alert = this.alertCtrl.create({
              title: 'Erro',
              subTitle: 'Não foi possível contar o total de passos.',
              buttons: [{text: 'Ok',
                        cssClass: 'buttonAlert'
              }],
              cssClass: 'alertLogin'
              });
              alert.present();
              console.log("Não foi possível contar o total de passos.")
          })*/
        
        let newRoute = {
          hora: this.hora,
          minutos: this.minuto,
          segundos: this.segundo,
          tempoTotal: this.segundos,
          data: moment().format(),
          path: this.trackedRoute,
          userID: this.afAuth.auth.currentUser.uid,
          distance: this.distanceArred, 
          calorias: this.caloriasTotal2,
          velocidadeMedia: this.velocidadeMediaDB
          };
        //this.previousTracks.push(newRoute);
        this.db.list(this.PATH).push(newRoute);
        //this.storage.set('routes', this.previousTracks);
    }
    clearInterval(this.refreshIntervalId);
    this.positionSubscription.unsubscribe();
    this.lat1 = null;
    this.lng1 = null;
    this.lat2 = null;
    this.lng2 = null;
    this.refreshIntervalId = null;
    this.speedKm = null;
    this.speed = null;
    this.distance = 0;
    this.distanceParcial = 0;
    this.caloriasTotal2=0;
    this.distanceArred =0;
    this.parar();
    this.zerar();
    this.currentMapTrack.setMap(null);
    this.loadMap();
    
  }

  pauseCorrida(){
    this.isTracking = false;
    this.isPaused = true;
    this.speed = null;
    this.speedKm = 0;
    this.parar();
    clearInterval(this.refreshIntervalId);
    this.refreshIntervalId = null;
    this.positionSubscription.unsubscribe();
  }

  reiniciarCorrida(){
    this.isPaused = false;
    this.startTracking();
  }
   
  comeca(){
    this.pause = false;
    this.comeca1(this.pause);
  }
    
  comeca1(pause: boolean){
    this.pause2 = pause;
    this.comeca2();
  }
    
  comeca2(){
    if(!this.pause2){  
    if(this.contador == undefined){
      this.contador = setInterval(()=>{this.segundo += 1; this.segundos +=1;
           if(this.segundo == 60){
            this.segundo = 0;
            this.minuto += 1;
            if(this.minuto == 60){
              this.minuto = 0;
              this.hora += 1;
              if(this.hora = 24){
                this.hora = 0;
          }
        }
      }
      }, 1000);
    }     
    }
  }
  
  zerar(){
    clearInterval(this.contador);
    this.hora = 0;
    this.minuto = 0;
    this.segundo = 0;
    this.segundos = 0;
    this.contador = null;
  }
  
  parar(){
    clearInterval(this.contador);
    this.hora = this.hora;
    this.minuto = this.minuto;
    this.segundo = this.segundo;
    this.segundos = this.segundos;
    this.contador = null;
    this.pause = true;
    this.comeca1(this.pause);
  }

  pegarDadosCorrida(){
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
      this.totalKmUserDB = users.KmPointsUser;
     
    })   
  }

  pegarPeso(){
    var ref = firebase.database().ref("usuarios/" + this.afAuth.auth.currentUser.uid)
    ref.once("value", (snapshot)=> {
    if(snapshot.child("perfil").exists()){
      this.dadosPerfil = new Array();
      var ref = firebase.database().ref(this.PATH3);
      ref.on("value", (dataSnapshot) => {
        let perfils = dataSnapshot.val();
        for(let peso in perfils){
          this.dadosPerfil.push(
            this.perfil =  new PerfilModel(
                  perfils[peso].peso,
              )
           )
        }
        this.peso = perfils.peso;
        
      }); 
    }
    })  
  }

  calcVelocidadeMedia(){
    this.velocidadeMedia = this.distance/(this.segundos/3600);
    let speedMedia = parseFloat(this.velocidadeMedia.toFixed(1));
    this.velocidadeMediaDB = speedMedia;
  }

  calcCaloria(){
    this.pesoFloat = this.peso;
    this.caloriasTotal2 = parseFloat((((this.velocidadeMedia*this.pesoFloat*0.0175)*(this.segundos/60))/1000).toFixed(2));
  }
  
  calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    this.distance = this.distance + d;
    this.distanceArred = parseFloat(this.distance.toFixed(2)); 
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  
  calcDistanceTotal(){
    this.totalDistanceParcial = parseFloat(this.totalDistance);
    console.log("DistancetotalDb:" + this.totalDistanceParcial);
    this.totalDistanceParcial = this.totalDistanceParcial + this.distance;
    this.totalCal = this.totalCal + this.caloriasTotal2;
    this.totalTimeRun = this.totalTimeRun + this.segundos;
       
    let totalDistanceDB: number = parseFloat((this.totalDistanceParcial).toFixed(2));
    
    console.log("KmPointsParcial:" + this.totalKmPointsUserDBParcial);
    let totalKmPointsUserDB: number = this.totalKmUserDB + this.totalKmPointsUserDBParcial;

    console.log(this.totalKmUserDB + "+" + this.totalKmPointsUserDBParcial + "=" + totalKmPointsUserDB);
    this.db.object(this.PATH2).update({
      totalDistance: totalDistanceDB,
      totalCal: this.totalCal,
      totalTimeRun: this.totalTimeRun,
      KmPointsUser: totalKmPointsUserDB
    }).then(()=>{
      this.totalKmPointsUserDBParcial = 0;
    })
  }

  

  ionViewCanLeave(){
    if(this.isTracking){
      return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Corrida',
        subTitle: 'Se você sair desta página de corrida, a corrida será finalizada. Tem certeza que deseja sair?',
        buttons: [
          {text: 'Sim',
          cssClass: 'buttonAlert',
          handler: () =>{
            this.isTracking = false;
            this.isPaused = false;
            clearInterval(this.refreshIntervalId);
            this.lat1 = null;
            this.lng1 = null;
            this.lat2 = null;
            this.lng2 = null;
            this.refreshIntervalId = null;
            this.speedKm = null;
            this.speed = null;
            this.distance = 0;
            this.distanceArred = 0;
            this.distanceParcial = 0;
            this.caloriasTotal2=0;
            this.positionSubscription.unsubscribe();
            this.parar();
            this.zerar();
            resolve();
          }       
        },
        {
          text: 'Não',
          cssClass: 'buttonAlert',
          handler: () =>{
            reject();
          }  
        }

      ],
       cssClass: 'alertLogin'
        });
        alert.present();
    })
  }
  }
  
}
