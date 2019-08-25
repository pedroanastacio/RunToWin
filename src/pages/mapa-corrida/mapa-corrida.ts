import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { routeModel } from '../../models/routeModel';

declare var google;

@IonicPage()
@Component({
  selector: 'page-mapa-corrida',
  templateUrl: 'mapa-corrida.html',
})
export class MapaCorridaPage {
  routeKey: any;
  uid: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;
 
  isTracking = false;
  trackedRoute = [];
  previousTracks = [];
 
  positionSubscription: Subscription;

  dadosCorrida: any[];
  dbDadosCorrida: any;
  dadosRoute: any;
  data: String;
  distance: Number;
  calorias: Number;
  horas: Number;
  minutos: Number;
  segundos: Number;
  velocidadeMedia: Number;
  path: Array<Object>;
  posInicial: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private plt: Platform,
  private geolocation: Geolocation) {
    this.routeKey = this.navParams.data.key;
    this.uid = this.navParams.data.uid;

    this.dadosCorrida = new Array();
    var ref = firebase.database().ref("usuarios/" + this.uid + '/routes/' + this.routeKey)
    ref.on("value", (dataSnapshot) => {
    let route = dataSnapshot.val();
    for(let dados in route){
      this.dadosCorrida.push(
        this.dadosRoute =  new routeModel(
              route[dados].data,
              route[dados].distance,
              route[dados].calorias,
              route[dados].hora,
              route[dados].minutos,
              route[dados].segundos,
              route[dados].velocidadeMedia,
              route[dados].path,
          )
      )}
        this.data = route.data;
        this.distance = route.distance;
        this.calorias = route.calorias;
        this.horas = route.hora;
        this.minutos = route.minutos;
        this.segundos = route.segundos;
        this.velocidadeMedia = route.velocidadeMedia;
        this.path = route.path;
        this.pegarPosInicial();      
  })

  }

ionViewDidLoad() {
  this.plt.ready().then(() => {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 5000,
    };

    let mapOptions = {
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    new google.maps.LatLng();
      this.map.setCenter(this.posInicial);
      this.map.setZoom(18);
      
    this.redrawPath(this.path);
})
}

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

pegarPosInicial(){
  for(let i=0; i<this.path.length; i++){
    this.posInicial = this.path[0];
  }
}
}
